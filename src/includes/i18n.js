import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import tw from "@/locales/tw.json";

// import { VueI18n } from "vue-i18n";
export const i18n = createI18n({
  legacy: false,
  locale: "en", // default
  fallbackLocale: "en", // 如果選到沒支援的語系，轉成的語系
  messages: {
    en,
    tw,
  },
  numberFormats: {
    // format https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
    en: {
      currency: {
        style: "currency",
        currency: "USD",
      },
    },
    ja: {
      currency: {
        style: "currency",
        currency: "JPY",
      },
    },
  },
});
