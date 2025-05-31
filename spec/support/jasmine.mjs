export default {
  spec_dir: "",
  spec_files: [
    "src/**/*_test.ts",
    "src/**/*_test.tsx",
    "!src/e2e/*",
    "!src/prober/*",
  ],
  env: {
    stopSpecOnExpectationFailure: false,
    random: true,
    forbidDuplicateNames: true,
  },
};
