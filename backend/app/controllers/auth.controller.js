const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// In-memory storage for OTPs (replace this with a database in a real application)
const otpStorage = {};

// Generate a random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Store the OTP for a user (you may want to use a database for this)
const storeOTP = (userId, otp) => {
  otpStorage[userId] = otp;
};

// Retrieve the stored OTP for a user (replace this with a database query)
const retrieveOTP = (userId) => {
  return otpStorage[userId];
};

exports.signup = (req, res) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  // Save the user without checking roles
  user.save((err) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    res.send({ message: "User was registered successfully!" });
  });
};

exports.signin = (req, res) => {
  User.findOne({
    username: req.body.username,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      console.log("invalid");
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, config.secret, {
      algorithm: "HS256",
      allowInsecureKeySizes: true,
      expiresIn: 86400, // 24 hours
    });

    res.status(200).send({
      id: user._id,
      username: user.username,
      email: user.email,
      accessToken: token,
    });
  });
};

exports.requestPasswordReset = (req, res) => {
  const { email } = req.body;

  // Find the user by email
  User.findOne({ email }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    // Generate OTP
    const otp = generateOTP();

    // Store the OTP for the user (you may want to use a database for this)
    storeOTP(user._id, otp);

    // Send OTP via email
    // sendOTP(email, otp);

    console.log("otp is to be sent in email . ...  : " + otp);

    res.status(200).send({ message: "OTP sent successfully." + otp });
  });
};

// Step 2: Verify OTP and Reset Password
exports.verifyAndResetPassword = (req, res) => {
  const { email, otp, newPassword } = req.body;

  // Find the user by email
  User.findOne({ email }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    // Verify the provided OTP against the stored OTP
    // (You should compare the OTP securely, possibly using a secure comparison library)
    const storedOTP = retrieveOTP(user._id); // Implement your logic to retrieve stored OTP

    if (otp !== storedOTP) {
      return res.status(401).send({
        message: "Invalid OTP!",
      });
    }

    // Reset the password
    let password = bcrypt.hashSync(newPassword, 8);

    const updatedFields = { password };

    User.findByIdAndUpdate({ email: user.email }, updatedFields, {
      useFindAndModify: false,
    })
      .then((data) => {
        if (!data) {
          res.status(404).send({
            message: `Cannot update User with id=${id}. Maybe User was not found!`,
          });
        } else res.send({ message: "User was updated successfully." });
      })
      .catch((err) => {
        res.status(500).send({
          message: "Error updating User with id=" + id,
        });
      });
  });
};

// Send OTP via email
const sendOTP = (email, otp) => {
  // Implement your logic to send the OTP via email
  // You can use nodemailer or any other email-sending library
  // Example nodemailer setup:
  const transporter = nodemailer.createTransport({
    // your email configuration
    service: "gmail",
    auth: {
      user: "your-email@gmail.com",
      pass: "your-email-password",
    },
  });

  const mailOptions = {
    from: "your-email@gmail.com",
    to: email,
    subject: "Password Reset OTP",
    text: `Your OTP for password reset is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};
