import './style.less'

import { FormattedMessage, useIntl } from '@umijs/max'
import React from 'react'

import { CURRENT_YEAR } from '@/constants'

import Logo from '../Header/Logo'

const Footer: React.FC = () => {
  const intl = useIntl()
  const list = [
    {
      title: intl.formatMessage({ id: 'mt.guanyucdex' }),
      value: [
        intl.formatMessage({ id: 'mt.cdexsshequ' }),
        intl.formatMessage({ id: 'mt.gongsijianjie' }),
        intl.formatMessage({ id: 'mt.boke' })
      ]
    },
    {
      title: intl.formatMessage({ id: 'mt.fuwu' }),
      value: [
        intl.formatMessage({ id: 'mt.haoyoutuijian' }),
        intl.formatMessage({ id: 'mt.jiaoyi' }),
        intl.formatMessage({ id: 'mt.xiazai' }),
        intl.formatMessage({ id: 'mt.bangzhuzhongxin' }),
        intl.formatMessage({ id: 'mt.jiaoyifeiyong' }),
        intl.formatMessage({ id: 'mt.jiangli' })
      ]
    },
    {
      title: intl.formatMessage({ id: 'mt.xueyuan' }),
      value: [intl.formatMessage({ id: 'mt.chanpin' }), intl.formatMessage({ id: 'mt.xinshouzhinan' })]
    },
    {
      title: intl.formatMessage({ id: 'mt.tiaokuan' }),
      value: [intl.formatMessage({ id: 'mt.fengxiantishi' }), intl.formatMessage({ id: 'mt.yinsiquantiaokuan' })]
    }
  ]

  return (
    <div className="flex flex-col gap-12 self-center items-center pt-12">
      <div className=" w-full h-[1px] rounded bg-gray-180"></div>
      <div className="flex items-start justify-center gap-28 px-12">
        <div className="flex flex-col justify-between h-32 w-44">
          <Logo />

          <div className=" flex flex-col gap-2 items-start">
            <span className=" text-xs text-gray-700">
              <FormattedMessage id="mt.cdexsshequ" />
            </span>
            <span className=" grid grid-cols-6 items-center w-full gap-1">
              <img src="/img/footer/app_icon1.svg" width={18} height={18} className=" cursor-pointer" />
              <img src="/img/footer/app_icon2.svg" width={18} height={18} className=" cursor-pointer" />
              <img src="/img/footer/app_icon3.svg" width={18} height={18} className=" cursor-pointer" />
              <img src="/img/footer/app_icon4.svg" width={18} height={18} className=" cursor-pointer" />
              <img src="/img/footer/app_icon5.svg" width={18} height={18} className=" cursor-pointer" />
              <img src="/img/footer/app_icon6.svg" width={20} height={20} className=" cursor-pointer" />
            </span>
          </div>
        </div>

        <div className=" flex flex-row justify-start items-start gap-20 flex-1">
          {list.map((item, index) => (
            <div key={index} className=" flex flex-col gap-2 items-start  text-xs text-gray-700">
              <span className=" text-md text-gray-700 font-semibold mb-1">{item.title}</span>
              {item.value.map((item, index) => (
                <span key={index} className=" text-xs text-gray-700 cursor-pointer ">
                  {item}
                </span>
              ))}
            </div>
          ))}
          <div className=" w-20"></div>
        </div>
        <div className=" flex flex-col gap-4 items-end text-sm font-semibold text-gray-700">
          <span>
            <FormattedMessage id="mt.saomajiaruwomen" />
          </span>
          <img src="/img/footer/qrcode.png" width={96} height={96} />
        </div>
      </div>
      <div className=" w-full h-[1px] rounded bg-gray-180"></div>
      <div className=" grid grid-cols-5 gap-10">
        <div className="flex flex-col gap-3 items-center footer_item">
          <img src="/img/footer/fcis.png" width={108} height={108} />
          <div className=" text-2xl font-bold ">FCIS</div>
          <div className=" text-gray-360 text-xs">License No.306008359</div>
          <div className=" text-gray-360 text-xs">
            Membership of Financial Crime <br /> Investigation Service of Lithuania
          </div>
        </div>
        <div className="flex flex-col gap-3 items-center footer_item">
          <img src="/img/footer/sfc.png" width={108} height={108} />
          <div className=" text-2xl font-bold ">SFC</div>
          <div className=" text-gray-360 text-xs">License No.AXT242</div>
          <div className=" text-gray-360 text-xs">
            Membership of Securities and <br /> Futures Commission of Hong Kong
          </div>
        </div>
        <div className="flex flex-col gap-3 items-center footer_item">
          <img src="/img/footer/fsc.png" width={108} height={108} />
          <div className=" text-2xl font-bold ">FSC</div>
          <div className=" text-gray-360 text-xs">License No.GB23201764</div>
          <div className=" text-gray-360 text-xs">
            Membership of Financial Services <br /> Commission - Mauritius
          </div>
        </div>
        <div className="flex flex-col gap-3 items-center footer_item">
          <img src="/img/footer/cysec.png" width={108} height={108} />
          <div className=" text-2xl font-bold ">CySEC</div>
          <div className=" text-gray-360 text-xs">License No.299/16</div>
          <div className=" text-gray-360 text-xs">
            Membership of Cyprus Securities and <br /> Exchange Commission
          </div>
        </div>
        <div className="flex flex-col gap-3 items-center footer_item">
          <img src="/img/footer/fsa.png" width={108} height={108} />
          <div className=" text-2xl font-bold ">FSA</div>
          <div className=" text-gray-360 text-xs">License No.SD184</div>
          <div className=" text-gray-360 text-xs">
            Membership of Financial Services <br /> Authority Seychelles
          </div>
        </div>
      </div>
      <div className=" text-gray-360 text-xs">CDEX © {CURRENT_YEAR} Cookie Preferences</div>
    </div>
  )
}

export default Footer
