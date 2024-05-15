import { FormattedMessage, useIntl, useModel } from '@umijs/max'
import { Button } from 'antd'
import { useState } from 'react'

import { useEnv } from '@/context/envProvider'
import { handleDownloadReport } from '@/utils/download'

type IProps = {
  onClick?: () => Promise<any> | void
  style?: React.CSSProperties
}
export default function Export({ onClick, style }: IProps) {
  const [loading, setLoading] = useState(false)
  const { hasProList } = useModel('global')
  const intl = useIntl()
  const { isMobileOrIpad } = useEnv()

  if (isMobileOrIpad && !hasProList) {
    return null
  }

  // 暂时隐藏导出按钮
  // return null
  return (
    <Button
      icon={<img src="/img/icons/export.png" className="w-[20px] h-[20px] relative" />}
      onClick={async () => {
        try {
          // 导出loading，统一处理
          setLoading(true)
          const res = await onClick?.()
          const info = res?.result?.content
          if (info?.IsSuccess) {
            const url = (info?.Data as string).replace('./', '/')

            handleDownloadReport(url)
          }
        } finally {
          setLoading(false)
        }
      }}
      loading={loading}
      style={{ width: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}
      className="export-btn"
    >
      <FormattedMessage id="common.export" />
    </Button>
  )
}
