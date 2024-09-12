import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { FormInstance } from 'antd'

import ProFormText from '@/components/Admin/Form/ProFormText'
import Button from '@/components/Base/Button'

type IProps = {
  form: FormInstance
  info: TradeFollowLead.LeadDetailItem | null
}

export default ({ form, info }: IProps) => {
  const intl = useIntl()
  const { initialState } = useModel('@@initialState')
  const accountList = initialState?.currentUser?.accountList?.filter((item) => !item.isSimulate) || [] // 真实账号列表

  const tags = [
    {
      color: 'green',
      format: {
        id: 'mt.dipin'
      }
    },
    {
      color: 'gray',
      format: {
        id: 'mt.dipin'
      }
    },
    {
      color: 'green',
      format: {
        id: 'mt.dipin'
      }
    },
    {
      color: 'green',
      format: {
        id: 'mt.dipin'
      }
    }
  ]

  return (
    <div className="flex flex-col justify-between gap-4.5 w-full max-w-full">
      {/* 利潤分成比例 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-primary">
          <FormattedMessage id="mt.lirunfenchengbili" />
        </span>
        <ProFormText
          name="profitSharingRatio"
          rules={[
            {
              required: true,
              // message: intl.formatMessage({ id: 'common.qingshuru' }),
              validator(rule, value, callback) {
                if (!value) {
                  return Promise.reject(intl.formatMessage({ id: 'common.qingshuru' }))
                }
                const _value = Number(value)
                // 数字必须是正数
                if (Number.isFinite(_value) && _value > 0) {
                  // 必须大于后台限制数
                  if (info?.profitSharingRatioLimit && _value > info.profitSharingRatioLimit) {
                    return Promise.reject(
                      intl.formatMessage(
                        { id: 'mt.dayuxianzhifanwei' },
                        {
                          type: intl.formatMessage({ id: 'mt.lirunfenchengbili' }),
                          value: info.profitSharingRatioLimit
                        }
                      )
                    )
                  }

                  return Promise.resolve()
                }

                return Promise.reject(intl.formatMessage({ id: 'mt.qingshuruzhengshu' }))
              }
            }
          ]}
          fieldProps={{
            size: 'large',
            style: {
              width: '100%',
              height: '2.8125rem',
              lineHeight: '2.8125rem'
            },
            placeholder: `${intl.formatMessage({ id: 'common.qingshuru' })}${intl.formatMessage({ id: 'mt.lirunfenchengbili' })}`,
            count: {
              show: false,
              max: 10
            },
            suffix: <span className=" text-sm font-semibold text-primary">%</span>
          }}
        />
      </div>
      {/* 資產要求 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-primary">
          <FormattedMessage id="mt.zichanyaoqiu" />
        </span>
        <ProFormText
          name="assetRequirement"
          rules={[
            {
              required: true,
              // message: intl.formatMessage({ id: 'common.qingshuru' }),
              validator(rule, value, callback) {
                if (!value) {
                  return Promise.reject(intl.formatMessage({ id: 'common.qingshuru' }))
                }
                const _value = Number(value)
                // 数字必须是正数
                if (Number.isFinite(_value) && _value > 0) {
                  // 前臺不限制
                  // if (info?.assetRequirementLimit && _value < info.assetRequirementLimit) {
                  //   return Promise.reject(
                  //     intl.formatMessage(
                  //       { id: 'mt.xiaoyuxianzhifanwei' },
                  //       {
                  //         type: intl.formatMessage({ id: 'mt.zichanyaoqiu' }),
                  //         value: info.assetRequirementLimit
                  //       }
                  //     )
                  //   )
                  // }

                  return Promise.resolve()
                }

                return Promise.reject(intl.formatMessage({ id: 'mt.qingshuruzhengshu' }))
              }
            }
          ]}
          fieldProps={{
            size: 'large',
            style: {
              width: '100%',
              height: '2.8125rem',
              lineHeight: '2.8125rem'
            },
            placeholder: `${intl.formatMessage({ id: 'common.qingshuru' })}${intl.formatMessage({ id: 'mt.zichanyaoqiu' })}`,
            count: {
              show: false,
              max: 10
            },
            suffix: <span className=" text-sm font-semibold text-primary">USD</span>
          }}
        />
      </div>
      {/* 資產規模 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-primary">
          <FormattedMessage id="mt.zichanguimo" />
        </span>
        <ProFormText
          name="assetScale"
          rules={[
            {
              required: true,
              // message: intl.formatMessage({ id: 'common.qingshuru' }),
              validator(rule, value, callback) {
                if (!value) {
                  return Promise.reject(intl.formatMessage({ id: 'common.qingshuru' }))
                }

                const _value = Number(value)
                // 数字必须是正数
                if (Number.isFinite(_value) && _value > 0) {
                  // 必须小于后台限制数
                  if (info?.assetScaleLimit && _value > info.assetScaleLimit) {
                    return Promise.reject(
                      intl.formatMessage(
                        { id: 'mt.dayuxianzhifanwei' },
                        {
                          type: intl.formatMessage({ id: 'mt.zichanguimo' }),
                          value: info.assetScaleLimit
                        }
                      )
                    )
                  }

                  return Promise.resolve()
                }

                return Promise.reject(intl.formatMessage({ id: 'mt.qingshuruzhengshu' }))
              }
            }
          ]}
          fieldProps={{
            size: 'large',
            style: {
              width: '100%',
              height: '2.8125rem',
              lineHeight: '2.8125rem'
            },
            placeholder: `${intl.formatMessage({ id: 'common.qingshuru' })}${intl.formatMessage({ id: 'mt.zichanguimo' })}`,
            count: {
              show: false,
              max: 10
            },
            suffix: <span className=" text-sm font-semibold text-primary">USD</span>
          }}
        />
      </div>
      {/* 最大支持人數 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-primary">
          <FormattedMessage id="mt.zuidazhichirenshu" />
        </span>
        <ProFormText
          name="maxSupportCount"
          rules={[
            {
              required: true,
              // message: intl.formatMessage({ id: 'common.qingshuru' }),
              validator(rule, value, callback) {
                if (!value) {
                  return Promise.reject(intl.formatMessage({ id: 'common.qingshuru' }))
                }
                const _value = Number(value)

                // 必须小于后台限制数
                if (info?.maxSupportCountLimit && _value > info.maxSupportCountLimit) {
                  return Promise.reject(
                    intl.formatMessage(
                      { id: 'mt.dayuxianzhifanwei' },
                      {
                        type: intl.formatMessage({ id: 'mt.zuidazhichirenshu' }),
                        value: info.maxSupportCountLimit
                      }
                    )
                  )
                }

                return Promise.resolve()
                // 数字必须是正整数
                // if (Number.isInteger(_value) && _value > 0) {
                //   return Promise.resolve()
                // }

                // return Promise.reject(intl.formatMessage({ id: 'mt.qingshuruzhengzhengshu' }))
              }
            }
          ]}
          fieldProps={{
            size: 'large',
            style: {
              width: '100%',
              height: '2.8125rem',
              lineHeight: '2.8125rem'
            },
            placeholder: `${intl.formatMessage({ id: 'common.qingshuru' })}${intl.formatMessage({ id: 'mt.zuidazhichirenshu' })}`,
            count: {
              show: false,
              max: 10
            },
            suffix: (
              <span className=" text-sm font-semibold text-primary">
                <FormattedMessage id="mt.ren" />
              </span>
            )
          }}
        />
      </div>
      {/* 帶單標籤 */}
      {/* <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-primary">
          <FormattedMessage id="mt.daidanbiaoqian" />
        </span>
        <div className="flex flex-row flex-wrap gap-3 hide-form-item">
          {tags.map((tag, idx) => (
            <Tags
              color={tag.color}
              format={tag.format}
              key={idx}
              selectable
              onClick={() => {
                console.log(tag)
              }}
            />
          ))}
          <ProFormText name="tags" />
        </div>
      </div> */}
      {/* 保存 */}
      <div className=" justify-self-end flex flex-col items-start justify-between gap-2.5 w-[532px] max-w-full">
        <Button
          height={48}
          type="primary"
          style={{
            width: '100%',
            borderRadius: 8
          }}
          onClick={() => {
            // todo 跳转
            form.submit()
          }}
        >
          <div className=" flex items-center gap-1">
            <span className=" font-semibold text-base ">
              <FormattedMessage id="common.baocun" />
            </span>
          </div>
        </Button>
      </div>
    </div>
  )
}
