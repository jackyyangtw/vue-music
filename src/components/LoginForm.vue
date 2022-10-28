<template>
  <div
    v-if="loginShowAlert"
    class="text-white text-center font-blod p-4 mb-4"
    :class="loginAlertVariant"
  >
    {{ loginAlertMsg }}
  </div>
  <vee-form :validation-schema="loginSchema" @submit="login">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">Email</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Enter Email"
      />
      <ErrorMessage class="text-red-600" name="email"></ErrorMessage>
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">Password</label>
      <vee-field
        type="password"
        name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        placeholder="Password"
      />
      <ErrorMessage class="text-red-600" name="password"></ErrorMessage>
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="loginInSubmission"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
import { ErrorMessage } from "vee-validate";
export default {
  components: {
    ErrorMessage,
  },
  data() {
    return {
      loginSchema: {
        email: "required|min:3|max:100|email",
        password: "required|min:9|max:100",
      },
      loginInSubmission: false,
      loginShowAlert: false,
      loginAlertVariant: "bg-blue-500",
      loginAlertMsg: "Please wait! We are logging you in.",
    };
  },
  methods: {
    login(values) {
      this.loginInSubmission = true;
      this.loginShowAlert = true;
      this.loginAlertVariant = "bg-blue-500";
      this.loginAlertMsg = "Please wait! We are logging you in.";

      this.loginAlertVariant = "bg-green-500";
      this.loginAlertMsg = "Success! You are now logged in!";
      console.log(values);
    },
  },
};
</script>
