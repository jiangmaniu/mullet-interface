import { bgColorBase, blue, fontFamily, gray } from './theme.config'

const gray500 = gray['500']
const gray600 = gray['600']
const gray900 = gray['900']

const bluePrimary = blue['700']

// antd的主题色
const colorPrimary = gray['900'] //  antd的主题色设置为黑色，页面中大部分组件使用到黑色，避免修改太多

// antd5 token主题配置
export default {
  // 全局token
  colorPrimary, // 主要颜色，影响最大，同步修改config/defaultSettings中的配置
  colorPrimaryHover: gray['500'], // 主色梯度下的悬浮态
  colorPrimaryBorderHover: gray['500'],
  colorPrimaryBgHover: 'rgba(0, 0, 0, 0.04)',
  colorPrimaryBg: bgColorBase,
  fontSize: 14, // 默认14
  borderRadius: 7, // 圆角
  colorBgContainerDisabled: bgColorBase, // 禁用背景颜色
  fontFamily, // 字体

  // 组件对应的token
  Tabs: {
    itemHoverColor: gray900, // 标签悬浮态文本颜色
    itemActiveColor: gray900, // 标签激活态文本颜色
    itemSelectedColor: gray900,
    itemColor: gray500,
    inkBarColor: gray900, // 指示条颜色
    titleFontSize: 16
  },
  Button: {
    colorPrimary: bluePrimary,
    colorPrimaryHover: bluePrimary, // 主色梯度下的悬浮态
    colorPrimaryBorderHover: bluePrimary,
    colorPrimaryActive: bluePrimary // 主色梯度下的深色激活态。
    // https://ant-design.antgroup.com/components/button-cn#%E4%B8%BB%E9%A2%98%E5%8F%98%E9%87%8Fdesign-token
    // defaultHoverBg: bluePrimary,
    // defaultActiveBorderColor: bluePrimary,
    // defaultHoverBorderColor: bluePrimary,
    // defaultActiveBg: bluePrimary
  },
  Select: {
    multipleItemBg: 'rgba(24, 62, 252, 0.04)',
    optionActiveBg: '#fafafa',
    optionSelectedBg: '#fafafa' // 选项选中时背景色
  },
  InputNumber: {
    activeBorderColor: gray500, // 激活态边框色
    handleHoverColor: gray500, // 操作按钮悬浮颜色
    hoverBorderColor: gray500 // 悬浮态边框色
  },
  Input: {
    activeBorderColor: gray500, // 激活态边框色
    hoverBorderColor: gray500 // 悬浮态边框色
  },
  DatePicker: {
    // activeBorderColor: gray500, // 激活态边框色
    // cellRangeBorderColor: gray500, // 选取范围时单元格边框色
    // hoverBorderColor: gray500, // 悬浮态边框色
    // cellHoverWithRangeBg: gray500 // 选取范围内的单元格悬浮态背景色
  },
  Form: {
    itemMarginBottom: 0 // 表单项底部间距
  },
  Table: {
    // rowHoverBg: 'rgba(24,62,252,0.05)'
    headerBg: 'white',
    headerColor: '#6A7073',
    headerSplitColor: 'white'
  },
  Message: {
    contentBg: 'rgba(1,1,1,0.6)'
  },
  Dropdown: {
    zIndexPopup: 1020 // 下拉菜单 z-index
  },
  // Slider: {
  //   dotActiveBorderColor: bluePrimary,
  //   handleActiveColor: bluePrimary,
  //   handleColor: bluePrimary
  // }
  Carousel: {
    dotHeight: 0,
    dotWidth: 0
  },
  Radio: {
    buttonColor: 'red'
  }
}
