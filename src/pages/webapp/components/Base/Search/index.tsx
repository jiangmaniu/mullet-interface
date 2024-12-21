import Iconfont from '@/components/Base/Iconfont'
import { useTheme } from '@/context/themeProvider'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { TextField, TextFieldProps } from '../Form/TextField'
import { View } from '../View'

type IProps = TextFieldProps & {
  /** 搜索图标位置 */
  iconPosition?: 'left' | 'right'
}

export default function Search({ iconPosition = 'right', ...res }: IProps) {
  const { cn, theme } = useTheme()
  const { t } = useI18n()
  const isRight = iconPosition === 'right'

  const SearchIcon = (
    <View style={cn(isRight ? 'mr-2' : 'ml-2')}>
      <Iconfont name="hangqing-sousuo" size={24} />
    </View>
  )

  return (
    <TextField
      height={40}
      placeholder={t('common.operate.Input Keyword')}
      RightAccessory={() => <>{isRight && SearchIcon}</>}
      LeftAccessory={() => (
        <>
          <>{!isRight && SearchIcon}</>
        </>
      )}
      containerClassName={'mb-1'}
      {...res}
    />
  )
}
