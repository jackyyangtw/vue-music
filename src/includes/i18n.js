import { createI18n } from "vue-i18n";
import en from "@/locales/en.json";
import fr from "@/locales/fr.json";
import tw from "@/locales/tw.json";
export default createI18n({
  locale: "en", // default
  fallbackLocale: "en", // 如果選到沒支援的語系，轉成的語系
  messages: {
    en,
    fr,
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
