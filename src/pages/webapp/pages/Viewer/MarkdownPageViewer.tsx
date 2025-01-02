import Iconfont from '@/components/Base/Iconfont'
import MarkdownViewer from '@/components/Base/Viewer/MarkdownViewer'
import { useTheme } from '@/context/themeProvider'
import { useLocation } from '@umijs/max'
import Header from '../../components/Base/Header'
import Basiclayout from '../../layouts/BasicLayout'

export default function MarkdownPageViewer() {
  const location = useLocation()
  const { theme } = useTheme()
  const params = new URLSearchParams(location.search)
  const title = params?.get('title')
  const markdownFilePath = params?.get('markdownFilePath') || ''

  return (
    <Basiclayout
      // scrollY
      fixedHeight
      style={{ paddingTop: 20, paddingLeft: 14, paddingRight: 14 }}
      headerStyle={{
        backgroundColor: theme.colors.backgroundColor.primary
      }}
      header={
        title ? (
          <Header
            title={title}
            style={{
              zIndex: 100,
              paddingLeft: 14,
              paddingRight: 14
            }}
            right={
              <Iconfont
                name="cangwei-monirujin"
                size={28}
                color={theme.colors.textColor.primary}
                onClick={() => {
                  window.open(markdownFilePath, '_blank')
                }}
              />
            }
          />
        ) : null
      }
    >
      <div className="py-8">{markdownFilePath && <MarkdownViewer markdownFilePath={markdownFilePath} />}</div>
    </Basiclayout>
  )
}
