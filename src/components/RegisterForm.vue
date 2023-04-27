<template>
  <!-- Registration Form Message -->
  <div
    class="text-white text-center font-bold p-4 rounded mb-4"
    v-if="regState.regShowAlert"
    :class="regState.regAlertVariant"
  >
    {{ regState.regAlertMsg }}
  </div>
  <!-- Registration Form -->
  <vee-form
    :validation-schema="schema"
    @submit="register"
    :initial-values="userData"
  >
    <!-- Name -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("input_field.name") }}</label>
      <vee-field
        name="name"
        type="text"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('input_field.name_placeholder')"
        autocomplete="name"
      />
      <ErrorMessage class="text-red-600" name="name"></ErrorMessage>
    </div>
    <!-- Email -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("input_field.email") }}</label>
      <vee-field
        type="email"
        name="email"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('input_field.email_placeholer')"
        autocomplete="email"
      />
      <ErrorMessage class="text-red-600" name="email"></ErrorMessage>
    </div>
    <!-- Age -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("input_field.age") }}</label>
      <vee-field
        type="number"
        name="age"
        autocomplete="age"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      />
      <ErrorMessage class="text-red-600" name="age"></ErrorMessage>
    </div>
    <!-- Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("input_field.password") }}</label>
      <vee-field name="password" :bails="false" v-slot="{ field }">
        <input
          type="password"
          class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
          :placeholder="$t('input_field.password_placeholder')"
          v-bind="field"
          autocomplete="password"
        />
      </vee-field>
      <ErrorMessage class="text-red-600" name="password"></ErrorMessage>
    </div>
    <!-- Confirm Password -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{
        $t("input_field.confirm_password")
      }}</label>
      <vee-field
        type="password"
        name="confirm_password"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
        :placeholder="$t('input_field.confirm_password_placeholder')"
        autocomplete="password"
      />
      <ErrorMessage class="text-red-600" name="confirm_password"></ErrorMessage>
    </div>
    <!-- Country -->
    <div class="mb-3">
      <label class="inline-block mb-2">{{ $t("input_field.country") }}</label>
      <vee-field
        as="select"
        name="country"
        autocomplete="country"
        class="block w-full py-1.5 px-3 text-gray-800 border border-gray-300 transition duration-500 focus:outline-none focus:border-black rounded"
      >
        <option
          v-for="country in allCountry"
          :value="country.name"
          :key="country.name"
        >
          {{ country.name }}
        </option>
      </vee-field>
      <ErrorMessage class="text-red-600" name="country"></ErrorMessage>
    </div>
    <!-- TOS -->
    <div class="mb-3 pl-6">
      <vee-field
        type="checkbox"
        name="tos"
        value="1"
        class="w-4 h-4 float-left -ml-6 mt-1 rounded"
      />
      <!-- translate HTML code -->
      <i18n-t class="block" keypath="register.accept" tag="label"
        ><a href="#">{{ $t("register.tos") }}</a></i18n-t
      >
      <ErrorMessage class="text-red-600" name="tos"></ErrorMessage>
    </div>

    <!-- 加入disabled非常重要，避免重複的submit -->
    <button
      type="submit"
      class="block w-full bg-purple-600 text-white py-1.5 px-3 rounded transition hover:bg-purple-700"
      :disabled="regState.regInSubmission"
    >
      {{ $t("header.submit") }}
    </button>
  </vee-form>
</template>

<script>
import { ErrorMessage } from "vee-validate";
import { useUserStore } from "../stores/user";
import { reactive } from "vue";
import { useI18n } from "vue-i18n";
import { ref } from "vue";

export default {
  components: {
    ErrorMessage,
  },
  setup() {
    const allCountry = ref([]);
    const getAllContry = async () => {
      const res = await fetch("https://restcountries.com/v2/all");
      const data = await res.json();
      data.forEach((data) => allCountry.value.push(data));
    };
    getAllContry();

    const schema = {
      name: "required|min:3|max:100|alpha_spaces",
      email: "required|min:3|max:100|email",
      age: "required|min_value:18|max_value:100",
      password: "required|min:9|max:100|excluded:password",
      confirm_password: "passwords_mismatch:@password",
      country: "required|country_excluded:Antarctica",
      tos: "tos",
    };
    const userData = {
      country: "Mexico",
    };

    const i18n = useI18n();
    const { t } = i18n;
    const regState = reactive({
      regInSubmission: false,
      regShowAlert: false,
      regAlertVariant: "bg-blue-500",
      regAlertMsg: t("app_state.creating_account"),
    });

    const userStore = useUserStore();
    const { registerAction: createUser } = userStore;
    const register = async (values) => {
      regState.regShowAlert = true;
      regState.regInSubmission = true;
      regState.regAlertVariant = "bg-blue-500";
      regState.regAlertMsg = t("app_state.creating_account");

      try {
        await createUser(values); // 存使用者帳密
      } catch (err) {
        console.log(err);
        regState.regInSubmission = false;
        regState.regAlertVariant = "bg-red-500";
        regState.regAlertMsg = t("app_state.create_account_error");
        return;
      }

      regState.regAlertVariant = "bg-green-500";
      regState.regAlertMsg = t("app_state.create_account_success");
      window.location.reload();
    };
    return {
      schema,
      userData,
      register,
      regState,
      allCountry,
    };
  },
};
</script>
