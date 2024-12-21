import { useTheme } from '@/context/themeProvider'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'

const SimpleTooltip = ({ children, content, setVisible, index, visible }: any) => {
  const { cn, theme } = useTheme()

  const handlePress = () => {
    setVisible(index)
  }

  return (
    <View className="relative">
      {visible && (
        <View
          style={{
            backgroundColor: theme.colors.backgroundColor.reverse,
            position: 'absolute',
            width: 180,
            bottom: 30,
            right: 5,
            transform: 'translateX(150px)',
            padding: 6,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            textAlign: 'center',
            borderRadius: 5,
            zIndex: 10
          }}
        >
          <Text style={{ color: theme.colors.textColor.reverse }}>{content}</Text>
          <View
            style={{
              borderTopColor: theme.colors.backgroundColor.reverse,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderStyle: 'solid',
              borderLeftWidth: 10,
              borderRightWidth: 10,
              borderTopWidth: 10,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              transform: 'translateY(10px)',
              position: 'absolute',
              bottom: 0,
              left: '10%',
              zIndex: 1
            }}
          />
        </View>
      )}
      <View onClick={handlePress}>{children}</View>
    </View>
  )
}

export default SimpleTooltip
