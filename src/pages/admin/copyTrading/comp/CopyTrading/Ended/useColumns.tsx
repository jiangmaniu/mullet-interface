import { FormattedMessage } from '@umijs/max'

import { SOURCE_CURRENCY } from '@/constants'

import { IListItemNumber } from '../../ListItemNumber'

type Item = IListItemNumber & { label: React.ReactNode; align?: 'left' | 'right' }

export default (): Item[] => {
  return [
    {
      label: <FormattedMessage id="mt.gensuitianshu" />,
      field: 'followerDays',
      showSuffix: undefined,
      opt: {
        decimal: '0'
      }
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
          <FormattedMessage id="mt.yishixianyingkui" />({SOURCE_CURRENCY})
        </>
      ),
      field: 'profitLoss',
      showSuffix: undefined
    },
    {
      label: (
        <>
          <FormattedMessage id="mt.gensuikaishishijian" />
        </>
      ),
      field: 'followerStartTime',
      showSuffix: undefined
    },
    {
      label: (
        <>
          <FormattedMessage id="mt.gensuijieshushijian" />
        </>
      ),
      field: 'followerEndTime',
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
      showSuffix: undefined,
      align: 'right'
    }
  ]
}
