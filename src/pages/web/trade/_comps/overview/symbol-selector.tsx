'use client'

import * as React from 'react'
import { useState } from 'react'

import { observer } from 'mobx-react'
import { Button } from '@/libs/ui/components/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/libs/ui/components/hover-card'
import { Iconify, IconNavArrowDown } from '@/libs/ui/components/icons'
import { Input } from '@/libs/ui/components/input'
import { cn } from '@/libs/ui/lib/utils'
import { Tabs, TabsList, TabsTrigger } from '@/libs/ui/components/tabs'
import { SYMBOL_CATEGORY_OPTIONS, SYMBOL_FILTER_MODE_OPTIONS, SymbolCategory, SymbolFilterMode } from '../../_options/symbol'
import { useStores } from '@/context/mobxProvider'
import SymbolIcon from '@/components/Base/SymbolIcon'
import { symbolColumns } from './symbol-selector-columns'
import { useSwitchSymbol } from '@/pages/webapp/hooks/useSwitchSymbol'
import { EmptyNoData } from '@/components/empty/no-data'

export const SymbolSelector = observer(() => {
  const [searchContent, setSearchContent] = React.useState<string>('')
  // const [activeSymbolCategory, setActiveSymbolCategory] = useQueryState(
  //   'symbol-category',
  //   parseAsStringEnum<SymbolCategory>(Object.values(SymbolCategory)).withDefault(SymbolCategory.All),
  // )
  const [activeSymbolCategory, setActiveSymbolCategory] = useState(SymbolCategory.All)

  // const [symbolFilterMode, setSymbolFilterMode] = useQueryState(
  //   'symbol-filter-mode',
  //   parseAsStringEnum<SymbolFilterMode>(Object.values(SymbolFilterMode)).withDefault(SymbolFilterMode.All),
  // )
  const { switchSymbol } = useSwitchSymbol()
  const { trade } = useStores()
  const activeSymbolInfo = trade.activeSymbolInfo

  const [symbolFilterMode, setSymbolFilterMode] = useState(SymbolFilterMode.All)

  const symbolListByFilterMode = symbolFilterMode === SymbolFilterMode.Favorite ? trade.favoriteList : trade.symbolListAll
  const symbolListByCategory =
    activeSymbolCategory === SymbolCategory.All
      ? symbolListByFilterMode
      : symbolListByFilterMode.filter((item) => item.classify === activeSymbolCategory)
  const renderSymbolList = !searchContent
    ? symbolListByCategory
    : symbolListByCategory.filter((item) => item.symbol.toLowerCase().includes(searchContent.toLowerCase()))

  return (
    <HoverCard
      openDelay={100}
      // open={true}
    >
      <HoverCardTrigger asChild>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <SymbolIcon src={activeSymbolInfo?.imgUrl} width={24} height={24} className="size-6 rounded-full" />

            <div className="text-button-2 text-white">{activeSymbolInfo?.alias}</div>
          </div>

          <div>
            <IconNavArrowDown />
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent
        sideOffset={22}
        alignOffset={-12}
        className="flex w-[var(--radix-hover-card-content-available-width)] max-w-[1048px] min-w-[480px] flex-col gap-1.5"
      >
        <div className="flex items-center gap-6">
          <Input
            className="w-full max-w-[300px]"
            LeftContent={<Iconify icon={'iconoir:search'} className="size-5" />}
            placeholder="搜索"
            value={searchContent}
            onValueChange={(value) => setSearchContent(value)}
            size="sm"
          />

          <div className="flex items-center gap-2">
            <Tabs value={symbolFilterMode} onValueChange={setSymbolFilterMode} variant={'solid'}>
              <TabsList className="gap-medium">
                {SYMBOL_FILTER_MODE_OPTIONS.map((option) => {
                  return (
                    <TabsTrigger value={option.value} key={option.value}>
                      {option.label}
                    </TabsTrigger>
                  )
                })}
              </TabsList>
            </Tabs>
          </div>
        </div>

        <Tabs value={activeSymbolCategory} className="flex flex-col gap-1.5" onValueChange={setActiveSymbolCategory}>
          <TabsList>
            {SYMBOL_CATEGORY_OPTIONS.map((category) => {
              return (
                <TabsTrigger value={category.value} key={category.value}>
                  {category.label}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </Tabs>

        <div className="">
          <div className="flex gap-6 px-6 py-2">
            {symbolColumns.map((column) => {
              return (
                <div key={column.key} className="text-paragraph-p3 text-content-5 flex flex-1 items-center">
                  {column.header}
                </div>
              )
            })}
          </div>

          <div className="max-h-[400px] overflow-y-auto">
            {!renderSymbolList?.length ? (
              <div className="py-3xl">
                <EmptyNoData />
              </div>
            ) : (
              renderSymbolList?.map((symbolItem) => {
                return (
                  <div
                    key={symbolItem.symbol}
                    className={cn('flex gap-6 px-6 py-2', 'hover:bg-[#ccc]/10', {
                      'bg-[#ccc]/10': symbolItem.symbol === activeSymbolInfo?.symbol
                    })}
                    onClick={() => {
                      switchSymbol(symbolItem.symbol)
                    }}
                  >
                    {symbolColumns.map((column) => {
                      return (
                        <div key={column.key} className="text-paragraph-p2 text-content-1 flex flex-1 items-center">
                          {column.cell(symbolItem)}
                        </div>
                      )
                    })}
                  </div>
                )
              })
            )}
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
})
