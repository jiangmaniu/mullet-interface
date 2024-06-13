import { Request, Response } from 'express'

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'POST /api/blade-auth/oauth/token': async (req: Request, res: Response) => {
    await waitTime(1200)
    res.send({
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOiIwMDAwMDAiLCJ1c2VyX25hbWUiOiJhZG1pbiIsInJlYWxfbmFtZSI6IueuoeeQhuWRmCIsImF2YXRhciI6Imh0dHBzOi8vZ3cuYWxpcGF5b2JqZWN0cy5jb20vem9zL3Jtc3BvcnRhbC9CaWF6ZmFueG1hbU5Sb3h4VnhrYS5wbmciLCJhdXRob3JpdGllcyI6WyJzZW5pb3IiLCJhZG1pbmlzdHJhdG9yIiwiZGV2b3BzIl0sImNsaWVudF9pZCI6IlN0ZWxsdXhUcmFkZXIiLCJyb2xlX25hbWUiOiJhZG1pbmlzdHJhdG9yLHNlbmlvcixkZXZvcHMiLCJsaWNlbnNlIjoicG93ZXJlZCBieSBibGFkZXgiLCJwb3N0X2lkIjoiMTc5MjM3ODE0Nzc4NjcyNzQyNSIsInVzZXJfaWQiOiIxMTIzNTk4ODIxNzM4Njc1MjAxIiwicm9sZV9pZCI6IjExMjM1OTg4MTY3Mzg2NzUyMDEsMTc5MjM3NjQ2MDc1Mzc3MjU0NiwxNzkyMzc2OTEzODgxMjEwODgyIiwic2NvcGUiOlsiYWxsIl0sIm5pY2tfbmFtZSI6IueuoeeQhuWRmCIsIm9hdXRoX2lkIjoiIiwiZGV0YWlsIjp7InR5cGUiOiJ3ZWIifSwiZXhwIjoxNzE2NjM5MTAyLCJkZXB0X2lkIjoiMTEyMzU5ODgxMzczODY3NTIwMSIsImp0aSI6ImM1ZDAwOWMwLWI2ZGUtNDU3Yi05MDEzLTIzMGQ0ZDQ5ZmQzNSIsImFjY291bnQiOiJhZG1pbiJ9.CJbK55nE0a2TptAE0YJLHaOO_gcyMmN07XHFr3Xa43Y',
      token_type: 'bearer',
      refresh_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0ZW5hbnRfaWQiOiIwMDAwMDAiLCJ1c2VyX25hbWUiOiJhZG1pbiIsInJlYWxfbmFtZSI6IueuoeeQhuWRmCIsImF2YXRhciI6Imh0dHBzOi8vZ3cuYWxpcGF5b2JqZWN0cy5jb20vem9zL3Jtc3BvcnRhbC9CaWF6ZmFueG1hbU5Sb3h4VnhrYS5wbmciLCJhdXRob3JpdGllcyI6WyJzZW5pb3IiLCJhZG1pbmlzdHJhdG9yIiwiZGV2b3BzIl0sImNsaWVudF9pZCI6IlN0ZWxsdXhUcmFkZXIiLCJyb2xlX25hbWUiOiJhZG1pbmlzdHJhdG9yLHNlbmlvcixkZXZvcHMiLCJsaWNlbnNlIjoicG93ZXJlZCBieSBibGFkZXgiLCJwb3N0X2lkIjoiMTc5MjM3ODE0Nzc4NjcyNzQyNSIsInVzZXJfaWQiOiIxMTIzNTk4ODIxNzM4Njc1MjAxIiwicm9sZV9pZCI6IjExMjM1OTg4MTY3Mzg2NzUyMDEsMTc5MjM3NjQ2MDc1Mzc3MjU0NiwxNzkyMzc2OTEzODgxMjEwODgyIiwic2NvcGUiOlsiYWxsIl0sIm5pY2tfbmFtZSI6IueuoeeQhuWRmCIsImF0aSI6ImM1ZDAwOWMwLWI2ZGUtNDU3Yi05MDEzLTIzMGQ0ZDQ5ZmQzNSIsIm9hdXRoX2lkIjoiIiwiZGV0YWlsIjp7InR5cGUiOiJ3ZWIifSwiZXhwIjoxNzE3MjQwMzAyLCJkZXB0X2lkIjoiMTEyMzU5ODgxMzczODY3NTIwMSIsImp0aSI6IjhjZjBkNzViLTNlNzEtNDFkNy05ZmQxLTUxYTNhMjdlMjg3ZCIsImFjY291bnQiOiJhZG1pbiJ9.isVtRDzhA5j0WkY6fRGm6FKrSPq6IET9vfWp8ctOD4Q',
      expires_in: 3599,
      scope: 'all',
      tenant_id: '000000',
      user_name: 'admin',
      real_name: '管理员',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      client_id: 'StelluxTrader',
      role_name: 'administrator,senior,devops',
      license: 'powered by bladex',
      post_id: '1792378147786727425',
      user_id: '1123598821738675201',
      role_id: '1123598816738675201,1792376460753772546,1792376913881210882',
      nick_name: '管理员',
      oauth_id: '',
      detail: {
        type: 'web'
      },
      dept_id: '1123598813738675201',
      account: 'admin',
      jti: 'c5d009c0-b6de-457b-9013-230d4d49fd35'
    })
  },
  '/api/trade-core/coreApi/account/tradeSymbolList': async (req: Request, res: Response) => {
    res.send({
      code: 200,
      success: true,
      data: [
        {
          id: '1787377389865578498',
          symbol: 'ethusdt',
          alias: '以太坊',
          symbolGroupId: '1782990731468640257',
          symbolConfId: '1787377389832024065',
          dataSourceCode: 'huobi',
          dataSourceSymbol: 'ethusdt',
          symbolDecimal: 2,
          imgUrl: '无',
          status: 'ENABLE',
          remark: '备注1',
          isDeleted: false,
          symbolConf: {
            id: '1787377389832024065',
            depthOfMarket: 0,
            spreadConf: '{}',
            baseCurrency: 'USD',
            baseCurrencyDecimal: 2,
            profitCurrency: 'USD',
            profitCurrencyDecimal: 2,
            prepaymentCurrency: 'USD',
            prepaymentCurrencyDecimal: 2,
            contractSize: 10000,
            calculationType: 'FOREIGN_CURRENCY',
            tradeLicense: 'ENABLE',
            orderType: '10,20,30,40,50,60,70',
            quotationSize: null,
            gtc: 'DAY_VALID',
            limitStopLevel: 5,
            quotationDelay: 5,
            minTrade: '0.01000000',
            maxTrade: '20.00000000',
            tradeStep: '0.01000000',
            tradeLimit: '0.01000000',
            nominalValue: '0.01000000',
            prepaymentConf:
              '{"mode":"fixed_margin","fixed_margin":{"initial_margin":1000,"locked_position_margin":500,"is_unilateral":true,},"fixed_leverage":{"is_unilateral":true,"leverage_multiple":100},"float_leverage":[{"nominal_value":1000,"leverage_multiple":100},{"nominal_value":5000,"leverage_multiple":10},{"nominal_value":10000,"leverage_multiple":1}]}',
            enableHoldingCost: false,
            holdingCostConf: '{}',
            tradeTimeConf:
              '{"MONDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"TUESDAY":{"isAlone":false,"trade":[{"start":0,"end":915}],"price":[{"start":0,"end":915}]},"WEDNESDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"THURSDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"FRIDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"SATURDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"SUNDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]}}',
            quotationConf: '{}',
            transactionFeeConf: '{}'
          },
          symbolNewTicker: {
            dataSourceCode: 'huobi',
            symbol: 'ethusdt',
            open: '3844.4',
            close: '3812.74',
            low: '3761.21',
            high: '3854.96'
          }
        },
        {
          id: '1787377482404507649',
          symbol: 'btcusdt',
          alias: '比特币',
          symbolGroupId: '1782990731468640257',
          symbolConfId: '1787377482316427265',
          dataSourceCode: 'huobi',
          dataSourceSymbol: 'btcusdt',
          symbolDecimal: 2,
          imgUrl: '无',
          status: 'ENABLE',
          remark: '备注1',
          isDeleted: false,
          symbolConf: {
            id: null,
            depthOfMarket: 0,
            spreadConf: '{}',
            baseCurrency: 'USD',
            baseCurrencyDecimal: 2,
            profitCurrency: 'USD',
            profitCurrencyDecimal: 2,
            prepaymentCurrency: 'USD',
            prepaymentCurrencyDecimal: 2,
            contractSize: 1,
            calculationType: 'FOREIGN_CURRENCY',
            tradeLicense: 'ENABLE',
            orderType: '10',
            quotationSize: null,
            gtc: 'DAY_VALID',
            limitStopLevel: 5,
            quotationDelay: 5,
            minTrade: '0.01000000',
            maxTrade: '20.00000000',
            tradeStep: '0.01000000',
            tradeLimit: '0.01000000',
            nominalValue: '0.01000000',
            prepaymentConf:
              '{"mode":"fixed_margin","fixed_margin":{"initial_margin":1000,"locked_position_margin":500,"is_unilateral":true,},"fixed_leverage":{"is_unilateral":true,"leverage_multiple":100},"float_leverage":[{"nominal_value":1000,"leverage_multiple":100},{"nominal_value":5000,"leverage_multiple":10},{"nominal_value":10000,"leverage_multiple":1}]}',
            enableHoldingCost: false,
            holdingCostConf: '{}',
            tradeTimeConf:
              '{"MONDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"TUESDAY":{"isAlone":false,"trade":[{"start":0,"end":915}],"price":[{"start":0,"end":915}]},"WEDNESDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"THURSDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"FRIDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"SATURDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"SUNDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]}}',
            quotationConf: '{}',
            transactionFeeConf:
              '{"type":"trade_hand","trade_hand":[{"from":0,"to":10,"compute_mode":"percentage","market_fee":10,"limit_fee":10,"min_value":1,"max_value":100}]}'
          },
          symbolNewTicker: {
            dataSourceCode: 'huobi',
            symbol: 'btcusdt',
            open: '71293.1',
            close: '71401.73',
            low: '70135.01',
            high: '71440.66'
          }
        },
        {
          id: '1794971992189952001',
          symbol: 'SILVER',
          alias: '白银',
          symbolGroupId: '1793559417371856898',
          symbolConfId: '1794971992177369090',
          dataSourceCode: 'huobi',
          dataSourceSymbol: 'sillyusdt',
          symbolDecimal: 7,
          imgUrl: '',
          status: 'DISABLED',
          remark: '白银描述',
          isDeleted: false,
          symbolConf: {
            id: null,
            depthOfMarket: 32,
            spreadConf: '{"type":"float","sell":400,"buy":200}',
            baseCurrency: 'USD',
            baseCurrencyDecimal: 7,
            profitCurrency: 'USD',
            profitCurrencyDecimal: 6,
            prepaymentCurrency: 'EUR',
            prepaymentCurrencyDecimal: 5,
            contractSize: 9000,
            calculationType: 'FOREIGN_CURRENCY',
            tradeLicense: 'ENABLE',
            orderType: '30,50,70',
            quotationSize: null,
            gtc: 'DAY_VALID_NOT',
            limitStopLevel: 900,
            quotationDelay: 1000,
            minTrade: '0.10000000',
            maxTrade: '1000.00000000',
            tradeStep: '0.10000000',
            tradeLimit: '1000.00000000',
            nominalValue: '10000.00000000',
            prepaymentConf:
              '{"mode":"float_leverage","float_leverage":[{"leverage_multiple":300,"nominal_start_value":100,"nominal_end_value":200},{"leverage_multiple":600,"nominal_start_value":400,"nominal_end_value":500}]}',
            enableHoldingCost: null,
            holdingCostConf:
              '{"isEnable":true,"isHoliday":true,"type":"percentageOpenPrice","buyBag":1,"sellBag":1,"days":23,"multiplier":{}}',
            tradeTimeConf:
              '{"MONDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"TUESDAY":{"isAlone":false,"trade":[{"start":0,"end":915}],"price":[{"start":0,"end":915}]},"WEDNESDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"THURSDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"FRIDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"SATURDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"SUNDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]}}',
            quotationConf: '{"ordinary":1,"filter":"7","discard":3,"min":4,"max":5}',
            transactionFeeConf:
              '{"type":"trade_vol","trade_vol":[{"from":100,"to":200,"compute_mode":"percentage","market_fee":500,"limit_fee":600,"min_value":700,"max_value":900},{"from":400,"to":600,"compute_mode":"currency","market_fee":700,"limit_fee":800,"min_value":900,"max_value":1000}]}'
          },
          symbolNewTicker: null
        },
        {
          id: '1796110578977177602',
          symbol: 'EURUSD',
          alias: '欧元美元',
          symbolGroupId: '1793559495180390402',
          symbolConfId: '1796110578905874433',
          dataSourceCode: 'huobi',
          dataSourceSymbol: 'ugaseth',
          symbolDecimal: 2,
          imgUrl: '',
          status: 'DISABLED',
          remark: '欧元美元说明',
          isDeleted: false,
          symbolConf: {
            id: null,
            depthOfMarket: 12,
            spreadConf: '{"type":"fixed","sell":1222,"buy":1222}',
            baseCurrency: 'USD',
            baseCurrencyDecimal: 7,
            profitCurrency: 'USD',
            profitCurrencyDecimal: 6,
            prepaymentCurrency: 'EUR',
            prepaymentCurrencyDecimal: 5,
            contractSize: 99999,
            calculationType: 'FOREIGN_CURRENCY',
            tradeLicense: 'ENABLE',
            orderType: '60,50,40',
            quotationSize: null,
            gtc: 'DAY_VALID_NOT',
            limitStopLevel: 12,
            quotationDelay: 45,
            minTrade: '0.10000000',
            maxTrade: '1000.00000000',
            tradeStep: '0.10000000',
            tradeLimit: '1000.00000000',
            nominalValue: '10000.00000000',
            prepaymentConf: '{"mode":"fixed_margin","initial_margin":12,"locked_position_margin":22,"is_unilateral":true}',
            enableHoldingCost: null,
            holdingCostConf:
              '{"isEnable":true,"isHoliday":true,"type":"percentageCurrentPrice","buyBag":12,"sellBag":4,"days":"365","multiplier":{"MONDAY":11,"TUESDAY":2,"WEDNESDAY":1,"THURSDAY":14,"FRIDAY":1,"SATURDAY":18,"SUNDAY":1}}',
            tradeTimeConf:
              '{"MONDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"TUESDAY":{"isAlone":false,"trade":[{"start":0,"end":915}],"price":[{"start":0,"end":915}]},"WEDNESDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"THURSDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"FRIDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"SATURDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]},"SUNDAY":{"isAlone":false,"trade":[{"start":0,"end":1440}],"price":[{"start":0,"end":1440}]}}',
            quotationConf: '{"ordinary":2,"filter":"2","discard":4,"min":5,"max":6}',
            transactionFeeConf:
              '{"type":"trade_hand","trade_hand":[{"from":1,"to":2,"compute_mode":"currency","market_fee":1,"limit_fee":1,"min_value":11,"max_value":22}]}'
          },
          symbolNewTicker: null
        }
      ],
      msg: '操作成功'
    })
  },
  '/api/trade-core/coreApi/orders/tradeRecordsPage': async (req: Request, res: Response) => {
    res.send({
      code: 200,
      success: true,
      data: {
        records: [
          {
            id: '1797597520421302273',
            tradeAccountId: '1788858053324546049',
            orderId: '1797597519876042753',
            bagOrderId: '1797591905414275073',
            symbol: 'btcusdt',
            buySell: 'BUY',
            tradingVolume: '1.00000000',
            startPrice: '69099.42000000',
            tradePrice: null,
            priceValueId: 'huobi-btcusdt-1717415618760',
            inOut: 'IN',
            profit: null,
            handlingFees: '100.00000000',
            interestFees: '0E-8',
            remark: null,
            createTime: '2024-06-03 19:53:40'
          },
          {
            id: '1797597132188119041',
            tradeAccountId: '1788858053324546049',
            orderId: '1797597131496058882',
            bagOrderId: '1797591905414275073',
            symbol: 'btcusdt',
            buySell: 'BUY',
            tradingVolume: '1.00000000',
            startPrice: '69113.18000000',
            tradePrice: null,
            priceValueId: 'huobi-btcusdt-1717415514980',
            inOut: 'IN',
            profit: null,
            handlingFees: '1.00000000',
            interestFees: '0E-8',
            remark: null,
            createTime: '2024-06-03 19:52:08'
          },
          {
            id: '1797596422012669953',
            tradeAccountId: '1788858053324546049',
            orderId: '1797596421719068673',
            bagOrderId: '1797591905414275073',
            symbol: 'btcusdt',
            buySell: 'BUY',
            tradingVolume: '1.00000000',
            startPrice: '69060.29000000',
            tradePrice: null,
            priceValueId: 'huobi-btcusdt-1717415339028',
            inOut: 'IN',
            profit: null,
            handlingFees: '10.00000000',
            interestFees: '0E-8',
            remark: null,
            createTime: '2024-06-03 19:49:18'
          },
          {
            id: '1797596054604222465',
            tradeAccountId: '1788858053324546049',
            orderId: '1797596053819887618',
            bagOrderId: '1797591905414275073',
            symbol: 'btcusdt',
            buySell: 'BUY',
            tradingVolume: '1.00000000',
            startPrice: '68974.92000000',
            tradePrice: null,
            priceValueId: 'huobi-btcusdt-1717415269368',
            inOut: 'IN',
            profit: null,
            handlingFees: '1.00000000',
            interestFees: '0E-8',
            remark: null,
            createTime: '2024-06-03 19:47:51'
          },
          {
            id: '1797595667830677506',
            tradeAccountId: '1788858053324546049',
            orderId: '1797595667251863554',
            bagOrderId: '1797591905414275073',
            symbol: 'btcusdt',
            buySell: 'BUY',
            tradingVolume: '1.00000000',
            startPrice: '69004.93000000',
            tradePrice: null,
            priceValueId: 'huobi-btcusdt-1717415163885',
            inOut: 'IN',
            profit: null,
            handlingFees: '1.00000000',
            interestFees: '0E-8',
            remark: null,
            createTime: '2024-06-03 19:46:19'
          },
          {
            id: '1797594803539841025',
            tradeAccountId: '1788858053324546049',
            orderId: '1797594802940055554',
            bagOrderId: '1797591905414275073',
            symbol: 'btcusdt',
            buySell: 'BUY',
            tradingVolume: '1.00000000',
            startPrice: '69046.17000000',
            tradePrice: null,
            priceValueId: 'huobi-btcusdt-1717414963173',
            inOut: 'IN',
            profit: null,
            handlingFees: '1.00000000',
            interestFees: '0E-8',
            remark: null,
            createTime: '2024-06-03 19:42:53'
          },
          {
            id: '1797594160972525570',
            tradeAccountId: '1788858053324546049',
            orderId: '1797594160452431874',
            bagOrderId: '1797591905414275073',
            symbol: 'btcusdt',
            buySell: 'BUY',
            tradingVolume: '1.00000000',
            startPrice: '69004.92000000',
            tradePrice: null,
            priceValueId: 'huobi-btcusdt-1717414818638',
            inOut: 'IN',
            profit: null,
            handlingFees: '1.00000000',
            interestFees: '0E-8',
            remark: null,
            createTime: '2024-06-03 19:40:19'
          },
          {
            id: '1797593021367574530',
            tradeAccountId: '1788858053324546049',
            orderId: '1797593021082361857',
            bagOrderId: '1797591905414275073',
            symbol: 'btcusdt',
            buySell: 'BUY',
            tradingVolume: '1.00000000',
            startPrice: '69119.47000000',
            tradePrice: null,
            priceValueId: 'huobi-btcusdt-1717414546207',
            inOut: 'IN',
            profit: null,
            handlingFees: '0E-8',
            interestFees: '0E-8',
            remark: null,
            createTime: '2024-06-03 19:35:48'
          },
          {
            id: '1797591936867360770',
            tradeAccountId: '1788858053324546049',
            orderId: '1797591936661839873',
            bagOrderId: '1797591905414275073',
            symbol: 'btcusdt',
            buySell: 'BUY',
            tradingVolume: '1.00000000',
            startPrice: '69219.02000000',
            tradePrice: null,
            priceValueId: 'huobi-btcusdt-1717414289407',
            inOut: 'IN',
            profit: null,
            handlingFees: '0E-8',
            interestFees: '0E-8',
            remark: null,
            createTime: '2024-06-03 19:31:29'
          },
          {
            id: '1797591905661739010',
            tradeAccountId: '1788858053324546049',
            orderId: '1797591905175199746',
            bagOrderId: '1797591905414275073',
            symbol: 'btcusdt',
            buySell: 'BUY',
            tradingVolume: '1.00000000',
            startPrice: '69211.91000000',
            tradePrice: null,
            priceValueId: 'huobi-btcusdt-1717414272574',
            inOut: 'IN',
            profit: null,
            handlingFees: '0E-8',
            interestFees: '0E-8',
            remark: null,
            createTime: '2024-06-03 19:31:22'
          }
        ],
        total: 101,
        size: 10,
        current: 1,
        orders: [],
        optimizeCountSql: true,
        searchCount: true,
        maxLimit: null,
        countId: null,
        pages: 11
      },
      msg: '操作成功'
    })
  },
  '/api/trade-core/coreApi/orders/bgaOrderPage': async (req: Request, res: Response) => {
    res.send({
      code: 200,
      success: true,
      data: {
        records: [
          {
            id: '1798924686060793857',
            tradeAccountId: '1795631759161847809',
            symbol: 'ethusdt',
            mode: 'NETTING',
            buySell: 'BUY',
            marginType: 'CROSS_MARGIN',
            orderMargin: '0E-8',
            orderVolume: '0.13000000',
            startPrice: '3809.75409520',
            closePrice: null,
            takeProfit: '0E-8',
            stopLoss: '0E-8',
            leverageMultiple: null,
            handlingFees: '0E-8',
            interestFees: '0E-8',
            profit: null,
            status: 'BAG',
            remark: null,
            conf: '{"baseCurrency":"USD","baseCurrencyDecimal":2,"calculationType":"FOREIGN_CURRENCY","contractSize":10000,"depthOfMarket":0,"enableHoldingCost":false,"gtc":"DAY_VALID","holdingCostConf":"{}","id":"1787377389832024065","limitStopLevel":5,"maxTrade":20.00000000,"minTrade":0.01000000,"nominalValue":0.01000000,"orderType":"10","prepaymentConf":"{\\"mode\\":\\"fixed_margin\\",\\"fixed_margin\\":{\\"initial_margin\\":1000,\\"locked_position_margin\\":500,\\"is_unilateral\\":true,},\\"fixed_leverage\\":{\\"is_unilateral\\":true,\\"leverage_multiple\\":100},\\"float_leverage\\":[{\\"nominal_start_value\\":1000,\\"leverage_multiple\\":100},{\\"nominal_start_value\\":5000,\\"leverage_multiple\\":10},{\\"nominal_start_value\\":10000,\\"leverage_multiple\\":1}]}","prepaymentCurrency":"USD","prepaymentCurrencyDecimal":2,"profitCurrency":"USD","profitCurrencyDecimal":2,"quotationConf":"{}","quotationDelay":5,"spreadConf":"{}","tradeLicense":"ENABLE","tradeLimit":0.01000000,"tradeStep":0.01000000,"tradeTimeConf":"{\\"MONDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]},\\"TUESDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":915}],\\"price\\":[{\\"start\\":0,\\"end\\":915}]},\\"WEDNESDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]},\\"THURSDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]},\\"FRIDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]},\\"SATURDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]},\\"SUNDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]}}","transactionFeeConf":"{}"}',
            createTime: '2024-06-07 11:56:44',
            updateTime: '2024-06-07 11:56:44',
            dataSourceCode: 'huobi',
            dataSourceSymbol: 'ethusdt',
            symbolDecimal: 2,
            imgUrl: '无'
          },
          {
            id: '1797591905414275073',
            tradeAccountId: '1788858053324546049',
            symbol: 'btcusdt',
            mode: 'NETTING',
            buySell: 'BUY',
            marginType: 'CROSS_MARGIN',
            orderMargin: '0E-8',
            orderVolume: '10.00000000',
            startPrice: '69096.92181816',
            closePrice: null,
            takeProfit: null,
            stopLoss: null,
            leverageMultiple: null,
            handlingFees: '115.00000000',
            interestFees: '0E-8',
            profit: null,
            status: 'BAG',
            remark: null,
            conf: '{"baseCurrency":"USD","baseCurrencyDecimal":2,"calculationType":"FOREIGN_CURRENCY","contractSize":1,"depthOfMarket":0,"enableHoldingCost":false,"expire":"CLIENT_CANCEL","gtc":"DAY_VALID","holdingCostConf":"{}","limitStopLevel":5,"maxTrade":20.00000000,"minTrade":0.01000000,"nominalValue":0.01000000,"orderType":"10","prepaymentConf":"{\\"mode\\":\\"fixed_margin\\",\\"fixed_margin\\":{\\"initial_margin\\":1000,\\"locked_position_margin\\":500,\\"is_unilateral\\":true,},\\"fixed_leverage\\":{\\"is_unilateral\\":true,\\"leverage_multiple\\":100},\\"float_leverage\\":[{\\"nominal_start_value\\":1000,\\"leverage_multiple\\":100},{\\"nominal_start_value\\":5000,\\"leverage_multiple\\":10},{\\"nominal_start_value\\":10000,\\"leverage_multiple\\":1}]}","prepaymentCurrency":"USD","prepaymentCurrencyDecimal":2,"profitCurrency":"USD","profitCurrencyDecimal":2,"quotationConf":"{}","quotationDelay":5,"spreadConf":"{}","tradeLicense":"ENABLE","tradeLimit":0.01000000,"tradeStep":0.01000000,"tradeTimeConf":"{\\"MONDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]},\\"TUESDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":915}],\\"price\\":[{\\"start\\":0,\\"end\\":915}]},\\"WEDNESDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]},\\"THURSDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]},\\"FRIDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]},\\"SATURDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]},\\"SUNDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]}}","transactionFeeConf":"{}"}',
            createTime: '2024-06-03 19:31:22',
            updateTime: '2024-06-03 19:31:22',
            dataSourceCode: 'huobi',
            dataSourceSymbol: 'btcusdt',
            symbolDecimal: 2,
            imgUrl: '无'
          },
          {
            id: '1795645715721011202',
            tradeAccountId: '1788858053324546049',
            symbol: 'btcusdt',
            mode: 'NETTING',
            buySell: 'BUY',
            marginType: 'CROSS_MARGIN',
            orderMargin: '0E-8',
            orderVolume: '6.00000000',
            startPrice: '68456.16428570',
            closePrice: null,
            takeProfit: null,
            stopLoss: null,
            leverageMultiple: null,
            handlingFees: '0E-8',
            interestFees: null,
            profit: null,
            status: 'BAG',
            remark: null,
            conf: '{"baseCurrency":"USD","baseCurrencyDecimal":2,"calculationType":"FOREIGN_CURRENCY","contractSize":1,"depthOfMarket":0,"enableHoldingCost":false,"expire":"CLIENT_CANCEL","gtc":"DAY_VALID","holdingCostConf":"{}","id":"1787377482316427265","limitStopLevel":5,"maxTrade":20.00000000,"minTrade":0.01000000,"nominalValue":0.01000000,"prepaymentConf":"{\\"mode\\":\\"fixed_margin\\",\\"fixed_margin\\":{\\"initial_margin\\":1000,\\"locked_position_margin\\":500,\\"is_unilateral\\":true,},\\"fixed_leverage\\":{\\"is_unilateral\\":true,\\"leverage_multiple\\":100},\\"float_leverage\\":[{\\"nominal_value\\":1000,\\"leverage_multiple\\":100},{\\"nominal_value\\":5000,\\"leverage_multiple\\":10},{\\"nominal_value\\":10000,\\"leverage_multiple\\":1}]}","prepaymentCurrency":"USD","prepaymentCurrencyDecimal":2,"profitCurrency":"USD","profitCurrencyDecimal":2,"quotationConf":"{}","quotationDelay":5,"spreadConf":"{}","tradeBuySell":"BUY","tradeLicense":"ENABLE","tradeLimit":0.01000000,"tradeStep":0.01000000,"tradeTimeConf":"{\\"MONDAY\\":{\\"price\\":[{\\"start\\":\\"00:00\\",\\"end\\":\\"04:55\\"},{\\"start\\":\\"06:00\\",\\"end\\":\\"23:59\\"}],\\"trade\\":[{\\"start\\":\\"00:00\\",\\"end\\":\\"04:55\\"},{\\"start\\":\\"06:00\\",\\"end\\":\\"23:59\\"}]},\\"TUESDAY\\":{\\"price\\":[{\\"start\\":\\"00:00\\",\\"end\\":\\"04:55\\"},{\\"start\\":\\"06:00\\",\\"end\\":\\"23:59\\"}],\\"trade\\":[{\\"start\\":\\"00:00\\",\\"end\\":\\"04:55\\"},{\\"start\\":\\"06:00\\",\\"end\\":\\"23:59\\"}]},\\"WEDNESDAY\\":{\\"price\\":[{\\"start\\":\\"00:00\\",\\"end\\":\\"04:55\\"},{\\"start\\":\\"06:00\\",\\"end\\":\\"23:59\\"}],\\"trade\\":[{\\"start\\":\\"00:00\\",\\"end\\":\\"04:55\\"},{\\"start\\":\\"06:00\\",\\"end\\":\\"23:59\\"}]},\\"THURSDAY\\":{\\"price\\":[{\\"start\\":\\"00:00\\",\\"end\\":\\"04:55\\"},{\\"start\\":\\"06:00\\",\\"end\\":\\"23:59\\"}],\\"trade\\":[{\\"start\\":\\"00:00\\",\\"end\\":\\"04:55\\"},{\\"start\\":\\"06:00\\",\\"end\\":\\"23:59\\"}]},\\"FRIDAY\\":{\\"price\\":[{\\"start\\":\\"00:00\\",\\"end\\":\\"04:55\\"},{\\"start\\":\\"06:00\\",\\"end\\":\\"23:59\\"}],\\"trade\\":[{\\"start\\":\\"00:00\\",\\"end\\":\\"04:55\\"},{\\"start\\":\\"06:00\\",\\"end\\":\\"23:59\\"}]},\\"SATURDAY\\":{\\"price\\":[{\\"start\\":\\"00:00\\",\\"end\\":\\"04:55\\"},{\\"start\\":\\"06:00\\",\\"end\\":\\"23:59\\"}],\\"trade\\":[{\\"start\\":\\"00:00\\",\\"end\\":\\"04:55\\"},{\\"start\\":\\"06:00\\",\\"end\\":\\"23:59\\"}]},\\"SUNDAY\\":{\\"price\\":[{\\"start\\":\\"07:00\\",\\"end\\":\\"23:59\\"}],\\"trade\\":[{\\"start\\":\\"07:00\\",\\"end\\":\\"23:59\\"}]},}","transactionFeeConf":"{}"}',
            createTime: '2024-05-29 10:37:54',
            updateTime: '2024-05-29 10:37:54',
            dataSourceCode: 'huobi',
            dataSourceSymbol: 'btcusdt',
            symbolDecimal: 2,
            imgUrl: '无'
          }
        ],
        total: 3,
        size: 500,
        current: 1,
        orders: [],
        optimizeCountSql: true,
        searchCount: true,
        maxLimit: null,
        countId: null,
        pages: 1
      },
      msg: '操作成功'
    })
  },
  '/api/trade-core/coreApi/orders/orderPage': async (req: Request, res: Response) => {
    res.send({
      code: 200,
      success: true,
      data: {
        records: [
          {
            id: '1798957582582648834',
            tradeAccountId: '1795631759161847809',
            bagOrderId: null,
            symbol: 'ethusdt',
            mode: 'NETTING',
            buySell: 'BUY',
            type: 'LIMIT_BUY_ORDER',
            marginType: 'CROSS_MARGIN',
            orderMargin: '0E-8',
            orderVolume: '0.01000000',
            tradingVolume: null,
            tradePrice: null,
            limitPrice: '23.00000000',
            handlingFees: '0E-8',
            inOut: null,
            expirationTime: null,
            takeProfit: null,
            stopLoss: null,
            leverageMultiple: 0,
            status: 'ENTRUST',
            remark: null,
            conf: '{"baseCurrency":"USD","baseCurrencyDecimal":2,"calculationType":"FOREIGN_CURRENCY","contractSize":10000,"depthOfMarket":0,"enableHoldingCost":false,"gtc":"DAY_VALID","holdingCostConf":"{}","id":"1787377389832024065","limitStopLevel":5,"maxTrade":20.00000000,"minTrade":0.01000000,"nominalValue":0.01000000,"orderType":"10,20,30,40,50,60,70","prepaymentConf":"{\\"mode\\":\\"fixed_margin\\",\\"fixed_margin\\":{\\"initial_margin\\":1000,\\"locked_position_margin\\":500,\\"is_unilateral\\":true,},\\"fixed_leverage\\":{\\"is_unilateral\\":true,\\"leverage_multiple\\":100},\\"float_leverage\\":[{\\"nominal_value\\":1000,\\"leverage_multiple\\":100},{\\"nominal_value\\":5000,\\"leverage_multiple\\":10},{\\"nominal_value\\":10000,\\"leverage_multiple\\":1}]}","prepaymentCurrency":"USD","prepaymentCurrencyDecimal":2,"profitCurrency":"USD","profitCurrencyDecimal":2,"quotationConf":"{}","quotationDelay":5,"spreadConf":"{}","tradeLicense":"ENABLE","tradeLimit":0.01000000,"tradeStep":0.01000000,"tradeTimeConf":"{\\"MONDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]},\\"TUESDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":915}],\\"price\\":[{\\"start\\":0,\\"end\\":915}]},\\"WEDNESDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]},\\"THURSDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]},\\"FRIDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]},\\"SATURDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]},\\"SUNDAY\\":{\\"isAlone\\":false,\\"trade\\":[{\\"start\\":0,\\"end\\":1440}],\\"price\\":[{\\"start\\":0,\\"end\\":1440}]}}","transactionFeeConf":"{}"}',
            createReason: 'MANAGER',
            operatorId: '1792414621664026625',
            createTime: '2024-06-07 13:58:05',
            updateTime: '2024-06-07 13:58:05',
            dataSourceCode: 'huobi',
            dataSourceSymbol: 'ethusdt',
            symbolDecimal: 2,
            imgUrl: '无'
          }
        ],
        total: 1,
        size: 500,
        current: 1,
        orders: [],
        optimizeCountSql: true,
        searchCount: true,
        maxLimit: null,
        countId: null,
        pages: 1
      },
      msg: '操作成功'
    })
  },
  '/api/trade-crm/crmApi/client/detail': async (req: Request, res: Response) => {
    res.send({
      code: 200,
      success: true,
      data: {
        id: '1800427528372908033',
        clientGroupId: '1800420740789444610',
        address: null,
        isBankcardBind: true,
        isKycAuth: false,
        kycAuthId: null,
        remark: null,
        userInfo: {
          id: '1800427528372908033',
          createUser: '1800424242488045569',
          createDept: null,
          createTime: '2024-06-11 15:19:08',
          updateUser: '1800424242488045569',
          updateTime: '2024-06-11 15:19:08',
          status: 1,
          isDeleted: 0,
          tenantId: '000000',
          code: null,
          userType: 1,
          account: '654321@163.com',
          password: '1cd387b85e3fbc6aa2cc7dbf4605c535e97ac8fe',
          name: null,
          realName: null,
          avatar: null,
          email: '654321@163.com',
          phone: '15912345678',
          birthday: null,
          sex: null,
          roleId: '1792377441658871810',
          deptId: '1792377724824723458',
          postId: '1792378801921990658'
        },
        accountCount: {
          id: '1800427528372908033',
          availableBalance: '38320.62',
          totalTradeVolume: '1.02',
          totalProfitLoss: '-44.46',
          totalDeposit: '0',
          totalWithdrawal: '0'
        },
        accountList: [
          {
            id: '1800429599138594818',
            clientId: '1800427528372908033',
            accountGroupId: '1800416101432074242',
            name: '交易账户002',
            money: '10078.54',
            currencyUnit: 'USD',
            margin: '1008',
            isolatedMargin: '0',
            status: 'DISABLED',
            remark: null,
            lastVisitedTime: '2024-06-12 16:16:48',
            createTime: '2024-06-11 15:27:21',
            groupCode: 'real/test1',
            groupName: '锁仓测试组',
            fundTransfer: 'ALLOWABLE',
            orderMode: 'LOCKED_POSITION',
            enableIsolated: false,
            isSimulate: false
          },
          {
            id: '1800429237845442562',
            clientId: '1800427528372908033',
            accountGroupId: '1800416420626997250',
            name: '交易账户001',
            money: '9897',
            currencyUnit: 'USD',
            margin: '0',
            isolatedMargin: '0',
            status: 'DISABLED',
            remark: null,
            lastVisitedTime: '2024-06-12 16:16:48',
            createTime: '2024-06-11 15:25:55',
            groupCode: 'real/test2',
            groupName: '净额测试组',
            fundTransfer: 'ALLOWABLE',
            orderMode: 'NETTING',
            enableIsolated: true,
            isSimulate: false
          },
          {
            id: '1800841693461868546',
            clientId: '1800427528372908033',
            accountGroupId: '1800837373970436098',
            name: '模拟账户001',
            money: '1212',
            currencyUnit: '12',
            margin: '0',
            isolatedMargin: '0',
            status: 'DISABLED',
            remark: '模拟',
            lastVisitedTime: '2024-06-12 18:44:52',
            createTime: '2024-06-12 18:44:52',
            groupCode: 'demo/test',
            groupName: '模拟账户',
            fundTransfer: 'ALLOWABLE',
            orderMode: 'LOCKED_POSITION',
            enableIsolated: false,
            isSimulate: true
          }
        ],
        kycAuth: [
          {
            id: '1800505949207670785',
            clientId: '1800427528372908033',
            identificationType: 'ID_CARD',
            lastName: '三',
            firstName: '张',
            identificationCode: '123456789987654321',
            authImgsUrl: 'https://developers.binance.com/docs/zh-CN/img/logo.svg',
            remark: '审核通过',
            createdTime: '2024-06-11 20:30:44',
            auditUserId: '1123598821738675201',
            auditTime: '2024-06-12 10:52:36',
            status: 'SUCCESS'
          }
        ],
        bankCardAuth: [
          {
            id: '1800505703111077890',
            clientId: '1800427528372908033',
            bankCardType: 'DEBIT_CARD',
            bankName: '中国银行',
            bankCardCode: '2342342342',
            createBank: '珠海支行',
            holder: '张三',
            authImgsUrl: 'https://developers.binance.com/docs/zh-CN/img/logo.svg',
            status: 'SUCCESS',
            remark: '通过',
            createdTime: '2024-06-11 20:29:46',
            auditUserId: '1123598821738675201',
            auditTime: '2024-06-12 11:03:29'
          }
        ]
      },
      msg: '操作成功'
    })
  },
  '/api/trade-crm/crmClient/public/dictBiz/area_code': async (req: Request, res: Response) => {
    res.send({
      code: 200,
      success: true,
      data: [
        {
          key: '86',
          value: 'china'
        },
        {
          key: '852',
          value: 'hongkong'
        },
        {
          key: '886',
          value: 'taiwan'
        },
        {
          key: '33',
          value: 'france'
        }
      ],
      msg: '操作成功'
    })
  },
  '/api/trade-crm/crmClient/public/dictBiz/symbol_classify': async (req: Request, res: Response) => {
    res.send({
      code: 200,
      success: true,
      data: [
        {
          key: '10',
          value: '加密货币'
        },
        {
          key: '20',
          value: '大宗商品'
        },
        {
          key: '30',
          value: '外汇'
        },
        {
          key: '40',
          value: '指数'
        },
        {
          key: '50',
          value: '股票'
        }
      ],
      msg: '操作成功'
    })
  },
  '/api/services/app/Customer/GetUserInfo': async (req: Request, res: Response) => {
    res.send({})
  }
}
