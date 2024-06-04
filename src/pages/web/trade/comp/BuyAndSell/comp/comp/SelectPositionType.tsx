import { ProFormSelect, ProFormSelectProps } from '@ant-design/pro-components'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { FormattedMessage } from '@umijs/max'
import classNames from 'classnames'

type IProps = ProFormSelectProps

// 全仓、逐仓选择
export default function SelectPositionType({ ...res }: IProps) {
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
          defaultValue: '1',
          suffixIcon: <img src="/img/arrow-right-icon.png" width={24} height={24} />
        }}
        allowClear={false}
        options={[
          {
            label: <FormattedMessage id="mt.quancang" />,
            value: '1'
          },
          {
            label: <FormattedMessage id="mt.zhucang" />,
            value: '2'
          }
        ]}
        {...res}
      />
    </div>
  )
}
