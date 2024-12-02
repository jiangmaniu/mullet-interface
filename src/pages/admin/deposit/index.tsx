import { FormattedMessage, useIntl } from '@umijs/max'

import PageContainer from '@/components/Admin/PageContainer'
import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { stores } from '@/context/mobxProvider'
import { IDepositMethod } from '@/mobx/deposit/types'

import DepositMethod from './comp'

export default function Deposit() {
  const intl = useIntl()

  const userStatus = 0

  const methods = stores.deposit.methods

  return (
    <PageContainer pageBgColorMode="white" fluidWidth>
      <div className="text-primary font-bold text-[24px] mb-7">
        <FormattedMessage id="mt.rujin" />
      </div>
      <div className="flex flex-col gap-8 ">
        {userStatus === 0 && (
          <div className=" border border-gray-150 rounded-lg px-5 py-4 flex justify-between">
            <div className="flex flex-row items-center gap-[18px]">
              <Iconfont name="zhanghu" width={32} height={32} color="black" />
              <div className=" text-base font-semibold text-gray-900">{intl.formatMessage({ id: 'mt.wanshanzhanghuziliao' })}</div>
            </div>

            <Button type="primary">{intl.formatMessage({ id: 'mt.wanshangerenziliao' })}</Button>
          </div>
        )}

        <div>
          <div className=" text-primary text-base text-gray-900 mb-6 ">
            {intl.formatMessage({ id: 'mt.rujinfangshi' })}
            {userStatus === 0 && (
              <span className=" text-secondary text-sm ">&nbsp;({intl.formatMessage({ id: 'mt.renzhenghoukaiqi' })})</span>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:gap-[38px] md:gap-[24px] gap-[16px]">
            {methods.map((item: IDepositMethod) => (
              <DepositMethod item={item} key={item.title} />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}
