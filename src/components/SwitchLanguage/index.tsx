import { useEmotionCss } from '@ant-design/use-emotion-css'
import { getAllLocales } from '@umijs/max'
import { Dropdown } from 'antd'
import classNames from 'classnames'

import { LanguageMap } from '@/constants/enum'
import { useLang } from '@/context/languageProvider'

import { HeaderTheme } from '../Admin/Header/types'
import Iconfont from '../Base/Iconfont'

const inlineStyle = {
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  verticalAlign: 'middle'
}

type IProps = {
  /**管理端 */
  isAdmin?: boolean
  /**交易页面 */
  isTrade?: boolean
  /**主题 */
  theme?: HeaderTheme
}

export default function SwitchLanguage({ isAdmin = true, isTrade = false, theme = 'black' }: IProps) {
  const { lng, setLng } = useLang()
  const languages = getAllLocales()
  const pickerOptions = languages.map((v: any) => ({ value: v, label: LanguageMap[v]?.label || 'English' }))

  const langMenu = {
    selectedKeys: [lng],
    onClick: ({ key }: any) => setLng(key),
    items: languages.map((key: any) => {
      const localeObj = LanguageMap[key]
      return {
        key,
        style: { minWidth: '160px', color: 'var(--color-text-primary)' },
        label: (
          <>
            <span role="img" style={{ marginRight: '8px' }}>
              {localeObj?.icon || '🌐'}
            </span>
            {localeObj?.label || 'en-US'}
          </>
        )
      }
    })
  }

  const className = useEmotionCss(({ token }) => {
    return {
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      verticalAlign: 'middle',
      borderRadius: 8,
      padding: '2px 4px 2px 0',
      '&:hover': {
        backgroundColor: theme === 'black' ? '#fbfbfb' : '#222222'
      }
    }
  })

  return (
    <>
      <div className="flex justify-center rounded-lg h-9 px-1">
        <Dropdown menu={langMenu} placement="bottomRight">
          <span className={classNames(className, isTrade ? 'dark:!bg-gray-700 bg-gray-120' : '')}>
            <Iconfont name="lng" width={36} height={36} color={theme} className="cursor-pointer rounded-lg" />
            <span
              style={{
                color: theme
              }}
              className="flex items-center"
            >
              {isAdmin && (
                <>
                  &nbsp;{LanguageMap[lng]?.label || 'EN'}&nbsp;
                  <Iconfont name="down" width={24} height={24} color={theme} />
                </>
              )}
            </span>
          </span>
        </Dropdown>
      </div>
      {/* <SwitchPcOrWapLayout
      pcComponent={
        <div className="flex justify-center bg-gray-120 rounded-lg h-9 px-1">
          <Dropdown menu={langMenu} placement="bottomRight">
            <span style={inlineStyle}>
              <img src="/img/lang_icon.png" width={30} height={30} />
              {isAdmin && (
                <>
                  &nbsp;{LanguageMap[lng]?.label || 'EN'}&nbsp;
                  <SelectSuffixIcon opacity={0.6} style={{ width: 24 }} />
                </>
              )}
            </span>
          </Dropdown>
        </div>
      }
      wapComponent={
        <Picker
          allowClear={false}
          options={pickerOptions}
          style={{ paddingLeft: 10, paddingRight: 10, width: 140 }}
          value={[lng]}
          onConfirm={(value, option) => {
            setLng(value?.[0])
          }}
          renderLabel={(item) => {
            const localeObj = LanguageMap[item.value]
            return (
              <div className="flex items-center">
                <span className="w-[20px] h-[20px]">{localeObj.icon || '🌐'}</span>
                <span className="text-sub pl-1">{item.label}</span>
              </div>
            )
          }}
          renderSelectItem={({ items, selectedLabel, selectedValue }) => {
            const localeObj = LanguageMap[selectedValue as string]
            return (
              <div className="flex items-center">
                <span className="w-[20px] h-[20px]">{localeObj.icon || '🌐'}</span>
                <span className="text-sub pl-1">{selectedLabel}</span>
              </div>
            )
          }}
        />
      }
    /> */}
    </>
  )
}
