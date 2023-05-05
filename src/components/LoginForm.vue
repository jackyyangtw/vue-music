<template>
  <div
    v-if="loginState.loginShowAlert"
    class="text-white text-center font-blod p-4 my-5 transition"
    :class="loginState.loginAlertVariant"
  >
    {{ loginState.loginAlertMsg }}
  </div>
  <vee-form :validation-schema="loginSchema" @submit="login" class="py-3">
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("input_field.email") }}</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('input_field.email_placeholer')"
        autocomplete="email"
        v-model="email_field"
      />
      <ErrorMessage class="text-red-600" name="email"></ErrorMessage>
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("input_field.password") }}</label>
      <vee-field
        type="password"
        name="password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('input_field.password_placeholder')"
        autocomplete="password"
      />
      <ErrorMessage class="text-red-600" name="password"></ErrorMessage>
    </div>
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 mt-7 rounded transition hover:bg-purple-700"
      :disabled="loginState.loginInSubmission"
    >
      {{ $t("header.submit") }}
    </button>
  </vee-form>
</template>

<script>
import { ErrorMessage } from "vee-validate";
import { useUserStore } from "../stores/user";
import { reactive, ref } from "vue";
import { useGlobalStore } from "../stores/global";
import { storeToRefs } from "pinia";
import { useI18n } from "vue-i18n";
export default {
  components: {
    ErrorMessage,
  },
  setup() {
    const email_field = ref("");
    const userStore = useUserStore();
    const { authenticateAction } = userStore;
    const loginSchema = {
      email: "required|min:3|max:100|email",
      password: "required|min:9|max:100",
    };

    const i18n = useI18n();
    const { t } = i18n;
    const loginState = reactive({
      loginInSubmission: false,
      loginShowAlert: false,
      loginAlertVariant: "bg-blue-500",
      loginAlertMsg: t("app_state.logging_in"),
    });

    const globalStore = useGlobalStore();
    const { IsKeydownSpaceEventActive } = storeToRefs(globalStore);
    const login = async (values) => {
      loginState.loginInSubmission = true;
      loginState.loginShowAlert = true;
      loginState.loginAlertVariant = "bg-blue-500";
      loginState.loginAlertMsg = t("app_state.logging_in");

      try {
        await authenticateAction(values);
        loginState.loginAlertVariant = "bg-green-500";
        loginState.loginAlertMsg = t("app_state.login_success");
        window.location.reload();
        IsKeydownSpaceEventActive.value = false;
      } catch (err) {
        loginState.loginInSubmission = false;
        loginState.loginAlertVariant = "bg-red-500";
        loginState.loginAlertMsg = t("app_state.login_error");
      }
    };

    return { email_field, loginSchema, loginState, login };
  },
};
</script>
