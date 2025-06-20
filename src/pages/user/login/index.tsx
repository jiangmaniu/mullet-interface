/* eslint-disable simple-import-sort/imports */
import { LoginForm, ProFormText } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage, getIntl, useIntl, useModel, useSearchParams } from '@umijs/max'
import { Form } from 'antd'
import classNames from 'classnames'
import { md5 } from 'js-md5'
import { useEffect, useMemo, useRef, useState } from 'react'
import { flushSync } from 'react-dom'

import PhoneSelectFormItem from '@/components/Admin/Form/PhoneSelectFormItem'
import Tabs from '@/components/Base/Tabs'
import { ADMIN_HOME_PAGE, DEFAULT_AREA_CODE, WEB_HOME_PAGE } from '@/constants'
import { login, registerSubmitEmail, registerSubmitPhone } from '@/services/api/user'
import { goHome, push } from '@/utils/navigator'
import { setLocalUserInfo } from '@/utils/storage'

import SelectCountryFormItem from '@/components/Admin/Form/SelectCountryFormItem'
import Loading from '@/components/Base/Lottie/Loading'
import PwdTips from '@/components/PwdTips'
import { getAppRegisterCode } from '@/constants/config'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import { getEnv } from '@/env'
import { PrivacyPolicyService } from '@/pages/webapp/pages/Welcome/RegisterSection/PrivacyPolicyService'
import { regEmail, regPassword } from '@/utils'
import { validateNonEmptyFields } from '@/utils/form'
import { message } from '@/utils/message'
import { useTitle } from 'ahooks'
import { observer } from 'mobx-react'
import RegisterValidateCode, { IValidateCodeType } from '../comp/RegisterValidateCode'

type ITabType = 'LOGIN' | 'REGISTER'

