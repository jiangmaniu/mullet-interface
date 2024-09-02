import { FormattedMessage } from '@umijs/max'

import { SOURCE_CURRENCY } from '@/constants'

import { IListItemNumber } from '../../ListItemNumber'

type Item = IListItemNumber & { label: React.ReactNode }

export default (): Item[] => {
  return [
    {
      label: (
        <>
          <FormattedMessage id="mt.zhanghuzongzichan" />({SOURCE_CURRENCY})
        </>
      ),
      field: 'followAmount',
      showSuffix: undefined
    },
    {
      label: (
        <>
          <FormattedMessage id="mt.jingyingkui" />({SOURCE_CURRENCY})
        </>
      ),
      field: 'netProfitAndLoss',
      color: true,
      fontWeight: 'font-dingpro-medium font-semibold',
      showSuffix: undefined
    },
    {
      label: (
        <>
          <FormattedMessage id="mt.weishixianyingkui" />({SOURCE_CURRENCY})
        </>
      ),
      field: 'rate3',
      fontWeight: 'font-dingpro-medium',
      showSuffix: undefined
    },
    {
      label: (
        <>
          <FormattedMessage id="mt.yishixianyingkui" />({SOURCE_CURRENCY})
        </>
      ),
      field: 'profitLoss',
      fontWeight: 'font-dingpro-medium',
      showSuffix: undefined
    },
    {
      label: (
        <>
          <FormattedMessage id="mt.fenrunjine" />({SOURCE_CURRENCY})
        </>
      ),
      field: 'profitSharingAmount',
      fontWeight: 'font-dingpro-medium',
      showSuffix: undefined
    }
  ]
}
