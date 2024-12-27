import Iconfont from '@/components/Base/Iconfont'
import { ILanguage, LanuageTransformMap } from '@/constants/enum'
import { useLang } from '@/context/languageProvider'
import { useStores } from '@/context/mobxProvider'
import { useTheme } from '@/context/themeProvider'
import { TextField } from '@/pages/webapp/components/Base/Form/TextField'
import Header from '@/pages/webapp/components/Base/Header'
import ListItem, { IlistItemProps } from '@/pages/webapp/components/Base/List/ListItem'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { setUserLanguage } from '@/services/api/user'
import { observer } from 'mobx-react'
import { useMemo, useState } from 'react'

export const LngList = ({ list }: { list: IlistItemProps[] }) => {
  const i18n = useI18n()
  const { global } = useStores()
  const { theme } = useTheme()
  const { setLng } = useLang()

  //   切换语言
  const handleChangeLanguage = async (item: IlistItemProps) => {
    if (item.value === i18n.locale) {
      return
    }
    // 调用接口设置语言保存到后台同步到不同终端
    await setUserLanguage({ language: item.value as ILanguage })
    setLng(item.value as ILanguage)
  }

  const renderList = (listData: IlistItemProps[]) => {
    return (
      <View style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        {listData.map((item: IlistItemProps, index: number) => {
          const isActive = i18n.locale === item.value
          item.renderExtraElement = () => {
            if (isActive) {
              return <Iconfont name="danchuang-xuanzhong" size={26} />
            }
            return <></>
          }

          // const icon = {
          //   'en-US': require('@/assets/images/en_icon.png'),
          //   'zh-TW': require('@/assets/images/ft_icon.png'),
          //   'vi-VN': require('@/assets/images/vn_icon.png')
          // }[item.value as string]
          const icon = {
            'en-US': '/images/en_icon.png',
            'zh-TW': '/images/ft_icon.png',
            'vi-VN': '/images/vn_icon.png'
          }[item.value as string]

          return (
            <ListItem
              styles={{
                container: {
                  borderWidth: 1,
                  borderColor: isActive ? theme.colors.textColor.primary : theme.colors.borderColor.weak,
                  borderRadius: 10
                }
              }}
              key={index}
              icon={<img src={icon} style={{ width: 22, height: 22, borderRadius: 2, marginRight: 8 }} />}
              {...item}
              first={!index}
              onPress={() => handleChangeLanguage(item)}
            />
          )
        })}
      </View>
    )
  }
  return <View>{renderList(list)}</View>
}

function Language() {
  const i18n = useI18n()

  const currentList = Object.keys(LanuageTransformMap).map((item) => {
    return {
      title: i18n.t(`common.language.${item}`),
      value: item
    }
  })

  const [searchValue, setSearchValue] = useState('')
  const filteredList = useMemo<IlistItemProps[]>(() => {
    if (!searchValue) return currentList

    return currentList.filter(
      (item) => item.title.toLowerCase().includes(searchValue.toLowerCase()) || item.value.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [searchValue, currentList])

  return (
    <BasicLayout bgColor="secondary" style={{ paddingLeft: 14, paddingRight: 14 }}>
      <Header
        title={i18n.t('app.pageTitle.Language')}
        // left={
        //   <View onPress={goBack}>
        //     <Iconfont name="fanhui" size={36} />
        //   </View>
        // }
      />
      <View style={{ marginTop: 10 }}>
        <TextField
          RightAccessory={({ style }) => (
            <View className={'mr-2'} style={style}>
              <Iconfont name="hangqing-sousuo" size={20} />
            </View>
          )}
          height={44}
          placeholder={i18n.t('common.operate.Search')}
          onChange={(text) => {
            setSearchValue(text)
          }}
          containerStyle={{ marginBottom: 14 }}
        />
      </View>
      <LngList list={filteredList} />
    </BasicLayout>
  )
}

export default observer(Language)
