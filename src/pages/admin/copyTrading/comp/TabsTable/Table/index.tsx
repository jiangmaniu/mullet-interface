import './style.less'

import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'

import { useTheme } from '@/context/themeProvider'
import { cn } from '@/utils/cn'

type IProps = {
  columns: ColumnsType
  datas: any[]
  loading?: boolean
}

const TabTable = ({ columns, datas, loading }: IProps) => {
  const themeConfig = useTheme()
  const themeMode = themeConfig.theme
  const isDark = themeMode === 'dark'

  const classNameWrapper = useEmotionCss(
    // @ts-ignore
    () => {
      return {
        // 表格圆角
        '.ant-table-content': {
          '&::-webkit-scrollbar-thumb': {
            borderRadius: 5,
            backgroundColor: `${isDark ? '#17171c' : '#f7f7f7'} !important`
          },
          '&::-webkit-scrollbar-track': {
            boxShadow: 0,
            borderRadius: 0,
            background: `${isDark ? '#17171c' : '#fff'}  !important`
          },
          '&::-webkit-scrollbar-thumb:hover': {
            background: 'rgba(0, 0, 0, 0.4) !important',
            borderRadius: 5,
            boxShadow: 'inset 0 0 5px rgba(239, 239, 239, 1)'
          }
        }
      }
    }
  )

  const darkClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-table-thead > tr > th': {
        background: 'var(--bg-primary) !important',
        borderBottom: '1px solid var(--divider-line-color) !important'
      },
      'tr > td': {
        background: 'var(--bg-primary) !important',
        borderBottom: '1px solid var(--divider-line-color) !important'
      }
    }
  })

  return <Table className={cn(classNameWrapper, darkClassName)} columns={columns} dataSource={datas} pagination={false} loading={loading} />
}

export default TabTable
