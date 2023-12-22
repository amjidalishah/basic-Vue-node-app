<script setup>
import { Form, Field } from "vee-validate";
import * as Yup from "yup";

import { computed } from "vue";

import { useAuthStore } from "@/stores";

const schema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string().required("Email is required"),
  password: Yup.string().required("Password is required"),
});
const authStore = useAuthStore();

const status = computed(() => authStore.status);

function onSubmit(values, { setErrors }) {
  const { username, email, password } = values;

  return authStore
    .signup(username, email, password)
    .catch((error) => setErrors({ apiError: error }));
}
</script>

<template>
  <section class="bg-gray-50 dark:bg-gray-900">
    <div
      class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
    >
      <div
        class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
      >
        <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1
            class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
          >
            Sign up to your account
          </h1>

          <span v-if="status?.message" class="text-xl mt-3">
            {{ status?.message }}</span
          >

          <Form
            class="space-y-4 md:space-y-6"
            @submit="onSubmit"
            :validation-schema="schema"
            v-slot="{ errors, isSubmitting }"
          >
            <div class="form-group">
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Email
              </label>
              <Field
                name="email"
                type="text"
                class="form-control bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :class="{ 'is-invalid': errors.email }"
              />
              <div class="invalid-feedback">{{ errors.email }}</div>
            </div>

            <div class="form-group">
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >User Name</label
              >
              <Field
                name="username"
                type="text"
                class="form-control bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :class="{ 'is-invalid': errors.username }"
              />
              <div class="invalid-feedback">{{ errors.username }}</div>
            </div>

            <div class="form-group">
              <label
                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >Password</label
              >

              <Field
                name="password"
                type="password"
                class="form-control bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                :class="{ 'is-invalid': errors.password }"
              />
              <div class="invalid-feedback">{{ errors.password }}</div>
            </div>

            <button
              type="submit"
              class="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            >
              Sign up
            </button>
            <div class="flex">
              <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have account?

                <RouterLink
                  to="/signin"
                  class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
                  >Sign in</RouterLink
                >
              </p>
            </div>
          </Form>
        </div>
      </div>
    </div>
  </section>
</template>
