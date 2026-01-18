import { Trans } from '@/libs/lingui/react/macro'
import { useState, useMemo } from 'react'
import { observer } from 'mobx-react'
import { toast } from 'sonner'

import { Button, IconButton } from '@/libs/ui/components/button'
import { ModalHeader, ModalTitle, ModalClose } from '@/libs/ui/components/modal'
import { Iconify, IconOkxWallet } from '@/libs/ui/components/icons'
import { Input } from '@/libs/ui/components/input'
import { Select, SelectValue } from '@/libs/ui/components/select'
import { RichSelectContent, RichSelectItem, RichSelectTrigger } from '@/libs/ui/components/rich-select'
import { Popover, PopoverContent, PopoverTrigger } from '@/libs/ui/components/popover'
import { cn } from '@/libs/ui/lib/utils'
import { NumberInputPrimitive } from '@/libs/ui/components/number-input-primitive'
import { BNumber } from '@/libs/utils/number'

// Mock Icons
const IconAlchemyPay = ({ className, ...props }: { className?: string }) => (
  <Iconify icon="iconoir:flash-solid" className={cn('text-brand-primary', className)} {...props} />
)

type Currency = 'HKD' | 'USD'
type Channel = 'Alchemy Pay' | 'OKX Connect'
type Status = 'idle' | 'processing' | 'success'

const CHANNELS: { id: Channel; name: string; icon: any }[] = [
  { id: 'Alchemy Pay', name: 'Alchemy Pay', icon: IconAlchemyPay },
  { id: 'OKX Connect', name: 'OKX Connect', icon: IconOkxWallet }
]

const CURRENCIES: { code: Currency; name: string; symbol: string }[] = [
  { code: 'HKD', name: 'Hong Kong Dollar', symbol: '$' },
  { code: 'USD', name: 'US Dollar', symbol: '$' }
]

