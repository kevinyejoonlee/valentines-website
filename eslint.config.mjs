import next from "eslint-config-next";

const config = [
  ...next,
  {
    // Photos + legacy static site aren't meaningful to lint.
    ignores: ["cindy/**", "public/cindy/**", "legacy/**"],
  },
  {
    rules: {
      // This page intentionally uses many absolutely-positioned thumbnail <img>s.
      "@next/next/no-img-element": "off",
    },
  },
];

export default config;

