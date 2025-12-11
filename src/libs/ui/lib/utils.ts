import { clsx } from 'clsx'
import { extendTailwindMerge } from 'tailwind-merge'
import type { ClassValue } from 'clsx'
import { NewThemeBackgroundColor, NewThemeBorderColor, NewThemeBoxShadow, NewThemeColor, NewThemeFontSize, NewThemeFontWeight, NewThemeLineHeight, NewThemeRadius, NewThemeSpacing, NewThemeTextColor } from '@/theme/theme.new'
import { isUndefined } from 'lodash-es'

/**
 * Flattens a nested object's keys, joining nested keys with "-" and returning an array of flattened keys.
 *
 * @param obj - The nested object to flatten
 * @param parentKey - The parent key string used for recursive concatenation, initially an empty string
 * @returns An array containing the flattened keys as strings
 *
 * @example
 * // Given a nested object like this:
 * const nestedObject = {
 *   a: 1,
 *   b: {
 *     c: 2,
 *     d: {
 *       e: 3
 *     }
 *   },
 *   f: 4
 * };
 *
 * // Calling flattenObjectKeys(nestedObject) will return:
 * // ["a", "b-c", "b-d-e", "f"]
 */
export function flattenObjectKeys(obj?: Record<string, any>, parentKey = ''): string[] {
  if (isUndefined(obj)) return []

  // Array to store the resulting keys
  const keys: string[] = []

  // Iterate over each key in the object
  for (const key in obj) {
    // Ensure the property belongs to obj and is not inherited
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      // Concatenate the current key with the parent key to form the new key
      const newKey = parentKey ? `${parentKey}-${key}` : key

      // If the property is an object and not null, call flattenObjectKeys recursively
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Spread the resulting keys into the main keys array
        keys.push(...flattenObjectKeys(obj[key], newKey))
      } else {
        // If the property is not an object, add the newKey to the keys array
        keys.push(newKey)
      }
    }
  }

  // Return the array containing all flattened keys
  return keys
}

const createCn = (...args: Parameters<typeof extendTailwindMerge>) => {
  const customTwMerge = extendTailwindMerge(...args)

  function cn(...inputs: ClassValue[]) {
    return customTwMerge(clsx(inputs))
  }

  return cn
}

export const cn = createCn({
  extend: {
    theme: {
      colors: [...flattenObjectKeys(NewThemeColor), ...flattenObjectKeys(NewThemeBackgroundColor), ...flattenObjectKeys(NewThemeBorderColor), ...flattenObjectKeys(NewThemeTextColor)],
      fontSize: [...flattenObjectKeys(NewThemeFontSize)],
      textColor: flattenObjectKeys(NewThemeTextColor),
      backgroundColor: [...flattenObjectKeys(NewThemeBackgroundColor)],
      borderColor: [...flattenObjectKeys(NewThemeBorderColor)],
    },
    classGroups: {
      // 字体大小组 - 必须放在 text-color 之前，优先匹配字体大小类（如 text-button-2）
      // 这样 text-button-2 会匹配到 font-size 组，而不会与 text-color 组冲突
      'font-size': [{ text: flattenObjectKeys(NewThemeFontSize) }],
      // 文本颜色组 - 匹配文本颜色类（如 text-content-1）
      // 由于 button-2 不在 NewThemeTextColor 中，text-button-2 不会匹配到这里
      'text-color': [{ text: flattenObjectKeys(NewThemeTextColor) }],
      // 其他颜色组
      'colors': [{ text: flattenObjectKeys(NewThemeColor) }],
    }
  },
  override: {
    classGroups: {
      // 覆盖默认的 text-color 组，只匹配我们定义的文本颜色类
      // 这样可以防止默认的 text-color 组匹配到字体大小类
      'text-color': [{ text: flattenObjectKeys(NewThemeTextColor) }],
    }
  }
})

