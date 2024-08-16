import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Input } from 'antd'

import Tags from '@/components/Admin/Tags'
import Button from '@/components/Base/Button'

export default () => {
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
        <span className=" text-sm font-normal text-black-800">
          <FormattedMessage id="mt.lirunfenchengbili" />
        </span>
        <Input
          size="large"
          style={{
            width: '100%',
            height: '2.8125rem',
            lineHeight: '2.8125rem'
          }}
          placeholder={`${intl.formatMessage({ id: 'mt.qingshuru' })}${intl.formatMessage({ id: 'mt.lirunfenchengbili' })}`}
          count={{
            show: false,
            max: 10
          }}
          suffix={<span className=" text-sm font-semibold text-black-800">%</span>}
        />
      </div>
      {/* 資產要求 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-black-800">
          <FormattedMessage id="mt.zichanyaoqiu" />
        </span>
        <Input
          size="large"
          style={{
            width: '100%',
            height: '2.8125rem',
            lineHeight: '2.8125rem'
          }}
          placeholder={`${intl.formatMessage({ id: 'mt.qingshuru' })}${intl.formatMessage({ id: 'mt.zichanyaoqiu' })}`}
          count={{
            show: false,
            max: 10
          }}
          suffix={<span className=" text-sm font-semibold text-black-800">USD</span>}
        />
      </div>
      {/* 資產規模 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-black-800">
          <FormattedMessage id="mt.zichanguimo" />
        </span>
        <Input
          size="large"
          style={{
            width: '100%',
            height: '2.8125rem',
            lineHeight: '2.8125rem'
          }}
          placeholder={`${intl.formatMessage({ id: 'mt.qingshuru' })}${intl.formatMessage({ id: 'mt.zichanguimo' })}`}
          count={{
            show: false,
            max: 10
          }}
          suffix={<span className=" text-sm font-semibold text-black-800">USD</span>}
        />
      </div>
      {/* 最大支持人數 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-black-800">
          <FormattedMessage id="mt.zuidazhichirenshu" />
        </span>
        <Input
          size="large"
          style={{
            width: '100%',
            height: '2.8125rem',
            lineHeight: '2.8125rem'
          }}
          placeholder={`${intl.formatMessage({ id: 'mt.qingshuru' })}${intl.formatMessage({ id: 'mt.zuidazhichirenshu' })}`}
          count={{
            show: false,
            max: 10
          }}
          suffix={
            <span className=" text-sm font-semibold text-black-800">
              <FormattedMessage id="mt.ren" />
            </span>
          }
        />
      </div>
      {/* 帶單標籤 */}
      <div className="flex flex-col gap-2.5 justify-start flex-1">
        <span className=" text-sm font-normal text-black-800">
          <FormattedMessage id="mt.daidanbiaoqian" />
        </span>
        <div className="flex flex-row flex-wrap gap-3">
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
        </div>
      </div>
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
          }}
        >
          <div className=" flex items-center gap-1">
            <span className=" font-semibold text-base ">
              <FormattedMessage id="mt.baocun" />
            </span>
          </div>
        </Button>
      </div>
    </div>
  )
}
