import { ProFormSelect } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage } from '@umijs/max'
import { Col, Row } from 'antd'
import classNames from 'classnames'
import { useState } from 'react'

import Iconfont from '@/components/Base/Iconfont'

function getRandomProgress() {
  return Math.floor(Math.random() * 101)
}

type ModeType = 'BUY_SELL' | 'BUY' | 'SELL'

// 盘口深度报价
export default function DeepPrice() {
  const [mode, setMode] = useState<ModeType>('BUY')
  const modeList: Array<{ key: ModeType; icon: string }> = [
    {
      key: 'BUY_SELL',
      icon: 'pankou-maimai'
    },
    {
      key: 'BUY',
      icon: 'pankou-mai'
    },
    {
      key: 'SELL',
      icon: 'pankou-mai1'
    }
  ]

  const className = useEmotionCss(({ token }) => {
    return {
      '&::after': {
        content: "''",
        background: '#EEEEEE',
        width: 1,
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0
      }
    }
  })

  return (
    <div className={classNames('w-[300px] bg-white relative', className)}>
      <div className="flex items-center justify-between pl-3 pr-1 pt-[5px] pb-1 border-b border-gray-130">
        <div className="flex items-center gap-x-4">
          {modeList.map((item, idx) => (
            <Iconfont
              name={item.icon}
              width={24}
              height={24}
              className={classNames('cursor-pointer', item.key === mode ? 'opacity-100' : 'opacity-30')}
              key={idx}
              onClick={() => {
                setMode(item.key)
              }}
            />
          ))}
        </div>
        <div>
          <ProFormSelect
            fieldProps={{
              size: 'small',
              defaultValue: '0.1',
              style: { minWidth: 60 },
              suffixIcon: <img src="/img/down2.png" width={14} height={14} />
            }}
            allowClear={false}
            options={[
              {
                label: '0.01',
                value: '0.01'
              },
              {
                label: '0.1',
                value: '0.1'
              },
              {
                label: '1',
                value: '1'
              },
              {
                label: '10',
                value: '10'
              },
              {
                label: '50',
                value: '50'
              }
            ]}
          />
        </div>
      </div>
      <div className="py-3">
        <Row className="pb-2 px-3">
          <Col span={8}>
            <FormattedMessage id="mt.jiage" />
          </Col>
          <Col span={8}>
            <FormattedMessage id="mt.shuliang" />
            (BTC)
          </Col>
          <Col span={8} className="text-right">
            <FormattedMessage id="mt.chengjiaoe" />
          </Col>
        </Row>
        {Array.from({ length: 10 }, (k, v) => k).map((item, idx) => {
          return (
            <div key={idx}>
              <Row className="py-2 bg-[#FFDDE2] px-3">
                <Col span={8} className="text-xs text-red font-dingpro-regular text-left">
                  46,604.1
                </Col>
                <Col span={8} className="font-dingpro-regular text-xs text-gray text-left">
                  7.11231
                </Col>
                <Col span={8} className="font-dingpro-regular text-xs text-gray text-right">
                  20,120
                </Col>
              </Row>
              {/* 进度条 */}
              <div className=""></div>
            </div>
          )
        })}
        <div className="border-t border-b border-gray-60 py-2 px-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-lg text-green font-dingpro-medium pr-[10px]">46,604.1</span>
              <span className="text-sm text-gray-secondary font-dingpro-medium">¥422,311.21</span>
            </div>
            <span className="text-xs text-gray-secondary cursor-pointer">
              <FormattedMessage id="common.more" />
            </span>
          </div>
        </div>
        {Array.from({ length: 10 }, (k, v) => k).map((item, idx) => {
          return (
            <Row key={idx} className="py-2 bg-[#D6FFF4] px-3">
              <Col span={8} className="text-xs text-red font-dingpro-regular text-left">
                46,604.1
              </Col>
              <Col span={8} className="font-dingpro-regular text-xs text-gray text-left">
                7.11231
              </Col>
              <Col span={8} className="font-dingpro-regular text-xs text-gray text-right">
                20,120
              </Col>
            </Row>
          )
        })}
      </div>
    </div>
  )
}
