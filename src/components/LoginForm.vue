<template>
  <div
    v-if="loginState.loginShowAlert"
    class="text-white text-center font-blod p-4 mb-4 transition"
    :class="loginState.loginAlertVariant"
  >
    {{ loginState.loginAlertMsg }}
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
      :disabled="loginState.loginInSubmission"
    >
      Submit
    </button>
  </vee-form>
</template>

<script>
import { ErrorMessage } from "vee-validate";
// import useUserStore from "@/stores/user";
// import { mapActions } from "pinia";
import { useUserStore } from "../stores/user";
// import { storeToRefs } from "pinia";
import { reactive } from "vue";
export default {
  components: {
    ErrorMessage,
  },
  setup() {
    const userStore = useUserStore();
    const { authenticateAction } = userStore;
    const loginSchema = {
      email: "required|min:3|max:100|email",
      password: "required|min:9|max:100",
    };
    const loginState = reactive({
      loginInSubmission: false,
      loginShowAlert: false,
      loginAlertVariant: "bg-blue-500",
      loginAlertMsg: "Please wait! We are logging you in.",
    });

    const login = async (values) => {
      loginState.loginInSubmission = true;
      loginState.loginShowAlert = true;
      loginState.loginAlertVariant = "bg-blue-500";
      loginState.loginAlertMsg = "Please wait! We are logging you in.";

      try {
        await authenticateAction(values);
        loginState.loginAlertVariant = "bg-green-500";
        loginState.loginAlertMsg = "Success! You are now logged in!";
        window.location.reload();
      } catch (err) {
        loginState.loginInSubmission = false;
        loginState.loginAlertVariant = "bg-red-500";
        loginState.loginAlertMsg = "Invalid login details.";
      }
    };

    return { loginSchema, loginState, login };
  },
  // data() {
  //   return {
  //     loginSchema: {
  //       email: "required|min:3|max:100|email",
  //       password: "required|min:9|max:100",
  //     },
  //     loginInSubmission: false,
  //     loginShowAlert: false,
  //     loginAlertVariant: "bg-blue-500",
  //     loginAlertMsg: "Please wait! We are logging you in.",
  //   };
  // },
  // methods: {
  //   // ...mapActions(useUserStore, ["authenticateAction"]),
  //   async login(values) {
  //     this.loginInSubmission = true;
  //     this.loginShowAlert = true;
  //     this.loginAlertVariant = "bg-blue-500";
  //     this.loginAlertMsg = "Please wait! We are logging you in.";

  //     try {
  //       await this.authenticateAction(values);
  //       this.loginAlertVariant = "bg-green-500";
  //       this.loginAlertMsg = "Success! You are now logged in!";
  //       window.location.reload();
  //     } catch (err) {
  //       this.loginInSubmission = false;
  //       this.loginAlertVariant = "bg-red-500";
  //       this.loginAlertMsg = "Invalid login details.";
  //     }
  //   },
  // },
};
</script>