export const CreditCardBuy = observer(({ onBack }: { onBack: () => void }) => {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState<Currency>('HKD')
  const [channel, setChannel] = useState<Channel>('Alchemy Pay')
  const [status, setStatus] = useState<Status>('idle')
  const [openCurrency, setOpenCurrency] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Mock balance
  const walletBalance = '153,568.00'

  const selectedChannel = useMemo(() => CHANNELS.find((c) => c.id === channel), [channel])
  const selectedCurrency = useMemo(() => CURRENCIES.find((c) => c.code === currency), [currency])

  const filteredCurrencies = useMemo(() => {
    if (!searchQuery) return CURRENCIES
    const q = searchQuery.toLowerCase()
    return CURRENCIES.filter((c) => c.code.toLowerCase().includes(q) || c.name.toLowerCase().includes(q))
  }, [searchQuery])

  const handleContinue = () => {
    setStatus('processing')
    // Simulate API call
    setTimeout(() => {
      setStatus('success')
    }, 2000)
  }

  const handleCloseStatus = () => {
    setStatus('idle')
    setAmount('')
  }

  if (status !== 'idle') {
    return (
      <>
        <ModalHeader className="w-full">
          <ModalTitle className="flex items-center w-full gap-medium">
            <IconButton variant="ghost" className="text-brand-secondary-2" size={'icon-sm'} onClick={handleCloseStatus}>
              <Iconify icon="iconoir:nav-arrow-left" className="size-4" />
            </IconButton>
            <div className="flex flex-col gap-xs">
              <Trans>信用卡买币</Trans>
              <div className="text-paragraph-p3 text-content-4 !font-normal">
                <Trans>余额：${walletBalance}</Trans>
              </div>
            </div>
          </ModalTitle>
        </ModalHeader>

        <div className="flex flex-col items-center justify-center flex-1 gap-2xl">
          <div className="flex flex-col py-2xl gap-2.5">
            {selectedChannel && (
              <div className="flex items-center justify-center">
                <selectedChannel.icon className="w-10 h-10" />
              </div>
            )}

            <div className="flex flex-col items-center gap-medium text-center">
              <div className="text-paragraph-p2 text-content-1">
                <Trans>使用{channel}完成交易</Trans>
              </div>
              <div className="text-paragraph-p3 text-content-4">
                <Trans>您可以关闭此窗口</Trans>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-large mt-2xl">
            {/* Step 1: Fiat */}
            <div className="flex items-center gap-medium">
              <div className="w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center">{selectedCurrency?.symbol}</div>
              <div className="flex flex-col">
                <span className="text-paragraph-p2 text-content-1">
                  <Trans>您使用</Trans>
                </span>
                <span className="text-paragraph-p3 text-content-4">{selectedCurrency?.name.split(' ')[0]}</span>
              </div>
            </div>

            <Iconify icon="iconoir:arrow-right-tag-solid" fontSize={24} className="text-brand-secondary-1" />

            {/* Step 2: USDC */}
            <div className="flex items-center gap-medium">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <Iconify icon="cryptocurrency:usdc" className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-paragraph-p2 text-content-1">
                  <Trans>您购买</Trans>
                </span>
                <span className="text-paragraph-p3 text-content-4">USDC</span>
              </div>
            </div>

            <Iconify icon="iconoir:arrow-right-tag-solid" fontSize={24} className="text-brand-secondary-1" />

            {/* Step 3: Receive */}
            <div className="flex items-center gap-medium">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <Iconify icon="cryptocurrency:usdc" className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-paragraph-p2 text-content-1">
                  <Trans>您收到</Trans>
                </span>
                <span className="text-paragraph-p3 text-content-4">USDC</span>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <ModalHeader className="w-full">
        <ModalTitle className="flex items-center w-full gap-medium">
          <IconButton variant="ghost" className="text-brand-secondary-2" size={'icon-sm'} onClick={onBack}>
            <Iconify icon="iconoir:nav-arrow-left" className="size-4" />
          </IconButton>
          <div className="flex flex-col gap-xs">
            <Trans>信用卡买币</Trans>
            <div className="text-paragraph-p3 text-content-4 !font-normal">
              <Trans>余额：${walletBalance}</Trans>
            </div>
          </div>
        </ModalTitle>
      </ModalHeader>

      <div className="flex flex-col flex-1 gap-2xl">
        {/* Amount Input */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2">
            <Popover open={openCurrency} onOpenChange={setOpenCurrency}>
              <PopoverTrigger asChild>
                <div
                  role="combobox"
                  aria-expanded={openCurrency}
                  className="flex items-center justify-between h-8 gap-1 px-2 text-paragraph-p2 text-content-4 hover:text-content-1 hover:bg-transparent cursor-pointer"
                >
                  <span>{currency}</span>
                  <Iconify
                    icon="iconoir:nav-arrow-down"
                    className={cn('w-4 h-4 opacity-50 transition-transform duration-200', openCurrency && 'rotate-180')}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[328px] border-brand-default p-0" align="center">
                <div className="flex flex-col gap-2 p-xl">
                  <Input
                    placeholder="查询"
                    className="text-paragraph-p2"
                    LeftContent={<Iconify icon="iconoir:search" className="size-5 text-content-4" />}
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                </div>
                <div className="flex flex-col max-h-[300px] overflow-y-auto">
                  {/* Headers like 'HK Hong Kong Dollar ($)' could be items themselves or just formatting */}
                  {filteredCurrencies.map((c) => (
                    <div
                      key={c.code}
                      className={cn(
                        'flex items-center gap-medium p-xl cursor-pointer hover:bg-surface-elevation-2 transition-colors',
                        currency === c.code && 'bg-move-in'
                      )}
                      onClick={() => {
                        setCurrency(c.code)
                        setOpenCurrency(false)
                        setSearchQuery('')
                      }}
                    >
                      <span className="text-paragraph-p3 text-content-1">{c.code}</span>
                      <span className="text-paragraph-p2 text-content-1">{c.name}</span>
                      <span className="text-paragraph-p2 text-content-1">({c.symbol})</span>
                    </div>
                  ))}
                  {filteredCurrencies.length === 0 && (
                    <div className="px-4 py-3 text-paragraph-p3 text-content-4 text-center">
                      <Trans>无结果</Trans>
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-center items-center gap-xs py-2xl text-title-h2">
            <span className="text-content-1 flex-shrink-0">{selectedCurrency?.symbol}</span>
            <div className="w-auto relative">
              <div className="opacity-0 text-nowrap">{BNumber.toFormatNumber(amount ?? 0, { fallbackToZero: true, volScale: 2 })}</div>
              <NumberInputPrimitive
                value={amount}
                onValueChange={(val: any) => {
                  setAmount(val.value)
                }}
                placeholder="0.00"
                thousandSeparator
                decimalScale={2}
                className={cn('absolute top-0 left-0 w-full h-full', !amount ? 'text-content-4' : 'text-white')}
              />
            </div>
          </div>
        </div>

        {/* Channel Selection */}
        <div className="flex items-center justify-between px-xl py-medium rounded-small border border-brand-default">
          <div className="flex flex-col gap-xs">
            <span className="text-paragraph-p1 text-content-1">
              <Trans>渠道选择</Trans>
            </span>
            <div className="text-paragraph-p3 text-content-4">
              <Trans>为您自动选择</Trans>
            </div>
          </div>
          <Select value={channel} onValueChange={(v) => setChannel(v as Channel)}>
            <RichSelectTrigger className="w-fit h-9 gap-2 border-none px-xs">
              <SelectValue>
                {selectedChannel && (
                  <div className="flex items-center gap-2">
                    <selectedChannel.icon className="w-6 h-6" />
                    <span className="text-paragraph-p2">{selectedChannel.name}</span>
                  </div>
                )}
              </SelectValue>
            </RichSelectTrigger>
            <RichSelectContent position="popper" align="end" className="w-[328px] -right-xl -bottom-4">
              {CHANNELS.map((c) => {
                // Mock rate calculation: 1 HKD = 0.128 USD
                const rate = currency === 'HKD' ? 0.128 : 1
                const receiveAmount = Number(amount) * rate
                return (
                  <RichSelectItem key={c.id} value={c.id} className="py-3 [&>span]:w-full">
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <c.icon className="w-6 h-6" />
                        <span className="text-paragraph-p2 text-content-1">{c.name}</span>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-paragraph-p2 text-content-1">
                          ${BNumber.toFormatNumber(receiveAmount, { fallbackToZero: true, volScale: 2 })}
                        </span>
                        <span className="text-paragraph-p3 text-content-4">
                          {currency} ${BNumber.toFormatNumber(amount, { fallbackToZero: true, volScale: 2 })}
                        </span>
                      </div>
                    </div>
                  </RichSelectItem>
                )
              })}
            </RichSelectContent>
          </Select>
        </div>

        <Button block color="primary" size="lg" onClick={handleContinue} className="mt-auto" disabled={!amount}>
          <Trans>继续</Trans>
        </Button>
      </div>
    </>
  )
})
