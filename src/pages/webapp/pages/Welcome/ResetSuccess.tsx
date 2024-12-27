import type { ForwardRefRenderFunction } from 'react'
import React, { useEffect } from 'react'

import { useTheme } from '@/context/themeProvider'

import Icon from '@/components/Base/Iconfont'
import type { TypeSection } from '.'

import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { useEnv } from '@/context/envProvider'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import Header from '../../components/Base/Header'
import { Text } from '../../components/Base/Text'
import { View } from '../../components/Base/View'
import { useI18n } from '../../hooks/useI18n'
import BasicLayout from '../../layouts/BasicLayout'
import { navigateTo } from '../../utils/navigator'

interface Props {
  email?: string
}

const _Section: ForwardRefRenderFunction<TypeSection, Props> = (_, ref) => {
  const { t, locale } = useI18n()
  const { cn, theme } = useTheme()

  const { screenSize } = useEnv()

  /** 拦截系统返回操作 */
  const gobackHandler = () => {
    navigateTo('/app/login', {
      section: 'login'
    })
    return true
  }
  // 将属性暴露给父元素
  // useImperativeHandle(ref, () => ({ gobackHandler }))

  // 拦截平台/系统返回操作=
  useEffect(() => {
    window.addEventListener('popstate', gobackHandler)
    return () => window.removeEventListener('popstate', gobackHandler)
  }, [])

  const className = useEmotionCss(({ token }) => {
    return {
      // '.ant-btn-primary:not([disabled]):not(.ant-btn-dangerous)': {
      '> span': {
        position: 'relative'
      },
      '&::before': {
        position: 'absolute',
        background: `linear-gradient(135deg,  ${theme.colors.brand.DEFAULT},${theme.colors.blue[500]})`,
        'border-radius': 'inherit',
        opacity: 1,
        transition: 'all 0.3s',
        content: "''",
        inset: '-1px'
      },
      '&:hover::before': {
        opacity: 0
      }
    }
    // }
  })

  return (
    <BasicLayout
      header={<Header title={t('pages.login.Password Reset Success')} back={false} />}
      bgColor="secondary"
      style={{ paddingLeft: 14, paddingRight: 14 }}
    >
      <View
        className={cn('px-2 flex items-center justify-center')}
        style={{
          height: screenSize.height
        }}
      >
        <View className={cn('flex items-center justify-center flex-col gap-2.5 w-[300px] ')}>
          <View
            className={cn('bg-green w-[120px] h-[120px] flex items-center justify-center rounded-[30px]')}
            style={{
              background: `linear-gradient(135deg,  ${theme.colors.brand.DEFAULT},${theme.colors.blue[500]})`
            }}
          >
            <Icon
              name="geren-xiadanqueren"
              size={100}
              color={theme.colors.textColor.reverse}
              style={{
                background: `linear-gradient(135deg,  ${theme.colors.brand.DEFAULT},${theme.colors.blue[500]})`
              }}
            />
          </View>
          <Text className={cn('text-xl text-primary font-medium text-center')}>{t('pages.login.Password Reset Success')}</Text>
          <Text className={cn('text-sm text-gray-500 text-center')}>{t('pages.login.qingjizhumima')}</Text>

          <Button
            type="primary"
            className={cn(className)}
            style={{ width: 160, height: 42, display: 'flex', justifyContent: 'center', marginTop: 40 }}
            onPress={gobackHandler}
          >
            <View className={cn('flex flex-row items-center justify-center gap-2')}>
              <Text className={cn('!text-reverse text-lg font-bold text-center')}>{t('pages.login.To Login')}</Text>
              <Iconfont name="jinru" size={28} color={theme.colors.textColor.reverse} />
            </View>
          </Button>
        </View>
      </View>
    </BasicLayout>
  )
}

const ResetSuccess = React.forwardRef(_Section)

export default ResetSuccess
