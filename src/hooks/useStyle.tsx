import { useEmotionCss } from '@ant-design/use-emotion-css'

const useStyle = () => {
  // input addon + select 下拉样式
  const addonFormItemClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-input': {
        border: 'none !important'
      },
      '.ant-input:hover': {
        borderColor: '#fff !important'
      },
      '.ant-input-group-addon': {
        border: 'none !important',
        background: '#fff !important',
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          left: 0,
          top: '50%',
          width: 1,
          height: 12,
          background: '#d9d9d9',
          transform: 'translateY(-50%)'
        }
      },
      '.ant-input-group-wrapper': {
        border: '1px solid #d9d9d9',
        borderRadius: 7
      },
      '.ant-input-group-wrapper:hover': {
        borderColor: '#9C9C9C'
      },
      '.ant-input:focus-within,.ant-input-affix-wrapper:focus-within': {
        boxShadow: 'none !important'
      },
      '.ant-input-affix-wrapper': {
        border: 'none !important'
      }
    }
  })

  // 点差模式输入框样式
  const spreadAddonClassName = useEmotionCss(({ token }) => {
    return {
      '.ant-form-item-control > div:first-child': {
        border: '1px solid #d9d9d9',
        borderRadius: 7,
        '&:hover': {
          borderColor: '#9C9C9C'
        }
      },
      '.addonbefore-wrapper-child': {
        position: 'relative',
        '.ant-form-item-control': {
          border: 'none'
        },
        '.ant-form-item-control > div:first-child': {
          border: 'none'
        },
        '&::after': {
          position: 'absolute',
          top: '50%',
          left: '-12px',
          width: 1,
          height: 15,
          background: '#d9d9d9',
          content: "''",
          transform: 'translateY(-50%)'
        }
      },
      '.ant-input-affix-wrapper:focus-within': {
        border: 'none !important',
        boxShadow: 'none !important'
      }
    }
  })

  return {
    addonFormItemClassName,
    spreadAddonClassName
  }
}

export default useStyle
