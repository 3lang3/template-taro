const TYPE_ENUM = [
  /**
   * 编译代码提交
   */
  "build",
  /**
   * 杂项提交
   */
  "chore",
  /**
   * 文档修改
   */
  "docs",
  /**
   * 新特性提交
   */
  "feat",
  /**
   * bug修复
   */
  "fix",
  /**
   * 样式调整
   */
  "UI",
];

module.exports = {
  rules: {
    "body-leading-blank": [1, "always"],
    "body-max-line-length": [2, "always", 100],
    "footer-leading-blank": [1, "always"],
    "footer-max-line-length": [2, "always", 100],
    "header-max-length": [2, "always", 100],
    "scope-case": [2, "always", "lower-case"],
    "subject-case": [2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]],
    "subject-empty": [1, "never"],
    "subject-full-stop": [2, "never", "."],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    "type-enum": [2, "always", TYPE_ENUM],
  },
};
