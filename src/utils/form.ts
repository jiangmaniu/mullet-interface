import { FormInstance } from 'antd'
import { FieldErrors, Path, UseFormTrigger } from 'react-hook-form'

interface ValidationResult<T = any> {
  isValid: boolean
  values?: T
  errors?: Record<string, any>
}

/**
 * 通用表单非空字段验证方法
 * @param form Form 实例
 * @param extendedChecker 自定义空值检测函数（可选）
 */
export async function validateNonEmptyFields<T extends Object = any>(
  form: FormInstance<T>,
  extendedChecker?: (value: any) => boolean
): Promise<ValidationResult<T>> {
  try {
    // 获取所有字段值
    // const values = form.getFieldsValue(true)
    const errors = form.getFieldsError().filter((item) => item.errors.length > 0)
    const keys = Object.values(errors).flatMap((item) => item.name)

    // 执行验证
    await form.validateFields(keys)

    return {
      isValid: true
    }
  } catch (error: any) {
    return {
      isValid: false
    }
  }
}

// 默认空值检测方法

export async function validateNonEmptyFieldsRHF<T extends Object = any>(
  errors: FieldErrors<T>,
  trigger: UseFormTrigger<T>,
  extendedChecker?: (key: string, value: any) => boolean
): Promise<ValidationResult<T>> {
  try {
    const keys = Object.keys(errors)
    // 执行验证
    await trigger(keys as Path<T>[])

    return {
      isValid: true
    }
  } catch (error: any) {
    return {
      isValid: false,
      errors: { global: '验证失败' }
    }
  }
}
