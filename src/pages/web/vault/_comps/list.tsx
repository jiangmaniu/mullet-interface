import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/utils/cn'
import { useEmotionCss } from '@ant-design/use-emotion-css'
import { useDebounce } from 'ahooks'
import { createContext, useContext, useState } from 'react'
import { MyVaultTable } from './my-vault-table'
import { PopularVaultTable } from './popular-vault-table'

const VaultListContext = createContext<{
  searchParam: string
  debouncedSearchParam: string
  setSearchParam: (searchParam: string) => void
}>({
  searchParam: '',
  debouncedSearchParam: '',
  setSearchParam: () => {}
})

export const useVaultListContext = () => {
  const context = useContext(VaultListContext)
  if (!context) {
    throw new Error('useVaultListContext must be used within a VaultListProvider')
  }

  return context
}

export default function VaultList() {
  const listContainerClassName = useEmotionCss(() => {
    return {
      'border-radius': '10px',
      opacity: '1',
      background: '#0A0C27'
    }
  })

  const [searchParam, setSearchParam] = useState('')
  // 添加防抖，500ms 延迟
  const debouncedSearchParam = useDebounce(searchParam, { wait: 500 })

  return (
    <VaultListContext.Provider value={{ searchParam, debouncedSearchParam, setSearchParam }}>
      <div className={cn([listContainerClassName, ''])}>
        <div className="pt-5 px-[30px]">
          <SearchInputPanel />
        </div>

        <div className="mt-2.5">
          <VaultTabs />
        </div>
      </div>
    </VaultListContext.Provider>
  )
}

function SearchInputPanel() {
  const { searchParam, setSearchParam } = useVaultListContext()

  return (
    <>
      <Input
        className="py-[9px] px-[10px] w-[400px]"
        inputClassName="leading-none"
        LeftContent={<img src={'/img/new/icons/search.webp'} alt="search" className="size-[13px]" />}
        placeholder="按金库地址、名称或创建者搜索..."
        value={searchParam}
        onValueChange={(v) => setSearchParam(v)}
      />
    </>
  )
}

function VaultTabs() {
  const tabTextClassName = useEmotionCss(() => {
    return {
      'font-family': 'HarmonyOS Sans SC',
      'font-size': '14px',
      'font-weight': 'normal',
      'line-height': 'normal',
      'text-align': 'center',
      'letter-spacing': '0em',
      'font-variation-settings': 'opsz auto',
      'font-feature-settings': 'kern on'
    }
  })

  const [activeTabValue, setActiveTabValue] = useState(1)

  return (
    <Tabs value={activeTabValue} onValueChange={setActiveTabValue}>
      <TabsList className="">
        {[
          {
            value: 1,
            label: '热门金库'
          },
          {
            value: 2,
            label: '我的金库'
          }
        ].map((item) => {
          return (
            <TabsTrigger key={item.value} value={item.value} className={tabTextClassName}>
              {item.label}
            </TabsTrigger>
          )
        })}
      </TabsList>
      <div className="mt-2.5">
        <TabsContent value={1}>
          <PopularVaultTable />
        </TabsContent>
        <TabsContent value={2}>
          <MyVaultTable />
        </TabsContent>
      </div>
    </Tabs>
  )
}
