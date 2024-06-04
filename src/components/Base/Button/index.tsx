import { PlusOutlined } from '@ant-design/icons'
import { FormattedMessage } from '@umijs/max'
import { Button as AntdButton, ButtonProps } from 'antd'
import classNames from 'classnames'
import qs from 'qs'

import { useEnv } from '@/context/envProvider'
import { push } from '@/utils/navigator'

import Iconfont, { IconProps } from '../Iconfont'

type IProps = ButtonProps & {
  /**按钮内容 */
  children?: React.ReactNode
  /**跳转地址 */
  href?: string
  /**跳转地址参数 */
  params?: Record<string, any>
  /**按钮高度 */
  height?: number
  style?: React.CSSProperties
}

export default function Button({ children, href, params, onClick, height = 38, style, ...res }: IProps) {
  const { isMobileOrIpad } = useEnv()
  const btnHeight = isMobileOrIpad ? 44 : height
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) {
      onClick(e)
    } else if (href) {
      push(`${href}${qs.stringify(params, { addQueryPrefix: true })}`)
    }
  }

  return (
    <AntdButton onClick={handleClick} style={{ height: btnHeight, ...style }} {...res}>
      <span>{children}</span>
    </AntdButton>
  )
}

// 封装iconfont图标按钮，统一风格
export const IconFontButton = ({
  children,
  icon,
  type,
  color,
  iconProps,
  ...res
}: IProps & { icon: string; color?: string; iconProps?: Omit<IconProps, 'name'> }) => {
  let iconColor = ''
  if (type === 'primary') {
    iconColor = '#fff'
  }
  return (
    <Button
      className="!flex !items-center"
      classNames={{ icon: '!mr-[2px]' }}
      icon={<Iconfont name={icon} width={24} height={24} color={iconColor} {...iconProps} />}
      type={type}
      {...res}
    >
      {children}
    </Button>
  )
}

export const SaveButton = ({ children, ...res }: IProps & { icon?: string }) => {
  return (
    <IconFontButton icon="baocun" type="primary" iconProps={{ width: 18, height: 18 }} {...res}>
      {children || <FormattedMessage id="common.save" />}
    </IconFontButton>
  )
}

export const AddButton = ({ children, iconClass, ...res }: IProps & { iconClass?: string }) => {
  return (
    <Button type="primary" icon={<PlusOutlined className={classNames(iconClass)} />} {...res}>
      {children || <FormattedMessage id="common.add" />}
    </Button>
  )
}
