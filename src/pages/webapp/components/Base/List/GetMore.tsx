import { useIntl } from '@umijs/max'

export default function GetMore({ onClick }: { onClick: () => void }) {
  const intl = useIntl()
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-[14px]" onClick={onClick}>
      <span style={{ fontSize: 10, textAlign: 'center', paddingTop: 8 }}>{intl.formatMessage({ id: 'mt.jiazaigengduo' })}</span>
    </div>
  )
}
