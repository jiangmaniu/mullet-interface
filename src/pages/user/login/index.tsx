/* eslint-disable simple-import-sort/imports */
import { LoginForm, ProFormText } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form } from 'antd'
import classNames from 'classnames'
import { md5 } from 'js-md5'
import Lottie from 'lottie-react'
import { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import PhoneSelectFormItem from '@/components/Admin/Form/PhoneSelectFormItem'
import Tabs from '@/components/Base/Tabs'
import { WEB_HOME_PAGE } from '@/constants'
import { getCaptcha, login } from '@/services/api/user'
import { push } from '@/utils/navigator'
import { STORAGE_GET_TOKEN, setLocalUserInfo } from '@/utils/storage'

import PwdTips from '@/components/PwdTips'
import { regPassword } from '@/utils'
import { message } from '@/utils/message'
import animationData from './animation.json'

export default function Login() {
  const intl = useIntl()
  const { initialState, setInitialState } = useModel('@@initialState')
  const [activeKey, setActiveKey] = useState('login')
  const [form] = Form.useForm()
  const username = Form.useWatch('username', form)
  const password = Form.useWatch('password', form)
  const [isEmailTab, setIsEmailTab] = useState(true) // 邮箱和手机选项切换
  const [loading, setLoading] = useState(false)
  const pwdTipsRef = useRef<any>()

  const [captchaInfo, setCaptchaInfo] = useState({} as User.Captcha)
  const access_token = STORAGE_GET_TOKEN()

  const handleCaptcha = async () => {
    const res = await getCaptcha()
    setCaptchaInfo(res)
  }

  useEffect(() => {
    handleCaptcha()
  }, [])

  const className = useEmotionCss(({ token }) => {
    return {
      position: 'relative',
      '.ant-form-item': {
        marginBottom: 32
      }
    }
  })

  const rootClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-pro-form-login-main': {
        position: 'relative',
        '&::after': {
          position: 'absolute',
          right: 0,
          left: 0,
          top: 58,
          borderBottom: '1px solid #f0f0f0',
          content: "''"
        }
      },
      '.ant-input-affix-wrapper-lg': {
        paddingTop: '13px !important',
        paddingBottom: '13px !important'
      },
      '.ant-tabs': {
        marginBottom: 24
      },
      '.ant-form-item .ant-form-item-label >label': {
        fontSize: 14,
        color: '#9c9c9c',
        width: '100%'
      },
      '.ant-btn-primary:disabled': {
        background: 'rgba(156, 156, 156, .5) !important'
      }
    }
  })

  const fetchUserInfo = async (token?: any) => {
    const userInfo = await initialState?.fetchUserInfo?.(token)
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo
        }))
      })
    }
  }

  const handleSubmit = async (values: User.LoginParams) => {
    try {
      setLoading(true)
      const result = await login(
        {
          username: values.username,
          password: md5(values.password as string),
          tenanId: '000000',
          type: 'account',
          grant_type: 'captcha',
          scope: 'all'
        },
        {
          headers: {
            'Captcha-Code': values.captchaCode,
            'Captcha-Key': captchaInfo.key
          }
        }
      )

      // @ts-ignore
      if (result?.success) {
        // 缓存用户信息
        setLocalUserInfo(result as User.UserInfo)

        // 重新获取用户信息
        await fetchUserInfo(result?.access_token)

        setTimeout(() => {
          setLoading(false)
          // message.info(intl.formatMessage({ id: 'mt.dengluchenggong' }))

          const urlParams = new URL(window.location.href).searchParams
          push(urlParams.get('redirect') || WEB_HOME_PAGE)
        }, 6000)

        return
      } else {
        // 刷新验证码
        handleCaptcha()
        setLoading(false)
      }
    } catch (error: any) {
      message.info(error.message)
      setLoading(false)
    }
  }

  return (
    <div className={classNames('flex items-center justify-center mt-10 flex-1', rootClassName)}>
      {!loading && (
        <LoginForm
          title={
            <div
              className="mb-8 cursor-pointer"
              onClick={() => {
                push(WEB_HOME_PAGE)
              }}
            >
              <img src="/logo.svg" alt="logo" className="h-[68px] w-[242px]" />
            </div>
          }
          rootClassName={className}
          contentStyle={{
            width: 490,
            padding: '6px 40px 40px',
            borderRadius: 8,
            marginTop: 24,
            background: '#fff'
          }}
          submitter={{
            searchConfig: { submitText: intl.formatMessage({ id: 'mt.denglu' }) },
            submitButtonProps: {
              style: { height: 48, width: '100%' },
              disabled: !username || !password
            }
          }}
          onFinish={async (values) => {
            await handleSubmit(values as User.LoginParams)
          }}
          form={form}
          actions={
            <div className="text-gray-500 text-sm text-center cursor-pointer">
              <FormattedMessage id="mt.wangjimima" />
            </div>
          }
        >
          <Tabs
            activeKey={activeKey}
            onChange={(key) => {
              setActiveKey(key)

              if (key === 'login') {
                form.validateFields(['password'])
              }
            }}
            centered
            tabBarGutter={130}
            hiddenBottomLine
            items={[
              {
                key: 'login',
                label: (
                  <span className="text-gray font-medium text-lg">
                    <FormattedMessage id="mt.denglu" />
                  </span>
                )
              },
              {
                key: 'register',
                label: (
                  <span className="text-gray-secondary text-lg font-medium hover:text-gray">
                    <FormattedMessage id="mt.kailixinzhanghu" />
                  </span>
                )
              }
            ]}
          />
          <div className="flex items-center justify-between w-full pb-2">
            <span>{!isEmailTab ? <FormattedMessage id="mt.shoujihaoma" /> : <FormattedMessage id="mt.dianziyouxiang" />}</span>
            <span className="cursor-pointer text-blue" onClick={() => setIsEmailTab(!isEmailTab)}>
              {isEmailTab ? <FormattedMessage id="mt.shoujihaoma" /> : <FormattedMessage id="mt.dianziyouxiang" />}
            </span>
          </div>

          {/* 电子邮箱 */}
          {isEmailTab && (
            <ProFormText
              name="username"
              fieldProps={{
                size: 'large'
              }}
              placeholder={intl.formatMessage({ id: 'mt.shurudianziyouxiang' })}
              required={false}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'mt.shurudianziyouxiang' })
                }
              ]}
            />
          )}

          {/* 手机号码 */}
          {!isEmailTab && <PhoneSelectFormItem name={['phone', 'code']} form={form} />}
          <ProFormText.Password
            name="password"
            required={false}
            label={intl.formatMessage({ id: 'mt.mima' })}
            placeholder={intl.formatMessage({ id: 'mt.shurumima' })}
            fieldProps={{
              size: 'large',
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
                message:
                  activeKey === 'register'
                    ? intl.formatMessage({ id: 'mt.pleaseInputPwdPlaceholder' })
                    : intl.formatMessage({ id: 'mt.qingshurumima' }),
                pattern: activeKey === 'register' ? regPassword : undefined
              }
            ]}
          />
          {activeKey === 'register' && <PwdTips pwd={password} ref={pwdTipsRef} />}
          <div className="flex items-center gap-2">
            <ProFormText
              name="captchaCode"
              fieldProps={{
                size: 'large'
              }}
              label={intl.formatMessage({ id: 'mt.tuxingyanzhengma' })}
              placeholder={intl.formatMessage({ id: 'mt.shuruyanzhengma' })}
              required={false}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'mt.shuruyanzhengma' })
                }
              ]}
              formItemProps={{ style: { width: '100%' } }}
            />
            <div className="border-gray-220 border rounded-lg cursor-pointer w-[100px] overflow-hidden h-[49px]" onClick={handleCaptcha}>
              <img src={captchaInfo.image} className="w-full h-full" />
            </div>
          </div>
        </LoginForm>
      )}
      {loading && (
        <div className="bg-white rounded-lg w-[490px] h-[520px] flex items-center justify-center flex-col">
          <div>
            <Lottie
              className="w-[400px] h-[400px]"
              animationData={animationData}
              renderer="svg"
              autoplay={true}
              loop={true}
              assetsPath="/img/animation/"
            />
          </div>
          <div className="flex flex-col items-center justify-center relative -top-5 px-6">
            <div className="text-lg text-gray font-semibold">
              <FormattedMessage id="mt.dengluzhong" />
            </div>
            <div className="pt-4 text-sm text-gray-secondary">
              <FormattedMessage id="mt.loginTips" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
