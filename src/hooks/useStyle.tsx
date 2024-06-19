import { useEmotionCss } from '@ant-design/use-emotion-css'

export default function useStyle() {
  const recordListClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-table-thead > tr > th': {
        fontSize: '12px !important',
        color: 'var(--color-text-weak) !important',
        background: '#fff !important'
      }
    }
  })
  return {
    recordListClassName
  }
}