function Login() {
  const intl = useIntl()
  const { global } = useStores()
  const { initialState, setInitialState } = useModel('@@initialState')
  const [tabActiveKey, setTabActiveKey] = useState<ITabType>('LOGIN') // 登录、注册
  const [form] = Form.useForm()
  const ENV = getEnv()
  const [isEmailTab, setIsEmailTab] = useState(true) // 邮箱和手机选项切换
  const [loading, setLoading] = useState(false)
  const [showValidateCodeInput, setShowValidateCodeInput] = useState(false) // 打开验证码输入框
  const [validateCodeType, setValidateCodeType] = useState<IValidateCodeType>('REGISTER') // 验证码类型 忘记密码、注册

  const isLoginTab = tabActiveKey === 'LOGIN'

  const [query] = useSearchParams()
  const registerType = query.get('registerType') as string
  const userType = query.get('userType') as string
  const registerWay = registerType ?? global.registerWay
  const oneWay = registerType || userType === '5'

  useEffect(() => {
    const activeKey = query.get('activeKey') as string
    if (activeKey) {
      setTabActiveKey(activeKey as ITabType)
    }
  }, [query])

  const tabs = useMemo(
    () => [
      {
        key: 'LOGIN',
        label: (
          <span className="text-primary font-medium text-lg">
            <FormattedMessage id="mt.denglu" />
          </span>
        )
      },
      ...(oneWay
        ? []
        : [
            {
              key: 'REGISTER',
              label: (
                <span className="text-secondary text-lg font-medium hover:text-primary">
                  <FormattedMessage id="mt.kailixinzhanghu" />
                </span>
              )
            }
          ])
    ],
    [oneWay]
  )

  const username = Form.useWatch('username', form)
  const password = Form.useWatch('password', form)
  const phoneAreaCode = Form.useWatch('phoneAreaCode', form) || `+${DEFAULT_AREA_CODE}` // 默认香港区号

  const validateCodeRef = useRef<any>() // 注册、重置密码验证码
  const pwdTipsRef = useRef<any>()

  const [captchaInfo, setCaptchaInfo] = useState({} as User.Captcha)

  const handleCaptcha = async () => {
    // const res = await getCaptcha()
    // setCaptchaInfo(res)
  }

  useEffect(() => {
    handleCaptcha()
  }, [])

  useEffect(() => {
    // 确定用哪种方式登录或注册
    setIsEmailTab(registerWay === 'EMAIL')
  }, [registerWay])

  const className = useEmotionCss(({ token }) => {
    return {
      position: 'relative',
      '.ant-form-item': {
        marginBottom: 30
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
    return userInfo
  }

  // 登录
  const handleSubmitLogin = async (values: User.LoginParams) => {
    try {
      setLoading(true)
      const result = await login(
        {
          username: values.username?.trim(),
          password: md5(values.password as string),
          phoneAreaCode,
          tenanId: '000000',
          type: 'account',
          // grant_type: 'captcha',
          grant_type: 'password',
          scope: 'all'
        }
        // {
        //   headers: {
        //     'Captcha-Code': values.captchaCode,
        //     'Captcha-Key': captchaInfo.key
        //   }
        // }
      )

      if (result?.success) {
        // 缓存用户信息
        setLocalUserInfo(result as User.UserInfo)

        // 重新获取用户信息
        const currentUser = await fetchUserInfo()
        // @ts-ignore
        const hasAccount = currentUser?.accountList?.filter((item) => !item.isSimulate)?.length > 0
        const jumpPath = hasAccount ? WEB_HOME_PAGE : ADMIN_HOME_PAGE
        // const jumpPath = ADMIN_HOME_PAGE // 直接跳转到个人中心
        setTimeout(() => {
          setLoading(false)
          push(jumpPath)
        }, 2000)

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

  // 获取六位数验证码
  const handleSendValidateCode = async () => {
    setShowValidateCodeInput(true)
    setValidateCodeType('REGISTER')
    setTimeout(() => {
      validateCodeRef.current?.sendCode({
        emailOrPhone: username,
        phoneAreaCode
      })
    }, 300)
  }

  // 注册-输入验证码后回退调用
  const handleSubmitRegister = async () => {
    setLoading(true)
    const formData = form.getFieldsValue() // 注册表单数据
    const validateCodeFormData = validateCodeRef.current?.form?.getFieldsValue?.() || {} // 验证码表单数据
    const values = {
      ...formData,
      ...validateCodeFormData
    }
    // console.log('values===', values)
    const reqFn = isEmailTab ? registerSubmitEmail : registerSubmitPhone
    const params = {
      emailOrPhone: username,
      validateCode: values.validateCode,
      password: md5(values.password as string),
      country: values.country,
      code: getAppRegisterCode(),
      phoneAreaCode: values.phoneAreaCode
    } as User.RegisterParams

    if (!isEmailTab) {
      params.phoneAreaCode = phoneAreaCode
    }
    const res = await reqFn(params)
    setLoading(false)
    if (res.success) {
      // 关闭定时器
      validateCodeRef.current?.stopCountDown?.()
      setTabActiveKey('LOGIN')
      message.info(intl.formatMessage({ id: 'mt.zhucechenggong' }))

      // 自动登录(无需验证码方式)
      const result = await login({
        username,
        password: md5(values.password as string),
        phoneAreaCode,
        tenanId: '000000',
        type: 'account',
        grant_type: 'password',
        scope: 'all'
      })

      if (result?.success) {
        // 缓存用户信息
        setLocalUserInfo(result)

        // 重新获取用户信息
        const currentUser = await fetchUserInfo()
        // @ts-ignore
        const hasAccount = currentUser?.accountList?.filter((item) => !item.isSimulate)?.length > 0
        const jumpPath = hasAccount ? WEB_HOME_PAGE : ADMIN_HOME_PAGE
        push(jumpPath)
        // 直接跳转到账户选择页面
        // push(ADMIN_HOME_PAGE)
      }
    }
  }

  const renderLoginContent = () => {
    const { list, run } = useModel('areaList')
    const { lng } = useLang()

    const defaultAreaCode = list?.find((item) => item.areaCode === DEFAULT_AREA_CODE)

    useEffect(() => {
      validateNonEmptyFields(form)
    }, [lng])

    return (
      <div
        className={classNames('flex items-center justify-center mt-10 flex-1 h-full', rootClassName)}
        style={{ display: showValidateCodeInput || validateCodeType === 'RESET_PWD' ? 'none' : 'flex' }}
      >
        {!loading && (
          <LoginForm
            title={
              <div className="mb-8 cursor-pointer" onClick={goHome}>
                <img src="/platform/img/pc-logo.svg" alt="logo" className="h-[68px] w-[242px]" />
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
              searchConfig: {
                submitText: isLoginTab ? intl.formatMessage({ id: 'mt.denglu' }) : <span>{intl.formatMessage({ id: 'mt.lijizhuce' })}</span>
              },
              submitButtonProps: {
                style: { height: 48, width: '100%' },
                disabled: !username || !password
              }
            }}
            onFinish={async (values) => {
              if (isLoginTab) {
                handleSubmitLogin(values as User.LoginParams)
              } else {
                handleSendValidateCode()
              }
            }}
            form={form}
            initialValues={{
              phoneAreaCode: `+${DEFAULT_AREA_CODE}`
            }}
            actions={
              <>
                {isLoginTab && (
                  <div
                    className="text-gray-500 text-sm text-center cursor-pointer"
                    onClick={() => {
                      setValidateCodeType('RESET_PWD')
                    }}
                  >
                    <FormattedMessage id="mt.wangjimima" />
                  </div>
                )}
                {!isLoginTab && (
                  <div>
                    {/* <FormattedHTMLMessage id="mt.zhucetips" /> */}
                    <PrivacyPolicyService isPC />
                  </div>
                )}
              </>
            }
          >
            <Tabs
              activeKey={tabActiveKey}
              onChange={(key: any) => {
                setTabActiveKey(key)

                // if (key === 'LOGIN') {
                //   form.validateFields(['password'])
                // }
              }}
              centered
              tabBarGutter={130}
              hiddenBottomLine
              items={tabs}
            />
            {/* <div className="flex items-center justify-between w-full pb-2">
          <span>{!isEmailTab ? <FormattedMessage id="common.shoujihaoma" /> : <FormattedMessage id="common.dianziyouxiang" />}</span>
          <span className="cursor-pointer text-blue" onClick={() => setIsEmailTab(!isEmailTab)}>
            {isEmailTab ? <FormattedMessage id="common.shoujihaoma" /> : <FormattedMessage id="common.dianziyouxiang" />}
          </span>
        </div> */}

            {/* 选择国家地区 */}
            {!isLoginTab && <SelectCountryFormItem form={form} defaultAreaCode={defaultAreaCode} />}

            {/* 电子邮箱 */}
            {isEmailTab && (
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large'
                }}
                placeholder={intl.formatMessage({ id: 'mt.shurudianziyouxiang' })}
                required={false}
                label={<FormattedMessage id="common.dianziyouxiang" />}
                rules={[
                  {
                    required: true,
                    message: intl.formatMessage({ id: 'mt.youxianggeshibuzhengque' }),
                    pattern: regEmail
                  }
                ]}
              />
            )}

            {/* 手机号码 */}
            {!isEmailTab && (
              <PhoneSelectFormItem
                names={['username', 'phoneAreaCode']}
                form={form}
                label={<FormattedMessage id="common.shoujihaoma" />}
                // required={false}
              />
            )}
            <ProFormText.Password
              name="password"
              required={false}
              label={intl.formatMessage({ id: 'common.mima' })}
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
                  message: isLoginTab
                    ? intl.formatMessage({ id: 'mt.qingshurumima' })
                    : intl.formatMessage({ id: 'mt.pleaseInputPwdPlaceholder' }),
                  pattern: isLoginTab ? undefined : regPassword
                }
              ]}
            />
            {!isLoginTab && (
              <div className="mb-4">
                <PwdTips pwd={password} ref={pwdTipsRef} />
              </div>
            )}
          </LoginForm>
        )}

        {loading && (
          <div className="bg-white rounded-lg w-[490px] h-[520px] flex items-center justify-center flex-col">
            <div>
              <Loading />
            </div>
            <div className="flex flex-col items-center justify-center relative -top-5 px-6">
              <div className="text-lg text-primary font-semibold">
                <FormattedMessage id="mt.dengluzhong" />
              </div>
              <div className="pt-4 text-sm text-secondary">
                <FormattedMessage id="mt.loginTips" />
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  oneWay && useTitle(getIntl().formatMessage({ id: 'mt.denglu' }))

  return (
    <>
      {/* 登录、注册切换 */}
      {renderLoginContent()}
      {/* 发送注册验证码组件、忘记密码 */}
      <RegisterValidateCode
        sendType={isEmailTab ? 'EMIAL' : 'PHONE'}
        ref={validateCodeRef}
        onConfirm={handleSubmitRegister}
        onBack={() => {
          // 返回重置
          setValidateCodeType('REGISTER')
          setShowValidateCodeInput(false)
        }}
        // 注册验证码、重置密码
        type={validateCodeType}
        open={showValidateCodeInput}
      />
    </>
  )
}

export default observer(Login)
