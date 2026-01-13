import { CopyOutlined } from '@ant-design/icons'
import { useIntl } from '@umijs/max'
import { Typography } from 'antd'
import { toast } from '@/libs/ui/components/toast'
import { Trans } from '@/libs/lingui/react/macro'

type IProps = {
  children: any
  style?: React.CSSProperties
  textStyle?: React.CSSProperties
}

export default function CopyComp({ children, style, textStyle }: IProps) {
  const intl = useIntl()
  return (
    <Typography.Paragraph
      style={{ marginBottom: 0, display: 'flex', alignItems: 'baseline', ...style }}
      copyable={{
        // icon: <img src="/img/icons/copy@2x.png" className="w-[18px] h-[18px] relative top-[3px]" />,
        icon: <CopyOutlined style={{ fontSize: 14, color: '#9E9E9E' }} />,
        onCopy: (event: any) => {
          toast.success(<Trans>复制成功</Trans>)
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
