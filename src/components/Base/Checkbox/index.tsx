import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Checkbox as AntdCheckBox, GetProps } from 'antd'
import classNames from 'classnames'
import { observer } from 'mobx-react'

import { useTheme } from '@/context/themeProvider'

type IProps = GetProps<typeof AntdCheckBox>

function CheckBox({ className, children, ...res }: IProps) {
  const { theme } = useTheme()
  const classNameWrapper = useEmotionCss(({ token }) => {
    return {
      '.ant-checkbox-inner': {
        background: '#222 !important',
        borderColor: `${theme === 'dark' ? '#f4f4f4' : '#fff'} !important`
      }
    }
  })
  return (
    <AntdCheckBox className={classNames(classNameWrapper, className)} {...res}>
      {children}
    </AntdCheckBox>
  )
}

export default observer(CheckBox)
