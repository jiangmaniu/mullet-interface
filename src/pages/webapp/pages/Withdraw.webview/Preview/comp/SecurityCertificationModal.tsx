import CodeInput from '@/components/Base/CodeInput'
import { stores } from '@/context/mobxProvider'
import Button from '@/pages/webapp/components/Base/Button'
import SheetModal, { ModalRef, SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { sendCustomPhoneCode } from '@/services/api/user'
import { regPassword } from '@/utils'
import { ProForm, ProFormText } from '@ant-design/pro-components'
import { getIntl, useModel } from '@umijs/max'
import { message } from 'antd'
import { Form } from 'antd/lib'
import type { ForwardedRef } from 'react'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

type IProps = {
  title?: string
  onSubmit: (values: any) => void
}

/** 选择账户弹窗 */
function SecurityCertificationModal({ title, onSubmit }: IProps, ref: ForwardedRef<ModalRef>) {
  const i18n = useI18n()
  const { t } = i18n

  const bottomSheetModalRef = useRef<SheetRef>(null)

  useImperativeHandle(ref, () => ({
    show: () => {
      bottomSheetModalRef.current?.sheet?.present()
    },
    close: () => {
      bottomSheetModalRef.current?.sheet?.dismiss()
    }
  }))

  const { initialState } = useModel('@@initialState')
  const currentUser = initialState?.currentUser
  const [form] = Form.useForm()
  const password = Form.useWatch('password', form)
  const code = Form.useWatch('code', form)

  const [sendTime, setSendTime] = useState(0)
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null)
  const [sended, setSended] = useState(false)

  const handleGetVerificationCode = async () => {
    if (sendTime > 0) return

    if (!currentUser?.userInfo?.phone) {
      message.info(getIntl().formatMessage({ id: 'mt.qingxianwanshankycrenzheng' }))
      return
    }

    sendCustomPhoneCode({
      phone: currentUser?.userInfo?.phone,
      phoneAreaCode: currentUser?.userInfo?.phoneAreaCode
    })
      .then((res) => {
        res.success && setSendTime(60)
        setSended(true)
      })
      .catch((err) => {
        console.log('err', err)
      })
  }

  useEffect(() => {
    if (sendTime === 60) {
      const timer = setInterval(() => {
        setSendTime((prev) => prev - 1)
      }, 1000)

      setTimer(timer)
    }

    if (sendTime === 0) {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [sendTime])

  const registerWay = stores.global.registerWay

  const value =
    registerWay === 'PHONE' ? `${currentUser?.userInfo?.phoneAreaCode}${currentUser?.userInfo?.phone}` : currentUser?.userInfo?.email

  const type =
    registerWay === 'PHONE' ? getIntl().formatMessage({ id: 'mt.shoujiduanxin' }) : getIntl().formatMessage({ id: 'common.dianziyouxiang' })

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      onSubmit(values)
    })
  }

  const disabled = !password || !code

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      title={t('mt.anquanrenzheng')}
      autoHeight
      footer={
        <>
          {sended ? (
            <Button type="primary" size="large" disabled={disabled} className="mt-2 mb-2.5" onClick={handleSubmit}>
              {getIntl().formatMessage({ id: 'mt.querentixian' })}
            </Button>
          ) : (
            <Button size="large" className="mt-2 mb-2.5" onClick={handleGetVerificationCode}>
              {getIntl().formatMessage({ id: 'mt.huoquyanzhengma' })}
            </Button>
          )}
        </>
      }
      children={
        <div className="px-5 pb-4">
          <ProForm form={form} submitter={false}>
            <ProFormText.Password
              name="password"
              fieldProps={{ type: 'password', allowClear: false, size: 'large' }}
              label={getIntl().formatMessage({ id: 'mt.zhanghaomima' })}
              placeholder={getIntl().formatMessage({ id: 'mt.qingshuruzhanghaomima' })}
              rules={[
                {
                  required: true,
                  message: getIntl().formatMessage({ id: 'mt.pleaseInputPwdPlaceholder' }),
                  pattern: regPassword
                }
              ]}
            />
            <div className=" text-xl text-primary mt-4 mb-2.5">{getIntl().formatMessage({ id: 'mt.chakanduanxin' })}</div>
            <ProForm.Item
              label={
                <span className="text-weak text-xs">
                  {getIntl().formatMessage(
                    {
                      id: 'mt.yanzhengmajiangfasongzhi'
                    },
                    {
                      value,
                      type
                    }
                  )}
                </span>
              }
            >
              <div className="flex items-center flex-wrap gap-6">
                <CodeInput form={form} name="code" disabled={!sended} width={50} height={50} />
              </div>
            </ProForm.Item>
            {sended && (
              <div className="text-weak text-xs mt-2.5">
                {getIntl().formatMessage({ id: 'mt.weishoudaoyanzhengma' })}
                {sendTime > 0 ? (
                  getIntl().formatMessage({ id: 'mt.qingzaixxmiaohouchongshi' }, { count: sendTime })
                ) : (
                  <span className="text-brand text-xs cursor-pointer" onClick={handleGetVerificationCode}>
                    {getIntl().formatMessage({ id: 'common.chongxinfasong' })}
                  </span>
                )}
              </div>
            )}
          </ProForm>
        </div>
      }
    />
  )
}

export default forwardRef(SecurityCertificationModal)
