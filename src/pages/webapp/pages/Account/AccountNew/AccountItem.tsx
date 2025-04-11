import { useTheme } from '@/context/themeProvider'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { getAccountSynopsisByLng } from '@/utils/business'

const AccountItem = ({
  width,
  height,
  item,
  active,
  onPress
}: {
  width: number
  height: number
  item: AccountGroup.AccountGroupItem
  active: boolean
  onPress: (item: AccountGroup.AccountGroupItem) => void
}) => {
  const { cn } = useTheme()
  const synopsis = getAccountSynopsisByLng(item?.synopsis)

  return (
    <View onPress={() => onPress(item)} className={cn(`flex-1 w-[${width}px] h-full h-[${height}px] `)}>
      <View
        borderColor={active ? 'active' : 'weak'}
        bgColor="secondary"
        className={cn('flex-1 flex flex-col border overflow-hidden rounded-2xl h-[350px]')}
      >
        <View className={cn(' px-5 py-[19px] flex flex-col items-start justify-start')}>
          <Text size="lg" weight="bold" color="primary">
            {synopsis.name || item.groupName}
          </Text>
          <Text size="sm" weight="normal" color="weak" style={{ marginBottom: 10 }}>
            {synopsis?.remark}
          </Text>

          <View className={cn('flex flex-row items-center justify-between gap-2')}>
            <View
              className={cn(
                'flex h-5 min-w-[42px] items-center justify-center rounded px-1 text-xs font-normal ',
                item.isSimulate ? 'bg-green' : 'bg-brand'
              )}
            >
              <Text color="white">{synopsis?.tag}</Text>
            </View>
            {synopsis?.abbr && (
              <View style={cn(' flex h-5 min-w-[42px] items-center px-1 justify-center rounded bg-black text-xs font-normal')}>
                <Text color="white">{synopsis?.abbr}</Text>
              </View>
            )}
          </View>
        </View>

        <View
          bgColor="primary"
          className={cn('w-full flex-1 flex-grow py-[24px] px-5 flex flex-col justify-between items-start rounded-b-2xl relative')}
        >
          <View className={cn('flex flex-row flex-wrap w-full gap-y-4')}>
            {(synopsis?.list || []).slice(0, 3).map((v, index) => (
              <View className={cn('flex flex-col items-start w-1/2 ')} key={index}>
                <Text size="sm" color="weak">
                  {v.title}
                </Text>
                <Text size="sm" weight="medium" color="primary">
                  {v.content}
                </Text>
              </View>
            ))}
          </View>

          {/* 右下角放图片 account-selected */}
          <img
            src={'/img/webapp/account-selected.png'}
            className={cn(
              {
                display: active ? 'flex' : 'none'
              },
              'w-[62px] h-[68px] absolute right-0 -bottom-1'
            )}
          />
        </View>
      </View>
    </View>
  )
}

export default AccountItem
