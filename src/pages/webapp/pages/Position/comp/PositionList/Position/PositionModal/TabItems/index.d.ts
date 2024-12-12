export type OnValueChange = (value: IFormValues) => void

export type IFormValues = {
  /** 手数 */
  count?: number
  /** 保证金 */
  margin?: number
  /** 是否增加保证金 */
  isAddMargin?: boolean
}

export type RenderTabRef = {
  submit: () => void
}
