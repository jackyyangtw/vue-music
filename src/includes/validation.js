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
import { i18n } from "./i18n";
export default {
  install(app) {
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
      validateOnBlur: true,
      validateOnChange: true,
      validateOnInput: false, // if true 如果錯誤就直接feedback 很擾人
      validateOnModelUpdate: true, // v-model更新的話 也會跟著更新
    });
  },
};
