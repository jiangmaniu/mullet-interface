import { useIntl } from '@umijs/max'
import { SpinLoading } from 'antd-mobile'

export default function More() {
  const intl = useIntl()
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-[14px]">
      <SpinLoading style={{ '--size': '24px' }} />
      <span style={{ fontSize: 10, textAlign: 'center', paddingTop: 8 }}>{intl.formatMessage({ id: 'common.Loading' })}...</span>
    </div>
  )
}
