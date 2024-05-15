import { useIntl } from '@umijs/max'
import { message, Typography } from 'antd'

type IProps = {
  children: string
  style?: React.CSSProperties
  textStyle?: React.CSSProperties
}

export default function CopyComp({ children, style, textStyle }: IProps) {
  const intl = useIntl()
  return (
    <Typography.Paragraph
      style={{ marginBottom: 0, display: 'flex', alignItems: 'baseline', ...style }}
      copyable={{
        icon: <img src="/img/icons/copy@2x.png" className="w-[18px] h-[18px] relative top-[3px]" />,
        onCopy: (event: any) => {
          message.success(intl.formatMessage({ id: 'common.copySuccess' }))
        },
        text: children
      }}
    >
      <span className="truncate inline-block" style={{ ...textStyle }}>
        {children}
      </span>
    </Typography.Paragraph>
  )
}
