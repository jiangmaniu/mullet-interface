import { useEmotionCss } from '@ant-design/use-emotion-css'
import { Tree, TreeProps } from 'antd'

type IProps = TreeProps

export default function TreeComp({ ...res }: IProps) {
  const rootClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-tree-checkbox-checked .ant-tree-checkbox-inner': {
        borderColor: 'var(--color-brand-primary) !important',
        background: 'var(--color-brand-primary) !important'
      },
      '.ant-tree-checkbox-inner:after': {
        background: 'var(--color-brand-primary) !important'
      }
    }
  })

  return (
    <div className="border border-gray-220 rounded-xl p-3 min-h-[230px] max-h-[400px] overflow-y-auto">
      <Tree rootClassName={rootClassName} {...res} />
    </div>
  )
}
