import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage } from '@umijs/max'
import classNames from 'classnames'

import { useStores } from '@/context/mobxProvider'

type IProps = ProFormSelectProps & {
  onChange?: (value: API.MaiginType) => void
}

// 全仓、逐仓选择
export default function SelectPositionType({ fieldProps, onChange, ...res }: IProps) {
  const { trade } = useStores()
  const className = useEmotionCss(({ token }) => {
    return {
      '.ant-select-selection-item': {
        textAlign: 'center'
      },
      '.prefix-icon': {
        position: 'absolute',
        left: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 1
      }
    }
  })
  return (
    <div className={classNames('mb-3 relative', className)}>
      <div className="prefix-icon">
        <img src="/img/cangweixuanze.png" width={24} height={24} />
      </div>
      <ProFormSelect
        fieldProps={{
          size: 'large',
          defaultValue: 'CROSS_MARGIN',
          suffixIcon: <img src="/img/arrow-right-icon.png" width={24} height={24} />,
          onChange: (value) => {
            onChange?.(value)
            // 全局设置，方便tradeBox使用
            trade.setMarginType(value)
          },
          ...fieldProps
        }}
        allowClear={false}
        options={[
          {
            label: <FormattedMessage id="mt.quancang" />,
            value: 'CROSS_MARGIN'
          },
          {
            label: <FormattedMessage id="mt.zhucang" />,
            value: 'ISOLATED_MARGIN'
          }
        ]}
        {...res}
      />
    </div>
  )
}
