import { brand, extendColors, gray, themeColorsMobile, white } from './colors'

export const mobileLightTheme = {
  // ==== brand ====
  /** 品牌主色 */
  colorBrandPrimary: brand.DEFAULT,

  ...themeColorsMobile,
  ...extendColors,

  // ==== button =====
  Button: {
    /** 按钮主色 #183EFC */
    primary: brand.DEFAULT,
    /** 默认按钮边框 #DADADA */
    defaultBorder: gray[100],
    /** 默认按钮激活外围边框颜色 */
    defaultActiveBorder: gray[900],
    /** 禁用背景色 #F0F0F0 */
    disabledBg: gray[90]
  },

  // ==== input =====
  Input: {
    /** 输入框背景色 #fff */
    bgColor: white.DEFAULT,
    /** 输入框禁用置灰背景色 #EDEDED */
    disabledBg: gray[80],
    /** 输入框禁用置灰边框颜色 #EDEDED */
    disabledBorder: gray[80],
    /** 输入框边框颜色 #DADADA */
    borderColor: gray[100],
    /** 输入框激活边框颜色 */
    activeBorderColor: gray[900],
    /** placeholder文字颜色 #7B7E80 */
    placeholderTextColor: gray[500]
  },

  // ==== tabs ====
  Tabs: {
    /** tabs组件底部边框线颜色 #F0F0F0 */
    borderColor: gray[70],
    /** 卡片标签页背景色 */
    cardBg: white.DEFAULT,
    /** 指示条颜色 */
    inkBarColor: gray[900]
  },

  // ==== modal弹窗组件 =====
  Modal: {
    /** 弹窗内容区背景颜色 #fff */
    bgColor: white.DEFAULT,
    /** 弹窗框边框颜色 #F0F0F0 */
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
    activeTrackColor: gray.DEFAULT,
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
    itemColor: extendColors.textColor.secondary,
    /** 选项选中时背景颜色 */
    itemSelectedBg: gray[50],
    /** 选项选中时文字颜色 */
    itemSelectedColor: extendColors.textColor.primary,
    /** Segmented 控件容器背景色 */
    trackBg: white.DEFAULT,
    /** 容器边框颜色 */
    borderColor: gray
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
    /** 分割线条颜色 #F0F0F0 */
    weak: gray[70],
    /** 颜色较深 */
    heavy: gray[500]
  },

  // ===== 深度进度条颜色 =====
  /** 买 */
  depthBuyBg: 'linear-gradient( 90deg, rgba(0,179,138,0) 0%, rgba(0,179,138,0.16) 100%)',
  /** 卖 */
  depthSellBg: 'linear-gradient( 90deg, rgba(230,52,79,0) 0%, rgba(255,107,130,0.16) 100%)'
}
