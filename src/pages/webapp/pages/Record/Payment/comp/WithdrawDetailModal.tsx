import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import { getEnv } from '@/env'
import SheetModal, { ModalRef, SheetRef } from '@/pages/webapp/components/Base/SheetModal'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { formatNum } from '@/utils'
import { getAccountSynopsisByLng } from '@/utils/business'
import { cn } from '@/utils/cn'
import { FormattedMessage, useModel } from '@umijs/max'
import type { ForwardedRef } from 'react'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import { statusMap } from '..'

type IProps = {
  item: Wallet.withdrawalOrderListItem | undefined
}

/** 选择账户弹窗 */
function WithdrawDetailModal({ item }: IProps, ref: ForwardedRef<ModalRef>) {
  const i18n = useI18n()
  const { t } = i18n
  const { theme } = useTheme()

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
  const accountList = (currentUser?.accountList || []).filter((v) => !v.isSimulate) // 真实账号

  const synopsis = getAccountSynopsisByLng(accountList.find((v) => v.id === item?.tradeAccountId)?.synopsis)

  return (
    <SheetModal
      ref={bottomSheetModalRef}
      autoHeight
      hiddenFooter
      children={
        <div className="px-4 pt-2.5 pb-4 flex-col flex">
          <div className="flex flex-row justify-between items-start ">
            <div className="flex flew-row items-center gap-4 text-start min-w-[180px] flex-shrink-0">
              <div className=" bg-gray-50 w-10 h-10 rounded-full bg-secondary border border-gray-130 flex items-center justify-center">
                <Iconfont name="chujin" color="gray" width={18} height={18} />
              </div>
              <div className="w-[100px]">
                <div className="text-primary font-bold">
                  <FormattedMessage id="mt.chujin" />
                </div>
                <div className="text-weak text-xs overflow-visible whitespace-nowrap text-nowrap">
                  <FormattedMessage id="mt.danhao" />:{item?.orderNo}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="text-sm flex items-center font-normal " style={{ color: statusMap[item?.status ?? 'FAIL']?.color }}>
                <span
                  className={cn('w-[6px] h-[6px] rounded-full mr-1 mt-[1px]', item?.status === 'WAIT' && 'animate-pulse')}
                  style={{ backgroundColor: statusMap[item?.status ?? 'FAIL']?.color || '#9C9C9C' }}
                >
                  {/* 占位 */}
                </span>
                {statusMap[item?.status ?? 'FAIL']?.text || '[status]'}
              </div>
              {/* {item?.status === 'WAIT' && (
                <div
                  className="text-xs font-normal underline text-yellow-700 italic mr-1"
                  onClick={() => {
                    push(`/app/withdraw/otc/${item?.id}`)
                  }}
                >
                  上傳憑證
                </div>
              )} */}
            </div>
          </div>

          <div className=" text-sm font-medium text-weak flex flex-row items-center gap-[6px] mt-5 ">
            <Iconfont name="shijian" size={14} color={theme.colors.textColor.weak} />
            <span className="text-weak text-sm">{item?.createTime}</span>
          </div>

          <div className="flex flex-row items-end justify-start gap-x-7 gap-y-4 mt-6 pb-4 border-b border-gray-100 flex-wrap">
            <div className="flex flex-col gap-2">
              <div className=" text-secondary text-xs font-normal">
                <FormattedMessage id="mt.chujinzhanghu" />
              </div>
              <div className="flex text-sm font-bold flex-row items-center gap-1 overflow-hidden flex-1 ">
                <div className=" flex h-5 min-w-[34px] items-center px-1 justify-center rounded bg-black text-xs font-normal text-white ">
                  {synopsis?.abbr}
                </div>
                <span className=" text-nowrap text-ellipsis overflow-hidden">
                  {/* {accountList.find((v) => v.id === item?.tradeAccountId)?.synopsis?.name} */}
                  &nbsp;#{accountList.find((v) => v.id === item?.tradeAccountId)?.id}
                </span>
              </div>
            </div>

            <Iconfont name="go" width={20} color="black" height={20} />

            <div className="flex flex-col gap-2">
              <div className=" text-secondary text-xs font-normal">
                <FormattedMessage id="mt.shoukuanzhanghu" />
              </div>
              <div className="text-end text-sm font-medium flex-1 flex flex-row items-center justify-start flex-shrink gap-1">
                <>
                  {item?.type === 'bank' ? (
                    <span>{item?.bank}</span>
                  ) : (
                    <div className="flex flex-row items-center gap-1 text-sm font-medium">
                      <img src={`${getEnv().imgDomain}${item?.channelIcon}`} className="w-[18px] h-[18px] bg-gray-100 rounded-full" />
                      <span> {item?.address}</span>
                    </div>
                  )}
                </>
              </div>
            </div>
          </div>

          <div className={cn('flex flex-row justify-between items-end mt-4 pb-4', item?.status === 'REJECT' && 'border-b border-gray-100')}>
            <div className="flex flex-col gap-1.5">
              <div className="text-end text-xl font-medium flex-1">
                {formatNum(item?.receiptAmount, { precision: 2 })} {item?.symbol}
              </div>
              <span className=" text-xs text-secondary">
                <FormattedMessage id="mt.jine" />
              </span>
            </div>
            <div className="flex gap-2.5">
              <span className=" text-xs text-secondary">
                <FormattedMessage id="mt.shouxufei" />
              </span>
              <span className=" text-xs text-primary">
                {formatNum(item?.baseHandlingFee, { precision: 2 })} {item?.baseCurrency}
              </span>
            </div>
          </div>

          {item?.status === 'REJECT' && item?.remark && (
            <div className="text-sm text-primary mt-4 px-2  whitespace-pre-wrap  break-all">
              <FormattedMessage id="mt.beizhu" />
              :&nbsp;{item?.remark}
            </div>
          )}
        </div>
      }
    />
  )
}

export default forwardRef(WithdrawDetailModal)
