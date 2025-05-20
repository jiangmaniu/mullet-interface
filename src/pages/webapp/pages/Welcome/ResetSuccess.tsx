import type { ForwardRefRenderFunction } from 'react'
import React, { useEffect } from 'react'

import { useTheme } from '@/context/themeProvider'

import Icon from '@/components/Base/Iconfont'
import type { TypeSection } from '.'

import { useEnv } from '@/context/envProvider'
import { stores } from '@/context/mobxProvider'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useSearchParams } from '@umijs/max'
import Button from '../../components/Base/Button'
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

  const [query] = useSearchParams()
  const registerType = query.get('registerType') as string
  const userType = query.get('userType') as string
  const oneWay = registerType || userType === '5'
  const registerWay = oneWay ? registerType ?? stores.global.registerWay : ''

  /** 拦截系统返回操作 */
  const gobackHandler = () => {
    const params = {} as any

    if (oneWay) {
      params.registerType = registerWay
    }

    navigateTo('/app/login', params)
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
      footerStyle={{
        backgroundColor: 'transparent'
      }}
      fixedHeight
      footer={
        <Button type="primary" className="mb-4" onClick={gobackHandler}>
          {/* <View className={cn('flex flex-row items-center justify-center gap-2')}> */}
          <Text className={cn('!text-reverse text-lg font-bold text-center')}>{t('pages.login.To Login')}</Text>
          {/* <Iconfont name="jinru" size={28} color={theme.colors.textColor.reverse} /> */}
          {/* </View> */}
        </Button>
      }
    >
      <View className={cn('px-2 mt-[100px] flex items-center justify-center')}>
        <View className={cn('flex items-center justify-center flex-col gap-2.5 w-[300px] ')}>
          <View
            className={cn('bg-brand w-[120px] h-[120px] flex items-center justify-center rounded-[30px]')}
            // style={{
            //   background: `linear-gradient(135deg,  ${theme.colors.brand.DEFAULT},${theme.colors.blue[500]})`
            // }}
          >
            <Icon
              name="geren-xiadanqueren"
              size={100}
              color={theme.colors.textColor.reverse}
              // style={{
              //   background: `linear-gradient(135deg,  ${theme.colors.brand.DEFAULT},${theme.colors.blue[500]})`
              // }}
            />
          </View>
          <Text className={cn('text-xl text-primary font-medium text-center')}>{t('pages.login.Password Reset Success')}</Text>
          <Text className={cn('text-sm !text-gray-500 text-center')}>{t('pages.login.qingjizhumima')}</Text>
        </View>
      </View>
    </BasicLayout>
  )
}

const ResetSuccess = React.forwardRef(_Section)

export default ResetSuccess
