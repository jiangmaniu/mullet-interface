import { useIntl } from '@umijs/max'
import { Input } from 'antd'
import { ChangeEventHandler, forwardRef, useImperativeHandle, useRef } from 'react'

import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import { gray } from '@/theme/theme.config'

type IProps = {
  value: string
  onChange: ChangeEventHandler<any> | undefined
  style?: React.CSSProperties
}

function Search({ onChange, value, style }: IProps, ref: any) {
  const searchInputRef = useRef(null)
  const intl = useIntl()
  const { theme } = useTheme()
  const { isDark } = theme

  useImperativeHandle(ref, () => {
    return searchInputRef.current
  })

  return (
    <Input
      value={value}
      onChange={onChange}
      placeholder={intl.formatMessage({ id: 'common.operate.Input Keyword' })}
      suffix={<Iconfont name="hangqing-sousuo" width={24} height={24} color={isDark ? '#fff' : gray['600']} />}
      allowClear
      style={{
        background: theme.colors.backgroundColor.primary,
        height: 36,
        transition: 'background 0s ease-in-out',
        color: 'var(--color-text-primary)',
        ...style
      }}
      styles={{ input: { background: 'transparent' } }}
      ref={searchInputRef}
      classNames={{ input: 'dark:placeholder:!text-gray-570' }}
    />
  )
}

export default forwardRef(Search)
