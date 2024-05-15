import { LoginForm, ProFormText } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Form, message } from 'antd'
import classNames from 'classnames'
import Lottie from 'lottie-react'
import { useState } from 'react'
import { flushSync } from 'react-dom'

import PhoneSelectFormItem from '@/components/Admin/Form/PhoneSelectFormItem'
import Tabs from '@/components/Base/Tabs'
import { HOME_PAGE } from '@/constants'
import { login } from '@/services/api/user'
import { push } from '@/utils/navigator'
import { STORAGE_SET_TOKEN } from '@/utils/storage'

import animationData from './animation.json'

export default function Login() {
  const intl = useIntl()
  const { initialState, setInitialState } = useModel('@@initialState')
  const [activeKey, setActiveKey] = useState('login')
  const [form] = Form.useForm()
  const email = Form.useWatch('email', form)
  const password = Form.useWatch('password', form)
  const [isEmailTab, setIsEmailTab] = useState(true) // 邮箱和手机选项切换
  const [loading, setLoading] = useState(true)

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
          top: 64,
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

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.()
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
      // 登录
      const result = await login({
        username: values.username,
        password: values.password
      })
      // @ts-ignore
      if (result?.success) {
        message.success(intl.formatMessage({ id: 'mt.dengluchenggong' }))

        // 保存token到本地
        STORAGE_SET_TOKEN(result.result?.token)

        // 获取用户信息
        await fetchUserInfo()

        const urlParams = new URL(window.location.href).searchParams
        push(urlParams.get('redirect') || HOME_PAGE)
        return
      }
      console.log(result)
      // 如果失败去设置用户错误信息
      // @ts-ignore
      setUserLoginState(msg)
    } catch (error: any) {
      console.log(error)
      message.error(error.message)
    }
  }

  return (
    <div className={classNames('flex items-center justify-center mt-10 flex-1', rootClassName)}>
      {!loading && (
        <LoginForm
          title={
            <div className="mb-8">
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
              disabled: !email || !password
            }
          }}
          onFinish={async (values) => {
            await handleSubmit(values as User.LoginParams)
          }}
          form={form}
          actions={
            <div className="text-gray-500 text-sm text-center cursor-pointer">
              <FormattedMessage id="uc.wangjimima" />
            </div>
          }
        >
          <Tabs
            activeKey={activeKey}
            onChange={setActiveKey}
            centered
            tabBarGutter={130}
            hiddenBottomLine
            items={[
              {
                key: 'login',
                label: (
                  <span className="text-gray font-medium text-lg">
                    <FormattedMessage id="uc.denglu" />
                  </span>
                )
              },
              {
                key: 'register',
                label: (
                  <span className="text-gray-secondary text-lg font-medium hover:text-gray">
                    <FormattedMessage id="uc.kailixinzhanghu" />
                  </span>
                )
              }
            ]}
          />
          <div className="flex items-center justify-between w-full pb-2">
            <span>{!isEmailTab ? <FormattedMessage id="uc.shoujihaoma" /> : <FormattedMessage id="uc.dianziyouxiang" />}</span>
            <span className="cursor-pointer text-blue" onClick={() => setIsEmailTab(!isEmailTab)}>
              {isEmailTab ? <FormattedMessage id="uc.shoujihaoma" /> : <FormattedMessage id="uc.dianziyouxiang" />}
            </span>
          </div>

          {/* 电子邮箱 */}
          {isEmailTab && (
            <ProFormText
              name="email"
              fieldProps={{
                size: 'large'
              }}
              placeholder={intl.formatMessage({ id: 'uc.shurudianziyouxiang' })}
              required={false}
              rules={[
                {
                  required: true,
                  message: intl.formatMessage({ id: 'uc.shurudianziyouxiang' })
                }
              ]}
            />
          )}

          {/* 手机号码 */}
          {!isEmailTab && <PhoneSelectFormItem name={['phone', 'code']} form={form} />}

          {/* @TODO 处理密码规则验证 */}
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large'
            }}
            required={false}
            label={intl.formatMessage({ id: 'mt.mima' })}
            placeholder={intl.formatMessage({ id: 'uc.shurumima' })}
            rules={[
              {
                required: true,
                message: intl.formatMessage({ id: 'uc.shurumima' })
              }
            ]}
          />
        </LoginForm>
      )}
      {loading && (
        <div className="bg-white rounded-lg w-[490px] h-[520px] flex items-center justify-center flex-col">
          <div>
            <Lottie
              className="w-[364px] h-[345px]"
              animationData={animationData}
              renderer="svg"
              autoplay={true}
              loop={true}
              assetsPath="/img/"
            />
          </div>
          <div className="flex flex-col items-center justify-center">
            <div className="text-lg text-gray font-semibold">
              <FormattedMessage id="uc.dengluzhong" />
            </div>
            <div className="pt-5 text-sm text-gray-secondary">
              <FormattedMessage id="uc.loginTips" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
