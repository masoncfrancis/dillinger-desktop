import nextConfig from "eslint-config-next/core-web-vitals";

const projectConfig = [
  ...nextConfig,
  {
    ignores: ["release/**"],
  },
  {
    rules: {
      // Existing effects intentionally synchronize local UI state with external documents.
      "react-hooks/set-state-in-effect": "off",
    },
  },
];

export default projectConfig;
