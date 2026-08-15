{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "scope-enum": [2, "always", [
      "storefront",
      "admin",
      "api",
      "db",
      "contracts",
      "infra",
      "docs",
      "deps",
      "release"
    ]],
    "type-enum": [2, "always", [
      "feat",
      "fix",
      "docs",
      "style",
      "refactor",
      "perf",
      "test",
      "build",
      "ci",
      "chore",
      "revert"
    ]],
    "subject-case": [0],
    "header-max-length": [2, "always", 120]
  }
}
