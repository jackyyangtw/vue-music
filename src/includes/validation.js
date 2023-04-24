import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure,
} from "vee-validate";
import {
  required,
  min,
  max,
  alpha_spaces as alphaSpaces,
  email,
  min_value as minVal,
  max_value as maxVal,
  confirmed,
  not_one_of as excluded,
  is_not,
} from "@vee-validate/rules";
// import { useI18n } from "vue-i18n";
import { i18n } from "./i18n";
export default {
  install(app) {
    // const { t } = useI18n();
    // app.config.globalProperties.$t = useI18n().t;
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
    app.component("ErrorMessage", ErrorMessage);

    defineRule("required", required);
    defineRule("tos", required);
    defineRule("min", min);
    defineRule("max", max);

    // 只能輸入英文 如果輸入數字會出錯
    defineRule("alpha_spaces", alphaSpaces);

    defineRule("email", email);
    defineRule("min_value", minVal);
    defineRule("max_value", maxVal);

    // confirm password
    defineRule("passwords_mismatch", confirmed);
    defineRule("excluded", excluded);
    defineRule("country_excluded", excluded);

    defineRule("not_same_value", is_not);

    configure({
      generateMessage: (ctx) => {
        const { t } = i18n.global;
        const field = ctx.field;
        const messages = {
          required: t("input_error.messages.required", {
            field,
          }),
          min: t("input_error.messages.min", { field }),
          max: t("input_error.messages.max", { field }),
          alpha_spaces: t("input_error.messages.alpha_spaces", {
            field,
          }),
          email: t("input_error.messages.email", { field }),
          min_value: t("input_error.messages.min_value", {
            field,
          }),
          max_value: t("input_error.messages.max_value", {
            field,
          }),
          excluded: t("input_error.messages.excluded", {
            field,
          }),
          country_excluded: t("input_error.messages.country_excluded", {
            field,
          }),
          passwords_mismatch: t("input_error.messages.passwords_mismatch"),
          tos: t("input_error.messages.tos"),
          not_same_value: t("input_error.messages.not_same_value", {
            field,
          }),
        };

        return (
          messages[ctx.rule.name] ||
          i18n.t("input_error.messages.invalid", { field })
        );
      },

      // generateMessage: (ctx) => {
      //   // const messages = {
      //   //   required: `The field ${ctx.field} is required.`,
      //   //   min: `The field ${ctx.field} is too short`,
      //   //   max: `The field ${ctx.field} is too long`,
      //   //   alpha_spaces: `The field ${ctx.field} may only contain alphabetical characters and spaces.`,
      //   //   email: `The field ${ctx.field} must be a valid email`,
      //   //   min_value: `The field ${ctx.field} is too low`,
      //   //   max_value: `The field ${ctx.field} is too high`,
      //   //   excluded: `Yor are not allowed to use this value for the field ${ctx.field}`,
      //   //   country_excluded: `Due to restrictions, we de not accept users from this location`,
      //   //   passwords_mismatch: "The passwords don't match.",
      //   //   tos: `You must accept the Terms of Service`,
      //   //   not_same_value: `The field can not be the same value`,
      //   // };

      //   // const message = messages[ctx.rule.name]
      //   //   ? messages[ctx.rule.name]
      //   //   : `The field ${ctx.field} is invalid`;

      //   return message;
      // },
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false, // if true 如果錯誤就直接feedback 很擾人
      validateOnModelUpdate: true, // v-model更新的話 也會跟著更新
    });
  },
};
console.log(i18n);
