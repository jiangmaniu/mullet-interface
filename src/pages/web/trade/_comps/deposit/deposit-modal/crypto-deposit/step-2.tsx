import { Trans } from '@/libs/lingui/react/macro'
import { useEffect, useMemo } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { toast } from 'sonner'
import { IconButton, Button } from '@/libs/ui/components/button'
import { ModalCloseButton, ModalHeader, ModalTitle, ModalDescription } from '@/libs/ui/components/modal'
import { Select, SelectValue } from '@/libs/ui/components/select'
import { Iconify } from '@/libs/ui/components/icons'
import { Alert, AlertTitle } from '@/libs/ui/components/alert'
import { RichSelectContent, RichSelectItem, RichSelectTrigger } from '@/libs/ui/components/rich-select'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/libs/ui/components/tooltip'
import { useDepositSupportedChains } from '../_apis/use-supported-chains'
import { useDepositSupportedTokens } from '../_apis/use-supported-tokens'
import { useDepositAddress } from '../_apis/use-deposit-address'
import { useTokenChainSelection } from '../_hooks/use-deposit-state'
import { useSelectedDepositAccount } from '../_hooks/use-selected-account'
import { BNumber } from '@/libs/utils/number'

export const CryptoStep2 = ({ onBack }: { onBack: () => void }) => {
  const walletBalance = '153,568.00'

  // 使用 store 管理选中的代币和链
  const { selectedTokenSymbol, selectedChainId, setSelectedTokenSymbol, setSelectedChainId } = useTokenChainSelection()

  // 获取选中的账户
  const selectedAccount = useSelectedDepositAccount()

  // 获取所有链列表（包含每个链支持的代币）
  const { data: chains, isLoading: isLoadingChains } = useDepositSupportedChains()

  // 获取入金代币配置（用于获取代币图标）
  const { data: tokens } = useDepositSupportedTokens()

  // 获取充值地址
  const {
    data: depositAddressInfo,
    isLoading: isLoadingAddress,
    isError: isAddressError,
    refetch: refetchAddress
  } = useDepositAddress(selectedChainId, selectedAccount?.id || '')

  // 根据选中的链，从链的 supportedTokens 中获取可用代币列表
  const availableTokens = useMemo(() => {
    if (!selectedChainId || !chains) return []
    const selectedChain = chains.find((c) => c.chainId === selectedChainId)
    return selectedChain?.supportedTokens || []
  }, [selectedChainId, chains])

  // 初始化默认选择的链（第一个）
  useEffect(() => {
    if (chains && chains.length > 0 && !selectedChainId) {
      setSelectedChainId(chains[0].chainId)
    }
  }, [chains, selectedChainId, setSelectedChainId])

  // 初始化默认选择的代币（第一个）
  useEffect(() => {
    if (availableTokens.length > 0 && !selectedTokenSymbol) {
      setSelectedTokenSymbol(availableTokens[0].symbol)
    }
  }, [availableTokens, selectedTokenSymbol, setSelectedTokenSymbol])

  // 当选择的链改变时，检查当前代币是否支持，不支持则选择第一个
  useEffect(() => {
    if (selectedChainId && availableTokens.length > 0) {
      const isTokenSupported = availableTokens.some((t) => t.symbol === selectedTokenSymbol)
      if (!isTokenSupported) {
        setSelectedTokenSymbol(availableTokens[0].symbol)
      }
    }
  }, [selectedChainId, selectedTokenSymbol, availableTokens, setSelectedTokenSymbol])

  // 从入金代币配置中获取代币图标 URL
  const getTokenIconUrl = (symbol: string) => {
    const tokenConfig = tokens?.find((t) => t.symbol === symbol)
    return tokenConfig?.iconUrl
  }

  // 获取充值地址
  const address = depositAddressInfo?.address

  // 从 supportedTokens 中找到当前选中币种的 minDeposit
  const selectedTokenInfo = depositAddressInfo?.supportedTokens?.find((token) => token.symbol === selectedTokenSymbol)
  const minDeposit = selectedTokenInfo?.minDeposit ? `${selectedTokenInfo.minDeposit} ${selectedTokenInfo.symbol}` : '0.05 ETH'

  const handleCopy = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      toast.success(<Trans>复制成功</Trans>)
    }
  }

  const handleRetry = () => {
    refetchAddress()
  }

  return (
    <>
      <ModalHeader className="w-full gap-2xl">
        <ModalTitle className="flex items-center justify-between w-full" showCloseButton={false}>
          <IconButton variant="ghost" className="text-brand-secondary-2" size={'icon-sm'} onClick={onBack}>
            <Iconify icon="iconoir:nav-arrow-left" className="size-6" />
          </IconButton>
          <Trans>加密货币入金</Trans>
          <ModalCloseButton iconClassName="size-6" />
        </ModalTitle>

        <ModalDescription>
          <Trans>
            钱包余额：
            {BNumber.toFormatNumber(selectedAccount?.money, {
              unit: selectedAccount?.currencyUnit,
              volScale: selectedAccount?.currencyDecimal
            })}
          </Trans>
        </ModalDescription>
      </ModalHeader>

      <div className="flex flex-col flex-1 gap-2xl px-1">
        {/* Network Selector */}
        <div className="flex flex-col relative">
          <Select value={selectedChainId} onValueChange={setSelectedChainId}>
            <RichSelectTrigger label={<Trans>选择网络</Trans>} className="w-full h-11">
              <SelectValue>
                {selectedChainId && chains ? (
                  <div className="flex items-center gap-medium">
                    {chains.find((c) => c.chainId === selectedChainId)?.iconUrl && (
                      <img
                        src={chains.find((c) => c.chainId === selectedChainId)?.iconUrl}
                        alt={selectedChainId}
                        className="w-4 h-4 rounded-full object-contain"
                      />
                    )}
                    <span className="text-paragraph-p2">
                      {chains.find((c) => c.chainId === selectedChainId)?.displayName || selectedChainId}
                    </span>
                  </div>
                ) : (
                  <span className="text-paragraph-p2 text-content-4">
                    <Trans>选择网络</Trans>
                  </span>
                )}
              </SelectValue>
            </RichSelectTrigger>
            <RichSelectContent position="popper">
              {chains?.map((chain) => (
                <RichSelectItem key={chain.chainId} value={chain.chainId} className="p-xl">
                  <div className="flex items-center gap-medium">
                    {chain.iconUrl && <img src={chain.iconUrl} alt={chain.displayName} className="w-6 h-6 rounded-full object-contain" />}
                    <span className="text-paragraph-p2">{chain.displayName}</span>
                  </div>
                </RichSelectItem>
              ))}
            </RichSelectContent>
          </Select>
        </div>

        {/* Token Selector */}
        <div className="flex flex-col relative">
          <Select value={selectedTokenSymbol} onValueChange={setSelectedTokenSymbol}>
            <RichSelectTrigger label={<Trans>选择币种</Trans>} className="w-full h-11">
              <SelectValue>
                {selectedTokenSymbol ? (
                  <div className="flex items-center gap-medium">
                    {getTokenIconUrl(selectedTokenSymbol) && (
                      <img
                        src={getTokenIconUrl(selectedTokenSymbol)}
                        alt={selectedTokenSymbol}
                        className="w-4 h-4 rounded-full object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    )}
                    <span className="text-paragraph-p2">{selectedTokenSymbol}</span>
                  </div>
                ) : (
                  <span className="text-paragraph-p2 text-content-4">
                    <Trans>选择币种</Trans>
                  </span>
                )}
              </SelectValue>
            </RichSelectTrigger>
            <RichSelectContent position="popper">
              {availableTokens.map((token) => {
                const tokenIconUrl = getTokenIconUrl(token.symbol)
                return (
                  <RichSelectItem key={token.symbol} value={token.symbol} className="p-xl">
                    <div className="flex items-center gap-medium">
                      {tokenIconUrl && (
                        <img
                          src={tokenIconUrl}
                          alt={token.symbol}
                          className="w-6 h-6 rounded-full object-contain bg-white"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      )}
                      <span className="text-paragraph-p2">{token.symbol}</span>
                    </div>
                  </RichSelectItem>
                )
              })}
            </RichSelectContent>
          </Select>
        </div>

        {/* Deposit Address */}
        <div className="flex flex-col gap-medium">
          <div className="text-paragraph-p3 text-content-4">
            <Trans>存款地址</Trans>
          </div>

          {/* QR Code 区域 - 固定高度，状态叠加显示 */}
          <div className="h-[140px] flex items-center justify-center relative">
            {isLoadingAddress && (
              <div className="flex flex-col items-center gap-small absolute z-10">
                <div className="animate-spin">
                  <Iconify icon="iconoir:refresh" className="size-4 text-content-4" />
                </div>
                <div className="text-paragraph-p3 text-content-4">
                  <Trans>加载地址中...</Trans>
                </div>
              </div>
            )}

            {isAddressError && !isLoadingAddress && (
              <div className="flex flex-col items-center gap-small absolute z-10">
                <div className="text-paragraph-p3 text-content-4">
                  <Trans>加载失败</Trans>
                </div>
                <Button size="sm" onClick={handleRetry}>
                  <Iconify icon="iconoir:refresh" className="size-3" />
                  <Trans>重试</Trans>
                </Button>
              </div>
            )}

            {address && !isLoadingAddress && (
              <div className="p-2 bg-white rounded-medium">
                <QRCodeSVG value={address} size={120} level="M" includeMargin={false} />
              </div>
            )}

            {!address && !isLoadingAddress && !isAddressError && (
              <div className="text-paragraph-p3 text-content-4">
                <Trans>请选择网络</Trans>
              </div>
            )}
          </div>

          {/* 地址显示 + 复制 */}
          {address && (
            <div className="group w-full flex items-center gap-2xl p-2xl bg-pop-up-mask rounded-small">
              <div className="text-paragraph-p3 text-content-1 break-all line-clamp-2 flex-1">{address}</div>
              <Tooltip>
                <TooltipTrigger>
                  <IconButton variant="ghost" size="icon-sm" onClick={handleCopy}>
                    <Iconify icon="iconoir:copy" className="size-4 text-brand-special" />
                  </IconButton>
                </TooltipTrigger>
                <TooltipContent>
                  <Trans>点击复制</Trans>
                </TooltipContent>
              </Tooltip>
            </div>
          )}
        </div>

        {/* 注意事项 */}
        {address && (
          <>
            {/* Warning Alert */}
            <Alert>
              <Iconify icon="iconoir:chat-bubble-warning" className="size-4" />
              <AlertTitle>
                <Trans>Mullet只支持Solana链的USDC，转入非Solana链USDC资产Mullet会进行跨链桥交易/Swap交易;</Trans>
              </AlertTitle>
            </Alert>

            {/* Deposit Steps */}
            <div className="text-paragraph-p3 text-content-4 space-y-xs">
              <div>
                1.
                <Trans>
                  最低充值{minDeposit}，低于{minDeposit}不上账;(可累计充值≥{minDeposit})
                </Trans>
              </div>
              <div>
                2.
                <Trans>
                  请勿转入{depositAddressInfo?.displayName}
                  网络下不支持的币种，不支持的币种充值到该地址一律销毁处理;详情可查看对应网络支持的币种
                </Trans>
              </div>
              <div>
                3. <Trans>跨链桥服务由多个桥服务商提供，Mullet会采用最优报价交易</Trans>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )
}
