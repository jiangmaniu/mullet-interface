import { black, brand, gray, green, red, white } from './colors'
import { mobileLightTheme } from './theme.config'

export const mobileDarkTheme = {
  // 黑色主题还未提供 @TODO
  ...mobileLightTheme,

  // ======== 修改默认颜色 ========
  // 品牌色
  brand: {
    ...brand,
    DEFAULT: '#183EFC'
  },
  // 默认全局绿
  green: {
    ...green,
    DEFAULT: '#45A48A'
  },
  // 默认全局红
  red: {
    ...red,
    DEFAULT: '#EB4848'
  },

  // 主题文字变量
  textColor: {
    brand: brand.DEFAULT,
    primary: white.DEFAULT, // 文字主色
    secondary: gray[500], // 文字-描述文本
    weak: gray[100], // 文字-次描述文本
    reverse: gray[900],
    reverse_weak: gray[600] // 相反色的 weak
  },
  // 主题背景颜色变量
  backgroundColor: {
    /** 品牌背景色 */
    brandPrimary: brand.DEFAULT,
    /** 页面背景颜色-白 */
    primary: black.DEFAULT,
    /** 页面背景颜色-灰 */
    secondary: gray[100],
    /** 透明 */
    transparent: 'transparent',
    /** 重色 */
    heavy: black.DEFAULT,
    reverse: gray[50]
  },
  // 边框样式
  borderColor: {
    /** 通用边框颜色-深 */
    primary: gray[100],
    /** 通用边框颜色-浅 */
    weak: gray[70],
    /** 激活边框 */
    active: gray[900]
  },

  // ==== button =====
  Button: {
    /** 按钮主色 */
    primary: brand.DEFAULT,
    /** 默认按钮边框 */
    defaultBorder: gray[100],
    /** 默认按钮激活外围边框颜色 */
    defaultActiveBorder: gray[900],
    /** 禁用背景色 */
    disabledBg: gray[90]
  },

  // ==== input =====
  Input: {
    /** 输入框背景色 */
    bgColor: gray[600],
    /** 输入框禁用置灰背景色 */
    disabledBg: gray[900],
    /** 输入框禁用置灰边框颜色 */
    disabledBorder: gray[80],
    /** 输入框边框颜色 */
    borderColor: gray[100],
    /** 输入框激活边框颜色 */
    activeBorderColor: gray[900],
    /** placeholder文字颜色 */
    placeholderTextColor: gray[500]
  },

  // ==== tabs ====
  Tabs: {
    /** tabs组件底部边框线颜色 */
    borderColor: gray[70],
    /** 卡片标签页背景色 */
    cardBg: white.DEFAULT,
    /** 指示条颜色 */
    inkBarColor: gray[900]
  },

  // ==== modal弹窗组件 =====
  Modal: {
    /** 弹窗内容区背景颜色 */
    bgColor: white.DEFAULT,
    /** 弹窗框边框颜色 */
    borderColor: gray[70],
    /** 弹窗遮罩颜色 */
    maskBg: 'rgba(0,0,0,0.5)',
    /** 拖拽手柄背景颜色 */
    handleIndicatorBg: '#DDDDDD'
  },

  // ==== Switch组件 =====
  Switch: {
    /** 开关激活颜色 #183EFC */
    activeThumbColor: white.DEFAULT,
    inactiveThumbColor: gray[100],
    /** Switch组件激活背景颜色 */
    activeTrackColor: gray[500],
    /** Switch组件未激活背景颜色 */
    inactiveTrackColor: '#EEEEEE'
  },

  // Slider组件
  Slider: {
    /** 滑块激活背景颜色 */
    activeTrackBg: gray.DEFAULT,
    /** 滑块未激活背景颜色 */
    inactiveTrackBg: '#EBEBEB',
    /** 滑块提示背景颜色 */
    toolTipBg: '#f3f3f3'
  },

  // 分段控制器
  Segmented: {
    /** 选项文本颜色 */
    itemColor: '#3E4042',
    /** 选项选中时背景颜色 */
    itemSelectedBg: gray[50],
    /** 选项选中时文字颜色 */
    itemSelectedColor: '#222',
    /** Segmented 控件容器背景色 */
    trackBg: white.DEFAULT,
    /** 容器边框颜色 */
    borderColor: gray[70]
  },

  // CheckBox组件
  CheckBox: {
    /** 激活边框样式 */
    activeBorderColor: '#979797',
    /** 未激活边框样式 */
    inactiveBorderColor: gray[100],
    /** 激活中间块样式 */
    activeBlockBg: gray.DEFAULT,
    /** 未激活中间块样式 */
    inactiveBlockBg: white.DEFAULT
  },

  // ==== divider=====
  /** 分割线条颜色 */
  Divider: {
    /** 深 */
    primary: gray[500],
    /** 浅 */
    weak: gray[70],
    /** 颜色较深 */
    heavy: gray[500]
  },

  // ===== 深度进度条颜色 =====
  /** 买 */
  depthBuyBg: ['rgba(0,179,138,0)', 'rgba(0,179,138,0.16)'],
  /** 卖 */
  depthSellBg: ['rgba(230,52,79,0)', 'rgba(255,107,130,0.16)']
}
