import { useIntl } from '@umijs/max'
import { PullToRefresh as PullToRefreshAntdMobile } from 'antd-mobile'
import { PullStatus } from 'antd-mobile/es/components/pull-to-refresh'

type PullToRefreshProps = {
  children: React.ReactNode
  onRefresh: () => Promise<void>
}

export const PullToRefresh = ({ children, onRefresh, ...props }: PullToRefreshProps) => {
  const intl = useIntl()

  const statusRecord: Record<PullStatus, string> = {
    pulling: intl.formatMessage({ id: 'common.Pulling' }),
    canRelease: intl.formatMessage({ id: 'common.CanRelease' }),
    refreshing: intl.formatMessage({ id: 'common.Refreshing' }),
    complete: intl.formatMessage({ id: 'common.Complete' })
  }

  return (
    <PullToRefreshAntdMobile
      onRefresh={async () => {
        // await sleep(1000)
        await onRefresh()
      }}
      renderText={(status) => {
        return <div>{statusRecord[status]}</div>
      }}
      {...props}
    >
      {children}
    </PullToRefreshAntdMobile>
  )
}
