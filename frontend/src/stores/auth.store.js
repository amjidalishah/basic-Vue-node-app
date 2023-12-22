import { defineStore } from "pinia";

import { router } from "@/helpers";

import AuthDataService from "../services/AuthDataService";

export const useAuthStore = defineStore({
  id: "auth",
  state: () => ({
    // initialize state from local storage to enable user to stay logged in
    user: JSON.parse(localStorage.getItem("user")),
    returnUrl: null,
    status: null,
    resetLink: "",
  }),
  actions: {
    async login(username, password) {
      await AuthDataService.login({
        username,
        password,
      })
        .then((user) => {
          this.status = user.data;
          setTimeout(() => {
            // update pinia state
            this.user = user.data;

            // store user details and jwt in local storage to keep user logged in between page refreshes
            localStorage.setItem("user", JSON.stringify(user.data));

            router.push(this.returnUrl || "/");
          }, 2000);
        })
        .catch((error) => {
          this.status = error.response.data;
        });
    },
    async signup(username, email, password) {
      await AuthDataService.signup({
        username,
        password,
        email,
      })
        .then((res) => {
          this.status = res.data;
          setTimeout(() => {
            router.push(this.returnUrl || "/signin");
          }, 2000);
        })
        .catch((error) => {
          this.status = error.response.data;
        });
    },

    async forgot(email) {
      await AuthDataService.forgot({ email })
        .then((res) => {
          this.status = res.data;

          this.resetLink = "reset-password";
        })
        .catch((error) => {
          this.status = error.response.data;
        });
    },
    async resetPWD(email, otp, newPassword) {
      console.log("reset pwd store");
      await AuthDataService.resetPWD({ email, otp, newPassword })
        .then((res) => {
          this.status = res.data;
        })
        .catch((error) => {
          this.status = error.response.data;
        });
    },

    logout() {
      this.user = null;
      localStorage.removeItem("user");
      router.push("/signin");
    },
  },
});
