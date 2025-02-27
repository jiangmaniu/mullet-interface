import { useCallback, useEffect, useRef, useState } from 'react'

import Button from '@/components/Base/Button'
import { useTheme } from '@/context/themeProvider'

import FormCaptcha from '@/components/Form/Captcha'
import PwdTips from '@/components/PwdTips'
import { stores } from '@/context/mobxProvider'
import { getEnv } from '@/env'
import Header from '@/pages/webapp/components/Base/Header'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import Basiclayout from '@/pages/webapp/layouts/BasicLayout'
import { forgetPasswordEmail, forgetPasswordPhone, sendEmailCode, sendPhoneCode } from '@/services/api/user'
import { regPassword } from '@/utils'
import { message } from '@/utils/message'
import { goKefu, onLogout, push } from '@/utils/navigator'
import { ProFormText } from '@ant-design/pro-components'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { useTitle } from 'ahooks'
import { Form } from 'antd'
import { md5 } from 'js-md5'

export interface FormData {
  email?: string
  phone?: string
  newPassword: string
  confirmPassword: string
  validateCode: string
  areaCode?: string
}

export default () => {
  const intl = useIntl()
  const pwdTipsRef = useRef<any>()
  const { cn, theme } = useTheme()
  const { isEmailRegisterWay } = useModel('user')
  const { initialState } = useModel('@@initialState')
  const { t } = useI18n()
  const [form] = Form.useForm()
  const newPassword = Form.useWatch('newPassword', form)
  const [submitLoading, setSubmitLoading] = useState(false)
  const currentUser = initialState?.currentUser
  const phone = currentUser?.userInfo?.phone as string
  const email = currentUser?.userInfo?.email as string
  const account = currentUser?.account as string
  const isKycAuth = currentUser?.isKycAuth
  const isPhoneCheck = phone && isKycAuth

  useTitle(t('mt.xiuggaimima'))

  const onSend = async () => {
    let reqFn = isPhoneCheck ? sendPhoneCode : sendEmailCode

    if (getEnv().SKIP_KYC_STEP_ONE === '1') {
      reqFn = stores.global.registerWay === 'PHONE' ? sendPhoneCode : sendEmailCode
    }

    const res = await reqFn()
    return res.success
  }

  const [sendLabel, setSendLabel] = useState('')

  const setSendLabelValue = useCallback(() => {
    let value = isPhoneCheck ? intl.formatMessage({ id: 'mt.shoujiyanzheng' }) : intl.formatMessage({ id: 'mt.yuanshiyouxiangyanzheng' })

    if (getEnv().SKIP_KYC_STEP_ONE === '1') {
      value =
        stores.global.registerWay === 'PHONE'
          ? intl.formatMessage({ id: 'mt.shoujiyanzheng' })
          : intl.formatMessage({ id: 'mt.yuanshiyouxiangyanzheng' })
    }

    setSendLabel(value)
  }, [stores.global.registerWay, intl, isPhoneCheck])

  useEffect(() => {
    setSendLabelValue()
  }, [setSendLabelValue])

  return (
    <Basiclayout
      bgColor="secondary"
      headerColor={theme.colors.backgroundColor.secondary}
      footerStyle={{ background: theme.colors.backgroundColor.secondary, marginBottom: 20 }}
      footer={
        <div>
          {/* @TODO 客服接入 */}
          <div className="flex items-center justify-center flex-1 pb-4" onClick={goKefu}>
            <img src="/img/kefu.png" width={28} height={28} />
            <span className="text-sm text-primary font-pf-bold cursor-pointer">
              <FormattedMessage id="mt.yanzhengshiyudaowenti" />?
            </span>
          </div>
          <Button
            className="!h-[44px]"
            block
            type="primary"
            onClick={() => {
              form.submit()
            }}
            loading={submitLoading}
          >
            <FormattedMessage id="common.queren" />
          </Button>
        </div>
      }
    >
      <Header />
      <Form
        form={form}
        onFinish={async (values: any) => {
          const { newPassword, confirmNewPassword, validateCode } = values

          if (newPassword !== confirmNewPassword) {
            message.info(intl.formatMessage({ id: 'mt.xinmimashurubuyizhi' }))
            return
          }

          setSubmitLoading(true)
          const reqFn = isPhoneCheck ? forgetPasswordPhone : forgetPasswordEmail
          const emailOrPhone = isPhoneCheck ? phone : email
          const res = await reqFn({
            emailOrPhone,
            newPassword: md5(newPassword),
            validateCode
          })
          setSubmitLoading(false)
          const success = res.success

          if (success) {
            message.info(intl.formatMessage({ id: 'common.opSuccess' }))

            setTimeout(() => {
              push('/user/login')
              onLogout()
            }, 500)
          }

          return success
        }}
      >
        <View className={cn('flex-1 flex flex-col justify-between my-4 mx-[14px]')}>
          <View className={cn('flex flex-col')}>
            <Text className={cn('text-[20px] text-primary font-extrabold')}>{t('mt.xiugaimima')}</Text>
            <Text className={cn('text-xs pt-1')} color="weak">
              {t('mt.xiuggaimimatishi')}
            </Text>
          </View>
          <View className={cn('flex flex-col gap-y-5 mt-2')}>
            <View>
              <ProFormText.Password
                name="newPassword"
                label={intl.formatMessage({ id: 'mt.xinmima' })}
                placeholder={intl.formatMessage({ id: 'mt.pleaseInputPwdPlaceholder' })}
                fieldProps={{
                  size: 'large',
                  style: { height: 46 },
                  onFocus: () => {
                    pwdTipsRef?.current?.show()
                  },
                  onBlur: () => {
                    pwdTipsRef?.current?.hide()
                  }
                }}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'mt.pleaseInputPwdPlaceholder' }),
                    pattern: regPassword
                  }
                ]}
              />
              <PwdTips pwd={newPassword} ref={pwdTipsRef} style={{ marginTop: 12, background: theme.colors.backgroundColor.secondary }} />
            </View>
            <ProFormText.Password
              name="confirmNewPassword"
              label={intl.formatMessage({ id: 'mt.querenxinmima' })}
              placeholder={intl.formatMessage({ id: 'mt.zaicishuruxinmima' })}
              fieldProps={{
                size: 'large',
                style: { height: 46 }
              }}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'mt.zaicishuruxinmima' })
                }
              ]}
            />
            <FormCaptcha
              name="validateCode"
              onSend={onSend}
              label={sendLabel}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'mt.shuruyanzhengma' })
                }
              ]}
              height={46}
              fieldProps={{
                placeholder: intl.formatMessage({ id: 'mt.shuruyanzhengma' })
              }}
            />
          </View>
        </View>
      </Form>
    </Basiclayout>
  )
}
