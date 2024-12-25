import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
interface IProps {
  step: 1 | 2 | 3 // 步骤
}

const StepBox = (props: IProps) => {
  const i18n = useI18n()
  const { theme, cn } = useTheme()
  const { step = 1 } = props
  const stepData = [
    {
      key: 1,
      title: i18n.t('pages.userCenter.authenticationInfo'),
      img: null,
      step: 1,
      icon: (step: number) => (
        <View
          className={cn('w-[42px] h-[42px] rounded-full flex items-center justify-center border border-solid border-gray-300', {
            'bg-brand text-reverse': step >= 1
          })}
        >
          <Iconfont name="user" size={20} color={step >= 1 ? theme.colors.textColor.reverse : theme.colors.textColor.weak} />
        </View>
      )
    },
    { key: 2, step: 1, isLine: true },
    {
      key: 3,
      step: 2,
      title: i18n.t('pages.userCenter.certificateAuthentication'),
      icon: (step: number) => (
        <View
          className={cn('w-[42px] h-[42px] rounded-full flex items-center justify-center border border-solid border-gray-300', {
            'bg-brand text-reverse': step >= 2
          })}
        >
          <Iconfont name="idcard" size={20} color={step >= 2 ? theme.colors.textColor.reverse : theme.colors.textColor.weak} />
        </View>
      )
    }
    // { key: 4, step: 2, isLine: true },
    // {
    //   key: 5,
    //   step: 3,
    //   title: i18n.t('pages.userCenter.faceRecognition'),
    //   icon: (step: number) => (
    //     <View
    //       style={cn('w-[42px] h-[42px] rounded-full flex items-center justify-center border border-solid border-gray-300', {
    //         'bg-brand text-reverse': step >= 3
    //       })}
    //     >
    //       <Icon name="faceid" size={20} color={step >= 3 ? theme.colors.textColor.reverse : theme.colors.textColor.weak} />
    //     </View>
    //   )
    // }
  ]
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '0 48px',
        marginTop: 16
      }}
    >
      {stepData.map((item, idx: number) => {
        if (item.isLine) {
          return (
            <View
              key={item.key}
              style={{
                width: 20,
                height: 4,
                marginTop: 20,
                borderRadius: 2,
                backgroundColor: step > item.step ? theme.colors.textColor.brand : '#d1d5db'
              }}
            />
          )
        }
        return (
          <View key={item.key} style={{ alignItems: 'center' }}>
            {item.icon?.(step)}
            <Text
              style={{
                marginTop: 12,
                fontSize: 12,
                fontWeight: '500',
                color: step >= (item.step || 0) ? theme.colors.textColor.primary : theme.colors.textColor.weak
              }}
            >
              {item.title}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

export default StepBox
