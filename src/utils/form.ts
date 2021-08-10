import { showToast } from '@tarojs/taro';

type RuleItem = {
  required?: boolean;
  message?: string;
  validator?: (value: any) => boolean;
  pattern?: RegExp;
};

export type FieldItem = {
  label: string;
  rules?: RuleItem[];
};

export function validateFields(values: Record<string, any>, fields: Record<string, FieldItem>) {
  return Object.entries(values).some(([key, value]: [string, any]) => {
    const field = fields[key];
    if (!field) return false;
    // 规则校验
    if (field.rules && Array.isArray(field.rules)) {
      const { rules } = field;
      let message = `请输入${field.label}`;

      const hasInvalidRule = rules.some((rule) => {
        if (rule.message) message = rule.message;
        // 必填校验
        if (rule.required && !value) return true;
        // 正则校验
        if (rule.pattern && !rule.pattern.test(value.trim())) return true;
        // 自动移validator校验
        if (rule.validator && !rule.validator(value)) return true;
      });

      if (hasInvalidRule) {
        showToast({ title: message, icon: 'none' });
        return true;
      }
    }
  });
}
