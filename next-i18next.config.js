const HttpBackend = require("i18next-http-backend/cjs");
const ChainedBackend = require("i18next-chained-backend").default;
const LocalStorageBackend = require("i18next-localstorage-backend").default;

const isDev = process.env.NODE_ENV === "development";

module.exports = {
  backend: {
    backendOptions: [
      { expirationTime: isDev ? 0 : 60 * 60 * 1000 },
      {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
      },
    ],
    backends:
      typeof window !== "undefined" ? [LocalStorageBackend, HttpBackend] : [],
  },

  i18n: {
    defaultLocale: "en",
    locales: ["en", "fr"],
    defaultNS: "common",
    ns: ["common", "countries", "logs", "job", "user-management", "role", "permissions"],
  },
  reloadOnPrerender: isDev,
  serializeConfig: false,
  use: typeof window !== "undefined" ? [ChainedBackend] : [],
  localeDetection: false,
};
