import { FormattedMessage } from '@umijs/max'

import Button from '@/components/Base/Button'
import Empty from '@/components/Base/Empty'
import Iconfont from '@/components/Base/Iconfont'
import { colorTextPrimary } from '@/theme/theme.config'

import TabTable from '../../TabsTable/Table'
import { orders } from './mock'
import useColumns from './useColumns'

export default () => {
  const columns = useColumns()

  return (
    <div className="flex flex-col gap-5 w-full">
      {orders.length > 0 ? (
        // takers.map((item: IOrder, idx: number) => (
        // ))

        <TabTable columns={columns} datas={orders} />
      ) : (
        <div className="flex items-center justify-center flex-col h-[36rem] gap-[3rem]">
          <Empty src="/img/empty-gendanguanli.png" description={<FormattedMessage id="mt.zanwujilu" />} />
          <Button
            height={44}
            type="primary"
            style={{
              width: 197,
              borderRadius: 8
            }}
            onClick={() => {
              // todo 跳转
            }}
          >
            <div className="flex items-center text-base font-semibold">
              <Iconfont name="gendanguanli" width={22} color="white" height={22} hoverColor={colorTextPrimary} />
              <FormattedMessage id="mt.qugendan" />
            </div>
          </Button>
        </div>
      )}
    </div>
  )
}
