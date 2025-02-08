import { useIntl } from '@umijs/max'

export default function End() {
  const intl = useIntl()
  return (
    <div className="m-[10px] flex items-center justify-center">
      <span className="text-[#dadada] text-[11px]">{intl.formatMessage({ id: 'common.NO More Data' })}</span>
    </div>
  )
}
