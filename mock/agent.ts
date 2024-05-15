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
  'POST /api/TokenAuth/Clogin': async (req: Request, res: Response) => {
    await waitTime(1200)
    res.send({
      result: {
        token:
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjYiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiNTEwMDAxMzIiLCJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9lbWFpbGFkZHJlc3MiOiI1MTAwMDEzMkBNQ1AuY29tIiwiQXNwTmV0LklkZW50aXR5LlNlY3VyaXR5U3RhbXAiOiIzOWU4Y2FiZC05MDZlLTcwNjAtYzA4MC0zYTBmMGQ2NTE4ODAiLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJDdXN0b21lciIsInN1YiI6IjQiLCJqdGkiOiI4ZGMwY2QzZC02ODYxLTRmNWItOWRlMS04ZTBjYTk5OTYyODYiLCJpYXQiOjE3MDQ2OTQwNjMsIlVzZXJJZCI6IjYiLCJDbGllbnRUeXBlIjoiMSIsIm5iZiI6MTcwNDY5NDA2MywiZXhwIjoxNzA1Mjk4ODYzLCJpc3MiOiJCQlRDTWFuYWdlIiwiYXVkIjoiQkJUQ01hbmFnZSJ9.nHH2Iw4F4vfZGwSI-VUZdUz3HRnfBcOPkMk7bDTOg3E',
        expireInSeconds: 604800
      },
      targetUrl: null,
      success: true,
      error: null,
      unAuthorizedRequest: false,
      __abp: true
    })
  },
  '/api/services/app/Customer/GetUserInfo': async (req: Request, res: Response) => {
    res.send({
      result: {
        userId: 6,
        code: 'em954sax',
        name: 'dsds ds32',
        email: 'willanx2023@gmail.com',
        phone: '622680123456',
        country: 67,
        countryName: '法国',
        cardType: 2,
        cardNumber: '23',
        isCardChecked: true,
        passportCheckStatus: 2,
        areaCode: '+33',
        idCardFailedReason: '',
        lastName: 'dsds',
        firstName: 'ds32',
        activationTime: '2023-12-06 17:02:23',
        inviterCode: '',
        inviteTime: '',
        cardCountry: 4,
        cardCountryName: 'Antigua and Barbuda',
        accountInfos: [
          {
            account: 51000132,
            accountPwd: 'EBE8dlMmcthL9L4eJCNRDw==',
            accountType: 'Real',
            accountGroup: 'Standard',
            appId: '2000',
            isEnabled: true
          },
          {
            account: 410000120,
            accountPwd: 'EBE8dlMmcthL9L4eJCNRDw==',
            accountType: 'Demo',
            accountGroup: 'Standard',
            appId: '2000',
            isEnabled: true
          },
          {
            account: 70000008,
            accountPwd: 'bdnIsvPs4mOBQW7W/Am/XQ==',
            accountType: 'Real',
            accountGroup: 'Mini',
            appId: '2000',
            isEnabled: true
          }
        ]
      },
      targetUrl: null,
      success: true,
      error: null,
      unAuthorizedRequest: false,
      __abp: true
    })
  },
  '/api/services/app/AreaData/GetAreaDataList': async (req: Request, res: Response) => {
    res.send({
      result: [
        {
          areaId: 1,
          areaName: 'Andorra',
          areaCode: '376',
          areaGroup: 'A',
          areaNameZh: '安道尔'
        },
        {
          areaId: 2,
          areaName: 'United Arab Emirates',
          areaCode: '971',
          areaGroup: 'A',
          areaNameZh: '阿拉伯联合酋长国'
        },
        {
          areaId: 3,
          areaName: 'Afghanistan',
          areaCode: '93',
          areaGroup: 'A',
          areaNameZh: '阿富汗'
        },
        {
          areaId: 4,
          areaName: 'Antigua and Barbuda',
          areaCode: '1268',
          areaGroup: 'A',
          areaNameZh: '安提瓜和巴布达'
        },
        {
          areaId: 5,
          areaName: 'Anguilla',
          areaCode: '1264',
          areaGroup: 'A',
          areaNameZh: '安圭拉'
        },
        {
          areaId: 6,
          areaName: 'Albania',
          areaCode: '355',
          areaGroup: 'A',
          areaNameZh: '阿尔巴尼亚'
        },
        {
          areaId: 7,
          areaName: 'Armenia',
          areaCode: '374',
          areaGroup: 'A',
          areaNameZh: '亚美尼亚'
        },
        {
          areaId: 8,
          areaName: 'Angola',
          areaCode: '244',
          areaGroup: 'A',
          areaNameZh: '安哥拉'
        },
        {
          areaId: 9,
          areaName: 'Argentina',
          areaCode: '54',
          areaGroup: 'A',
          areaNameZh: '阿根廷'
        },
        {
          areaId: 10,
          areaName: 'American Samoa',
          areaCode: '1684',
          areaGroup: 'A',
          areaNameZh: '美属萨摩亚'
        },
        {
          areaId: 11,
          areaName: 'Austria',
          areaCode: '43',
          areaGroup: 'A',
          areaNameZh: '奥地利'
        },
        {
          areaId: 12,
          areaName: 'Australia',
          areaCode: '61',
          areaGroup: 'A',
          areaNameZh: '澳大利亚'
        },
        {
          areaId: 13,
          areaName: 'Aruba',
          areaCode: '297',
          areaGroup: 'A',
          areaNameZh: '阿鲁巴'
        },
        {
          areaId: 14,
          areaName: 'Azerbaijan',
          areaCode: '994',
          areaGroup: 'A',
          areaNameZh: '阿塞拜疆'
        },
        {
          areaId: 15,
          areaName: 'Netherlands Antilles',
          areaCode: '599',
          areaGroup: 'A',
          areaNameZh: '荷属安的列斯'
        },
        {
          areaId: 16,
          areaName: 'Ascension Island',
          areaCode: '247',
          areaGroup: 'A',
          areaNameZh: '阿森松岛'
        },
        {
          areaId: 17,
          areaName: 'Bosniaand Herzegovina',
          areaCode: '387',
          areaGroup: 'B',
          areaNameZh: '波斯尼亚和黑塞哥维那'
        },
        {
          areaId: 18,
          areaName: 'Barbados',
          areaCode: '1246',
          areaGroup: 'B',
          areaNameZh: '巴巴多斯'
        },
        {
          areaId: 19,
          areaName: 'Bangladesh',
          areaCode: '880',
          areaGroup: 'B',
          areaNameZh: '孟加拉国'
        },
        {
          areaId: 20,
          areaName: 'Belgium',
          areaCode: '32',
          areaGroup: 'B',
          areaNameZh: '比利时'
        },
        {
          areaId: 21,
          areaName: 'Burkina Faso',
          areaCode: '226',
          areaGroup: 'B',
          areaNameZh: '布基纳法索'
        },
        {
          areaId: 22,
          areaName: 'Bulgaria',
          areaCode: '359',
          areaGroup: 'B',
          areaNameZh: '保加利亚'
        },
        {
          areaId: 23,
          areaName: 'Bahrain',
          areaCode: '973',
          areaGroup: 'B',
          areaNameZh: '巴林'
        },
        {
          areaId: 24,
          areaName: 'Burundi',
          areaCode: '257',
          areaGroup: 'B',
          areaNameZh: '布隆迪'
        },
        {
          areaId: 25,
          areaName: 'Benin',
          areaCode: '229',
          areaGroup: 'B',
          areaNameZh: '贝宁'
        },
        {
          areaId: 26,
          areaName: 'Bermuda',
          areaCode: '1441',
          areaGroup: 'B',
          areaNameZh: '百慕大群岛'
        },
        {
          areaId: 27,
          areaName: 'Brunei',
          areaCode: '673',
          areaGroup: 'B',
          areaNameZh: '文莱'
        },
        {
          areaId: 28,
          areaName: 'Bolivia',
          areaCode: '591',
          areaGroup: 'B',
          areaNameZh: '玻利维亚'
        },
        {
          areaId: 29,
          areaName: 'Brazil',
          areaCode: '55',
          areaGroup: 'B',
          areaNameZh: '巴西'
        },
        {
          areaId: 30,
          areaName: 'Bahamas',
          areaCode: '1242',
          areaGroup: 'B',
          areaNameZh: '巴哈马'
        },
        {
          areaId: 31,
          areaName: 'Bhutan',
          areaCode: '975',
          areaGroup: 'B',
          areaNameZh: '不丹'
        },
        {
          areaId: 32,
          areaName: 'Botswana',
          areaCode: '267',
          areaGroup: 'B',
          areaNameZh: '博茨瓦纳'
        },
        {
          areaId: 33,
          areaName: 'Belarus',
          areaCode: '375',
          areaGroup: 'B',
          areaNameZh: '白俄罗斯'
        },
        {
          areaId: 34,
          areaName: 'Belize',
          areaCode: '501',
          areaGroup: 'B',
          areaNameZh: '伯利兹'
        },
        {
          areaId: 35,
          areaName: 'Canada',
          areaCode: '1',
          areaGroup: 'C',
          areaNameZh: '加拿大'
        },
        {
          areaId: 36,
          areaName: 'Caribisch Nederland',
          areaCode: '599',
          areaGroup: 'C',
          areaNameZh: '荷兰加勒比'
        },
        {
          areaId: 37,
          areaName: 'Democratic Republic of theCongo',
          areaCode: '243',
          areaGroup: 'C',
          areaNameZh: '刚果民主共和国'
        },
        {
          areaId: 38,
          areaName: 'Central African Republic',
          areaCode: '236',
          areaGroup: 'C',
          areaNameZh: '中非共和国'
        },
        {
          areaId: 39,
          areaName: 'Republic Of The Congo',
          areaCode: '242',
          areaGroup: 'C',
          areaNameZh: '刚果共和国'
        },
        {
          areaId: 40,
          areaName: 'Ivory Coast',
          areaCode: '225',
          areaGroup: 'C',
          areaNameZh: '象牙海岸'
        },
        {
          areaId: 41,
          areaName: 'Cook Islands',
          areaCode: '682',
          areaGroup: 'C',
          areaNameZh: '库克群岛'
        },
        {
          areaId: 42,
          areaName: 'Chile',
          areaCode: '56',
          areaGroup: 'C',
          areaNameZh: '智利'
        },
        {
          areaId: 44,
          areaName: 'Cameroon',
          areaCode: '237',
          areaGroup: 'C',
          areaNameZh: '喀麦隆'
        },
        {
          areaId: 45,
          areaName: 'Colombia',
          areaCode: '57',
          areaGroup: 'C',
          areaNameZh: '哥伦比亚'
        },
        {
          areaId: 46,
          areaName: 'CostaRica',
          areaCode: '506',
          areaGroup: 'C',
          areaNameZh: '哥斯达黎加'
        },
        {
          areaId: 47,
          areaName: 'Cape Verde',
          areaCode: '238',
          areaGroup: 'C',
          areaNameZh: '开普'
        },
        {
          areaId: 48,
          areaName: 'Curacao',
          areaCode: '599',
          areaGroup: 'C',
          areaNameZh: '库拉索'
        },
        {
          areaId: 49,
          areaName: 'Cyprus',
          areaCode: '357',
          areaGroup: 'C',
          areaNameZh: '塞浦路斯'
        },
        {
          areaId: 50,
          areaName: 'Czech',
          areaCode: '420',
          areaGroup: 'C',
          areaNameZh: '捷克'
        },
        {
          areaId: 51,
          areaName: 'Cambodia',
          areaCode: '855',
          areaGroup: 'C',
          areaNameZh: '柬埔寨'
        },
        {
          areaId: 52,
          areaName: 'Comoros',
          areaCode: '269',
          areaGroup: 'C',
          areaNameZh: '科摩罗'
        },
        {
          areaId: 53,
          areaName: 'Cayman Islands',
          areaCode: '1345',
          areaGroup: 'C',
          areaNameZh: '开曼群岛'
        },
        {
          areaId: 54,
          areaName: 'Djibouti',
          areaCode: '253',
          areaGroup: 'D',
          areaNameZh: '吉布提'
        },
        {
          areaId: 55,
          areaName: 'Denmark',
          areaCode: '45',
          areaGroup: 'D',
          areaNameZh: '丹麦'
        },
        {
          areaId: 56,
          areaName: 'Dominica',
          areaCode: '1767',
          areaGroup: 'D',
          areaNameZh: '多米尼加'
        },
        {
          areaId: 57,
          areaName: 'dominican republic',
          areaCode: '1809',
          areaGroup: 'D',
          areaNameZh: '多米尼加共和国'
        },
        {
          areaId: 58,
          areaName: 'Algeria',
          areaCode: '213',
          areaGroup: 'D',
          areaNameZh: '阿尔及利亚'
        },
        {
          areaId: 59,
          areaName: 'Ecuador',
          areaCode: '593',
          areaGroup: 'E',
          areaNameZh: '厄瓜多尔'
        },
        {
          areaId: 60,
          areaName: 'Estonia',
          areaCode: '372',
          areaGroup: 'E',
          areaNameZh: '爱沙尼亚'
        },
        {
          areaId: 61,
          areaName: 'Egypt',
          areaCode: '20',
          areaGroup: 'E',
          areaNameZh: '埃及'
        },
        {
          areaId: 62,
          areaName: 'Eritrea',
          areaCode: '291',
          areaGroup: 'E',
          areaNameZh: '厄立特里亚'
        },
        {
          areaId: 63,
          areaName: 'Ethiopia',
          areaCode: '251',
          areaGroup: 'E',
          areaNameZh: '埃塞俄比亚'
        },
        {
          areaId: 64,
          areaName: 'Finland',
          areaCode: '358',
          areaGroup: 'F',
          areaNameZh: '芬兰'
        },
        {
          areaId: 65,
          areaName: 'Fiji',
          areaCode: '679',
          areaGroup: 'F',
          areaNameZh: '斐济'
        },
        {
          areaId: 66,
          areaName: 'Faroe Islands',
          areaCode: '298',
          areaGroup: 'F',
          areaNameZh: '法罗群岛'
        },
        {
          areaId: 67,
          areaName: 'France',
          areaCode: '33',
          areaGroup: 'F',
          areaNameZh: '法国'
        },
        {
          areaId: 68,
          areaName: 'Gabon',
          areaCode: '241',
          areaGroup: 'G',
          areaNameZh: '加蓬'
        },
        {
          areaId: 69,
          areaName: 'Grenada',
          areaCode: '1473',
          areaGroup: 'G',
          areaNameZh: '格林纳达'
        },
        {
          areaId: 70,
          areaName: 'Georgia',
          areaCode: '995',
          areaGroup: 'G',
          areaNameZh: '格鲁吉亚'
        },
        {
          areaId: 71,
          areaName: 'French Guiana',
          areaCode: '594',
          areaGroup: 'G',
          areaNameZh: '法属圭亚那'
        },
        {
          areaId: 72,
          areaName: 'Germany',
          areaCode: '49',
          areaGroup: 'G',
          areaNameZh: '德国'
        },
        {
          areaId: 73,
          areaName: 'Ghana',
          areaCode: '233',
          areaGroup: 'G',
          areaNameZh: '加纳'
        },
        {
          areaId: 74,
          areaName: 'Gibraltar',
          areaCode: '350',
          areaGroup: 'G',
          areaNameZh: '直布罗陀'
        },
        {
          areaId: 75,
          areaName: 'Greenland',
          areaCode: '299',
          areaGroup: 'G',
          areaNameZh: '格陵兰岛'
        },
        {
          areaId: 76,
          areaName: 'Gambia',
          areaCode: '220',
          areaGroup: 'G',
          areaNameZh: '冈比亚'
        },
        {
          areaId: 77,
          areaName: 'Guinea',
          areaCode: '224',
          areaGroup: 'G',
          areaNameZh: '几内亚'
        },
        {
          areaId: 78,
          areaName: 'Guadeloupe',
          areaCode: '590',
          areaGroup: 'G',
          areaNameZh: '瓜德罗普岛'
        },
        {
          areaId: 79,
          areaName: 'Equatorial Guinea',
          areaCode: '240',
          areaGroup: 'G',
          areaNameZh: '赤道几内亚'
        },
        {
          areaId: 80,
          areaName: 'Greece',
          areaCode: '30',
          areaGroup: 'G',
          areaNameZh: '希腊'
        },
        {
          areaId: 81,
          areaName: 'Guatemala',
          areaCode: '502',
          areaGroup: 'G',
          areaNameZh: '瓜地马拉'
        },
        {
          areaId: 82,
          areaName: 'Guam',
          areaCode: '1671',
          areaGroup: 'G',
          areaNameZh: '关岛'
        },
        {
          areaId: 83,
          areaName: 'Guinea-Bissau',
          areaCode: '245',
          areaGroup: 'G',
          areaNameZh: '几内亚比绍共和国'
        },
        {
          areaId: 84,
          areaName: 'Guyana',
          areaCode: '592',
          areaGroup: 'G',
          areaNameZh: '圭亚那'
        },
        {
          areaId: 85,
          areaName: 'Hong Kong',
          areaCode: '852',
          areaGroup: 'H',
          areaNameZh: '中国香港'
        },
        {
          areaId: 86,
          areaName: 'Honduras',
          areaCode: '504',
          areaGroup: 'H',
          areaNameZh: '洪都拉斯'
        },
        {
          areaId: 87,
          areaName: 'Croatia',
          areaCode: '385',
          areaGroup: 'H',
          areaNameZh: '克罗地亚'
        },
        {
          areaId: 88,
          areaName: 'Haiti',
          areaCode: '509',
          areaGroup: 'H',
          areaNameZh: '海地'
        },
        {
          areaId: 89,
          areaName: 'Hungary',
          areaCode: '36',
          areaGroup: 'H',
          areaNameZh: '匈牙利'
        },
        {
          areaId: 90,
          areaName: 'Indonesia',
          areaCode: '62',
          areaGroup: 'I',
          areaNameZh: '印度尼西亚'
        },
        {
          areaId: 91,
          areaName: 'Ireland',
          areaCode: '353',
          areaGroup: 'I',
          areaNameZh: '爱尔兰'
        },
        {
          areaId: 92,
          areaName: 'Israel',
          areaCode: '972',
          areaGroup: 'I',
          areaNameZh: '以色列'
        },
        {
          areaId: 93,
          areaName: 'India',
          areaCode: '91',
          areaGroup: 'I',
          areaNameZh: '印度'
        },
        {
          areaId: 94,
          areaName: 'Iraq',
          areaCode: '964',
          areaGroup: 'I',
          areaNameZh: '伊拉克'
        },
        {
          areaId: 95,
          areaName: 'Iceland',
          areaCode: '354',
          areaGroup: 'I',
          areaNameZh: '冰岛'
        },
        {
          areaId: 96,
          areaName: 'Italy',
          areaCode: '39',
          areaGroup: 'I',
          areaNameZh: '意大利'
        },
        {
          areaId: 97,
          areaName: 'Jamaica',
          areaCode: '1876',
          areaGroup: 'J',
          areaNameZh: '牙买加'
        },
        {
          areaId: 98,
          areaName: 'Jordan',
          areaCode: '962',
          areaGroup: 'J',
          areaNameZh: '约旦'
        },
        {
          areaId: 99,
          areaName: 'Japan',
          areaCode: '81',
          areaGroup: 'J',
          areaNameZh: '日本'
        },
        {
          areaId: 100,
          areaName: 'Kenya',
          areaCode: '254',
          areaGroup: 'K',
          areaNameZh: '肯尼亚'
        },
        {
          areaId: 101,
          areaName: 'Kyrgyzstan',
          areaCode: '996',
          areaGroup: 'K',
          areaNameZh: '吉尔吉斯斯坦'
        },
        {
          areaId: 102,
          areaName: 'Kiribati',
          areaCode: '686',
          areaGroup: 'K',
          areaNameZh: '基里巴斯'
        },
        {
          areaId: 103,
          areaName: 'Saint Kitts and Nevis',
          areaCode: '1869',
          areaGroup: 'K',
          areaNameZh: '圣基茨和尼维斯'
        },
        {
          areaId: 104,
          areaName: 'South Korea',
          areaCode: '82',
          areaGroup: 'K',
          areaNameZh: '韩国'
        },
        {
          areaId: 105,
          areaName: 'Kuwait',
          areaCode: '965',
          areaGroup: 'K',
          areaNameZh: '科威特'
        },
        {
          areaId: 106,
          areaName: 'Kazakhstan',
          areaCode: '7',
          areaGroup: 'K',
          areaNameZh: '哈萨克斯坦'
        },
        {
          areaId: 107,
          areaName: 'Kosovo',
          areaCode: '383',
          areaGroup: 'K',
          areaNameZh: '科索沃共和国'
        },
        {
          areaId: 108,
          areaName: 'Laos',
          areaCode: '856',
          areaGroup: 'L',
          areaNameZh: '老挝'
        },
        {
          areaId: 109,
          areaName: 'Lebanon',
          areaCode: '961',
          areaGroup: 'L',
          areaNameZh: '黎巴嫩'
        },
        {
          areaId: 110,
          areaName: 'Saint Lucia',
          areaCode: '1758',
          areaGroup: 'L',
          areaNameZh: '圣露西亚'
        },
        {
          areaId: 111,
          areaName: 'Liechtenstein',
          areaCode: '423',
          areaGroup: 'L',
          areaNameZh: '列支敦士登'
        },
        {
          areaId: 112,
          areaName: 'Sri Lanka',
          areaCode: '94',
          areaGroup: 'L',
          areaNameZh: '斯里兰卡'
        },
        {
          areaId: 113,
          areaName: 'Liberia',
          areaCode: '231',
          areaGroup: 'L',
          areaNameZh: '利比里亚'
        },
        {
          areaId: 114,
          areaName: 'Lesotho',
          areaCode: '266',
          areaGroup: 'L',
          areaNameZh: '莱索托'
        },
        {
          areaId: 115,
          areaName: 'Lithuania',
          areaCode: '370',
          areaGroup: 'L',
          areaNameZh: '立陶宛'
        },
        {
          areaId: 116,
          areaName: 'Luxembourg',
          areaCode: '352',
          areaGroup: 'L',
          areaNameZh: '卢森堡'
        },
        {
          areaId: 117,
          areaName: 'Latvia',
          areaCode: '371',
          areaGroup: 'L',
          areaNameZh: '拉脱维亚'
        },
        {
          areaId: 118,
          areaName: 'Libya',
          areaCode: '218',
          areaGroup: 'L',
          areaNameZh: '利比亚'
        },
        {
          areaId: 119,
          areaName: 'Morocco',
          areaCode: '212',
          areaGroup: 'M',
          areaNameZh: '摩洛哥'
        },
        {
          areaId: 120,
          areaName: 'Monaco',
          areaCode: '377',
          areaGroup: 'M',
          areaNameZh: '摩纳哥'
        },
        {
          areaId: 121,
          areaName: 'Moldova',
          areaCode: '373',
          areaGroup: 'M',
          areaNameZh: '摩尔多瓦'
        },
        {
          areaId: 122,
          areaName: 'Montenegro',
          areaCode: '382',
          areaGroup: 'M',
          areaNameZh: '黑山'
        },
        {
          areaId: 123,
          areaName: 'Madagascar',
          areaCode: '261',
          areaGroup: 'M',
          areaNameZh: '马达加斯加'
        },
        {
          areaId: 124,
          areaName: 'Marshall Islands',
          areaCode: '692',
          areaGroup: 'M',
          areaNameZh: '马绍尔群岛'
        },
        {
          areaId: 125,
          areaName: 'Macedonia',
          areaCode: '389',
          areaGroup: 'M',
          areaNameZh: '马其顿'
        },
        {
          areaId: 126,
          areaName: 'Mali',
          areaCode: '223',
          areaGroup: 'M',
          areaNameZh: '马里'
        },
        {
          areaId: 127,
          areaName: 'Myanmar',
          areaCode: '95',
          areaGroup: 'M',
          areaNameZh: '缅甸'
        },
        {
          areaId: 128,
          areaName: 'Mongolia',
          areaCode: '976',
          areaGroup: 'M',
          areaNameZh: '蒙古'
        },
        {
          areaId: 129,
          areaName: 'Macau',
          areaCode: '853',
          areaGroup: 'M',
          areaNameZh: '中国澳门'
        },
        {
          areaId: 130,
          areaName: 'Mauritania',
          areaCode: '222',
          areaGroup: 'M',
          areaNameZh: '毛里塔尼亚'
        },
        {
          areaId: 131,
          areaName: 'Montserrat',
          areaCode: '1664',
          areaGroup: 'M',
          areaNameZh: '蒙特塞拉特岛'
        },
        {
          areaId: 132,
          areaName: 'Malta',
          areaCode: '356',
          areaGroup: 'M',
          areaNameZh: '马耳他'
        },
        {
          areaId: 133,
          areaName: 'Mauritius',
          areaCode: '230',
          areaGroup: 'M',
          areaNameZh: '毛里求斯'
        },
        {
          areaId: 134,
          areaName: 'Maldives',
          areaCode: '960',
          areaGroup: 'M',
          areaNameZh: '马尔代夫'
        },
        {
          areaId: 135,
          areaName: 'Malawi',
          areaCode: '265',
          areaGroup: 'M',
          areaNameZh: '马拉维'
        },
        {
          areaId: 136,
          areaName: 'Mexico',
          areaCode: '52',
          areaGroup: 'M',
          areaNameZh: '墨西哥'
        },
        {
          areaId: 137,
          areaName: 'Malaysia',
          areaCode: '60',
          areaGroup: 'M',
          areaNameZh: '马来西亚'
        },
        {
          areaId: 138,
          areaName: 'Mozambique',
          areaCode: '258',
          areaGroup: 'M',
          areaNameZh: '莫桑比克'
        },
        {
          areaId: 139,
          areaName: 'Micronesia',
          areaCode: '691',
          areaGroup: 'M',
          areaNameZh: '密克罗尼西亚'
        },
        {
          areaId: 140,
          areaName: 'Mayotte',
          areaCode: '269',
          areaGroup: 'M',
          areaNameZh: '马约特'
        },
        {
          areaId: 141,
          areaName: 'Martinique',
          areaCode: '596',
          areaGroup: 'M',
          areaNameZh: '马丁尼克'
        },
        {
          areaId: 142,
          areaName: 'Northern Mariana Islands',
          areaCode: '1670',
          areaGroup: 'M',
          areaNameZh: '北马利安纳群岛'
        },
        {
          areaId: 143,
          areaName: 'Namibia',
          areaCode: '264',
          areaGroup: 'N',
          areaNameZh: '纳米比亚'
        },
        {
          areaId: 144,
          areaName: 'New Caledonia',
          areaCode: '687',
          areaGroup: 'N',
          areaNameZh: '新喀里多尼亚'
        },
        {
          areaId: 145,
          areaName: 'Niger',
          areaCode: '227',
          areaGroup: 'N',
          areaNameZh: '尼日尔'
        },
        {
          areaId: 146,
          areaName: 'Nigeria',
          areaCode: '234',
          areaGroup: 'N',
          areaNameZh: '尼日利亚'
        },
        {
          areaId: 147,
          areaName: 'Nicaragua',
          areaCode: '505',
          areaGroup: 'N',
          areaNameZh: '尼加拉瓜'
        },
        {
          areaId: 148,
          areaName: 'Netherlands',
          areaCode: '31',
          areaGroup: 'N',
          areaNameZh: '荷兰'
        },
        {
          areaId: 149,
          areaName: 'Norway',
          areaCode: '47',
          areaGroup: 'N',
          areaNameZh: '挪威'
        },
        {
          areaId: 150,
          areaName: 'Nepal',
          areaCode: '977',
          areaGroup: 'N',
          areaNameZh: '尼泊尔'
        },
        {
          areaId: 151,
          areaName: 'Nauru',
          areaCode: '674',
          areaGroup: 'N',
          areaNameZh: '拿鲁岛'
        },
        {
          areaId: 152,
          areaName: 'New Zealand',
          areaCode: '64',
          areaGroup: 'N',
          areaNameZh: '新西兰'
        },
        {
          areaId: 153,
          areaName: 'Oman',
          areaCode: '968',
          areaGroup: 'O',
          areaNameZh: '阿曼'
        },
        {
          areaId: 154,
          areaName: 'Panama',
          areaCode: '507',
          areaGroup: 'P',
          areaNameZh: '巴拿马'
        },
        {
          areaId: 155,
          areaName: 'Peru',
          areaCode: '51',
          areaGroup: 'P',
          areaNameZh: '秘鲁'
        },
        {
          areaId: 156,
          areaName: 'French Polynesia',
          areaCode: '689',
          areaGroup: 'P',
          areaNameZh: '法属波利尼西亚'
        },
        {
          areaId: 157,
          areaName: 'Papua New Guinea',
          areaCode: '675',
          areaGroup: 'P',
          areaNameZh: '巴布亚新几内亚'
        },
        {
          areaId: 158,
          areaName: 'Philippines',
          areaCode: '63',
          areaGroup: 'P',
          areaNameZh: '菲律宾'
        },
        {
          areaId: 159,
          areaName: 'Pakistan',
          areaCode: '92',
          areaGroup: 'P',
          areaNameZh: '巴基斯坦'
        },
        {
          areaId: 160,
          areaName: 'Poland',
          areaCode: '48',
          areaGroup: 'P',
          areaNameZh: '波兰'
        },
        {
          areaId: 161,
          areaName: 'Saint Pierre and Miquelon',
          areaCode: '508',
          areaGroup: 'P',
          areaNameZh: '圣彼埃尔和密克隆岛'
        },
        {
          areaId: 162,
          areaName: 'Puerto Rico',
          areaCode: '1787',
          areaGroup: 'P',
          areaNameZh: '波多黎各'
        },
        {
          areaId: 163,
          areaName: 'Portugal',
          areaCode: '351',
          areaGroup: 'P',
          areaNameZh: '葡萄牙'
        },
        {
          areaId: 164,
          areaName: 'Palau',
          areaCode: '680',
          areaGroup: 'P',
          areaNameZh: '帕劳'
        },
        {
          areaId: 165,
          areaName: 'Paraguay',
          areaCode: '595',
          areaGroup: 'P',
          areaNameZh: '巴拉圭'
        },
        {
          areaId: 166,
          areaName: 'Palestinian Territory',
          areaCode: '970',
          areaGroup: 'P',
          areaNameZh: '巴勒斯坦'
        },
        {
          areaId: 167,
          areaName: 'Qatar',
          areaCode: '974',
          areaGroup: 'Q',
          areaNameZh: '卡塔尔'
        },
        {
          areaId: 168,
          areaName: 'Réunion Island',
          areaCode: '262',
          areaGroup: 'R',
          areaNameZh: '留尼汪'
        },
        {
          areaId: 169,
          areaName: 'Romania',
          areaCode: '40',
          areaGroup: 'R',
          areaNameZh: '罗马尼亚'
        },
        {
          areaId: 170,
          areaName: 'Russia',
          areaCode: '7',
          areaGroup: 'R',
          areaNameZh: '俄罗斯'
        },
        {
          areaId: 171,
          areaName: 'Rwanda',
          areaCode: '250',
          areaGroup: 'R',
          areaNameZh: '卢旺达'
        },
        {
          areaId: 172,
          areaName: 'Serbia',
          areaCode: '381',
          areaGroup: 'R',
          areaNameZh: '塞尔维亚'
        },
        {
          areaId: 173,
          areaName: 'Switzerland',
          areaCode: '41',
          areaGroup: 'S',
          areaNameZh: '瑞士'
        },
        {
          areaId: 174,
          areaName: 'Saudi Arabia',
          areaCode: '966',
          areaGroup: 'S',
          areaNameZh: '沙特阿拉伯'
        },
        {
          areaId: 175,
          areaName: 'Solomon Islands',
          areaCode: '677',
          areaGroup: 'S',
          areaNameZh: '所罗门群岛'
        },
        {
          areaId: 176,
          areaName: 'Seychelles',
          areaCode: '248',
          areaGroup: 'S',
          areaNameZh: '塞舌尔'
        },
        {
          areaId: 177,
          areaName: 'Sudan',
          areaCode: '249',
          areaGroup: 'S',
          areaNameZh: '苏丹'
        },
        {
          areaId: 178,
          areaName: 'Sweden',
          areaCode: '46',
          areaGroup: 'S',
          areaNameZh: '瑞典'
        },
        {
          areaId: 180,
          areaName: 'Slovenia',
          areaCode: '386',
          areaGroup: 'S',
          areaNameZh: '斯洛文尼亚'
        },
        {
          areaId: 181,
          areaName: 'Slovakia',
          areaCode: '421',
          areaGroup: 'S',
          areaNameZh: '斯洛伐克'
        },
        {
          areaId: 182,
          areaName: 'Sierra Leone',
          areaCode: '232',
          areaGroup: 'S',
          areaNameZh: '塞拉利昂'
        },
        {
          areaId: 183,
          areaName: 'San Marino',
          areaCode: '378',
          areaGroup: 'S',
          areaNameZh: '圣马力诺'
        },
        {
          areaId: 184,
          areaName: 'Senegal',
          areaCode: '221',
          areaGroup: 'S',
          areaNameZh: '塞内加尔'
        },
        {
          areaId: 185,
          areaName: 'Somalia',
          areaCode: '252',
          areaGroup: 'S',
          areaNameZh: '索马里'
        },
        {
          areaId: 186,
          areaName: 'Suriname',
          areaCode: '597',
          areaGroup: 'S',
          areaNameZh: '苏里南'
        },
        {
          areaId: 187,
          areaName: 'Sao Tome and Principe',
          areaCode: '239',
          areaGroup: 'S',
          areaNameZh: '圣多美和普林西比'
        },
        {
          areaId: 188,
          areaName: 'ElSalvador',
          areaCode: '503',
          areaGroup: 'S',
          areaNameZh: '萨尔瓦多'
        },
        {
          areaId: 189,
          areaName: 'Swaziland',
          areaCode: '268',
          areaGroup: 'S',
          areaNameZh: '斯威士兰'
        },
        {
          areaId: 190,
          areaName: 'Spain',
          areaCode: '34',
          areaGroup: 'S',
          areaNameZh: '西班牙'
        },
        {
          areaId: 191,
          areaName: 'Samoa',
          areaCode: '685',
          areaGroup: 'S',
          areaNameZh: '萨摩亚'
        },
        {
          areaId: 192,
          areaName: 'Sint Maarten (Dutch Part)',
          areaCode: '1721',
          areaGroup: 'S',
          areaNameZh: '英属圣马丁'
        },
        {
          areaId: 193,
          areaName: 'South Sudan',
          areaCode: '211',
          areaGroup: 'S',
          areaNameZh: '南苏丹'
        },
        {
          areaId: 194,
          areaName: 'Turks and Caicos Islands',
          areaCode: '1649',
          areaGroup: 'T',
          areaNameZh: '特克斯和凯科斯群岛'
        },
        {
          areaId: 195,
          areaName: 'Chad',
          areaCode: '235',
          areaGroup: 'T',
          areaNameZh: '乍得'
        },
        {
          areaId: 196,
          areaName: 'Togo',
          areaCode: '228',
          areaGroup: 'T',
          areaNameZh: '多哥'
        },
        {
          areaId: 197,
          areaName: 'Thailand',
          areaCode: '66',
          areaGroup: 'T',
          areaNameZh: '泰国'
        },
        {
          areaId: 198,
          areaName: 'Tajikistan',
          areaCode: '992',
          areaGroup: 'T',
          areaNameZh: '塔吉克斯坦'
        },
        {
          areaId: 199,
          areaName: 'East Timor',
          areaCode: '670',
          areaGroup: 'T',
          areaNameZh: '东帝汶'
        },
        {
          areaId: 200,
          areaName: 'Turkmenistan',
          areaCode: '993',
          areaGroup: 'T',
          areaNameZh: '土库曼斯坦'
        },
        {
          areaId: 201,
          areaName: 'Tunisia',
          areaCode: '216',
          areaGroup: 'T',
          areaNameZh: '突尼斯'
        },
        {
          areaId: 202,
          areaName: 'Tonga',
          areaCode: '676',
          areaGroup: 'T',
          areaNameZh: '汤加'
        },
        {
          areaId: 203,
          areaName: 'Turkey',
          areaCode: '90',
          areaGroup: 'T',
          areaNameZh: '土耳其'
        },
        {
          areaId: 204,
          areaName: 'Trinidad and Tobago',
          areaCode: '1868',
          areaGroup: 'T',
          areaNameZh: '特立尼达和多巴哥'
        },
        {
          areaId: 205,
          areaName: 'Taiwan',
          areaCode: '886',
          areaGroup: 'T',
          areaNameZh: '中国台湾'
        },
        {
          areaId: 206,
          areaName: 'Tanzania',
          areaCode: '255',
          areaGroup: 'T',
          areaNameZh: '坦桑尼亚'
        },
        {
          areaId: 207,
          areaName: 'Ukraine',
          areaCode: '380',
          areaGroup: 'U',
          areaNameZh: '乌克兰'
        },
        {
          areaId: 208,
          areaName: 'Uganda',
          areaCode: '256',
          areaGroup: 'U',
          areaNameZh: '乌干达'
        },
        {
          areaId: 209,
          areaName: 'United States',
          areaCode: '1',
          areaGroup: 'U',
          areaNameZh: '美国'
        },
        {
          areaId: 210,
          areaName: 'United Kingdom',
          areaCode: '44',
          areaGroup: 'U',
          areaNameZh: '英国'
        },
        {
          areaId: 211,
          areaName: 'Uruguay',
          areaCode: '598',
          areaGroup: 'U',
          areaNameZh: '乌拉圭'
        },
        {
          areaId: 212,
          areaName: 'Uzbekistan',
          areaCode: '998',
          areaGroup: 'U',
          areaNameZh: '乌兹别克斯坦'
        },
        {
          areaId: 213,
          areaName: 'Saint Vincent and The Grenadines',
          areaCode: '1784',
          areaGroup: 'V',
          areaNameZh: '圣文森特和格林纳丁斯'
        },
        {
          areaId: 214,
          areaName: 'Venezuela',
          areaCode: '58',
          areaGroup: 'V',
          areaNameZh: '委内瑞拉'
        },
        {
          areaId: 215,
          areaName: 'VirginIslands,British',
          areaCode: '1284',
          areaGroup: 'V',
          areaNameZh: '英属处女群岛'
        },
        {
          areaId: 216,
          areaName: 'Vietnam',
          areaCode: '84',
          areaGroup: 'V',
          areaNameZh: '越南'
        },
        {
          areaId: 217,
          areaName: 'Vanuatu',
          areaCode: '678',
          areaGroup: 'V',
          areaNameZh: '瓦努阿图'
        },
        {
          areaId: 218,
          areaName: 'Virgin Islands, US',
          areaCode: '1340',
          areaGroup: 'V',
          areaNameZh: '美属维尔京群岛'
        },
        {
          areaId: 219,
          areaName: 'Western Sahara',
          areaCode: '212',
          areaGroup: 'W',
          areaNameZh: '西撒哈拉'
        },
        {
          areaId: 220,
          areaName: 'Yemen',
          areaCode: '967',
          areaGroup: 'Y',
          areaNameZh: '也门'
        },
        {
          areaId: 221,
          areaName: 'South Africa',
          areaCode: '27',
          areaGroup: 'Z',
          areaNameZh: '南非'
        },
        {
          areaId: 222,
          areaName: 'Zambia',
          areaCode: '260',
          areaGroup: 'Z',
          areaNameZh: '赞比亚'
        },
        {
          areaId: 223,
          areaName: 'Zimbabwe',
          areaCode: '263',
          areaGroup: 'Z',
          areaNameZh: '津巴布韦'
        }
      ],
      targetUrl: null,
      success: true,
      error: null,
      unAuthorizedRequest: false,
      __abp: true
    })
  },
  '/api/services/app/FundManage/GetMtFundsInfo': async (req: Request, res: Response) => {
    await waitTime(1200)
    res.send({
      result: {
        balance: 10,
        equity: 20,
        margin: 30,
        marginfree: 40
      }
    })
  },
  'POST /api/services/app/CrmAgent/RequestCrmAgentApi': async (req: Request, res: Response) => {
    await waitTime(1200)
    const url = req.body.requestUrl

    // @ts-ignore
    let data = {
      'agent/getAgentType': {
        result: {
          content: '{"Status":"0","IsSuccess":true,"Data": "1"}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'agent/getPromotionNumber': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":{"agentid":"10004","url-0":"http://www.mcp.lan/?inviteCode=10004S0","promotionNum-0":"10004S0"}}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'index/data': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":{"platform":60,"account":51000132,"deposit":0,"commissions":[{"date":"2024-01-08","value":10},{"date":"2024-01-07","value":20},{"date":"2024-01-06","value":10},{"date":"2024-01-05","value":40},{"date":"2024-01-04","value":50}],"newCommission":0,"newAgent":0}}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'index/commissions': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":{"total":60,"commissions":[{"date":"2024-01-08","value":10},{"date":"2024-01-07","value":20},{"date":"2024-01-06","value":10},{"date":"2024-01-05","value":40},{"date":"2024-01-04","value":50},{"date":"2024-01-08","value":10},{"date":"2024-01-07","value":20},{"date":"2024-01-06","value":10},{"date":"2024-01-05","value":40},{"date":"2024-01-04","value":50},{"date":"2024-01-08","value":10},{"date":"2024-01-07","value":20},{"date":"2024-01-06","value":10},{"date":"2024-01-05","value":40},{"date":"2024-01-04","value":50},{"date":"2024-01-08","value":10},{"date":"2024-01-07","value":20},{"date":"2024-01-06","value":10},{"date":"2024-01-05","value":40},{"date":"2024-01-04","value":50}]}}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'agent/getSubordinateUserList': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":[{"id":53,"platform":"60","agentId":"-1","account":"51000213","dailiAccount":"51000132","generalAgentAccount":"51000130","agentLevel":"2","agentType":"0","isNoLoad":"0","joinDailiTime":1704937153000,"commissionUpTime":1704937153000,"createDate":1704937153000,"updateDate":1704937153000},{"id":50,"platform":"60","agentId":"-1","account":"51000210","username":"opsd mdlu","dailiAccount":"51000132","generalAgentAccount":"51000130","agentLevel":"2","agentType":"0","isNoLoad":"0","joinDailiTime":1704770569000,"commissionUpTime":1704770569000,"createDate":1704770569000,"updateDate":1704770569000},{"id":42,"platform":"60","agentId":"20004","account":"51000208","username":"kong xiao","dailiAccount":"51000132","generalAgentAccount":"51000130","agentLevel":"2","agentType":"1","exchangeFreeCommission":50.00,"stockFreeCommission":50.00,"china300FreeCommission":50.00,"china50FreeCommission":50.00,"indexFreeCommission":50.00,"goldFreeCommission":50.00,"silverFreeCommission":50.00,"crudeOilFreeCommission":50.00,"britainOilFreeCommission":50.00,"btcFreeCommission":0.00,"btcsFreeCommission":50.00,"exchangeFreeCommissionEcn":0.00,"stockFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"china50FreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"goldFreeCommissionEcn":0.00,"silverFreeCommissionEcn":0.00,"crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"btcFreeCommissionEcn":0.00,"btcsFreeCommissionEcn":0.00,"exchangeFreeCommissionMini":0.00,"stockFreeCommissionMini":0.00,"china300FreeCommissionMini":0.00,"china50FreeCommissionMini":0.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionMini":0.00,"silverFreeCommissionMini":0.00,"crudeOilFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"btcFreeCommissionMini":0.00,"btcsFreeCommissionMini":0.00,"isNoLoad":"0","haveGroups":"0","settlementType":"3","latestStaticTime":1704786326000,"joinDailiTime":1704267224000,"commissionUpTime":1704267224000,"createDate":1704267124000,"updateDate":1704267224000},{"id":40,"platform":"60","agentId":"-1","account":"51000206","dailiAccount":"51000132","generalAgentAccount":"51000130","agentLevel":"2","agentType":"0","isNoLoad":"0","joinDailiTime":1703834237000,"commissionUpTime":1703834237000,"createDate":1703834237000,"updateDate":1703834237000},{"id":39,"platform":"60","agentId":"20003","account":"51000205","username":"432432 432","dailiAccount":"51000132","generalAgentAccount":"51000130","agentLevel":"2","agentType":"1","exchangeFreeCommission":40.00,"stockFreeCommission":40.00,"china300FreeCommission":40.00,"china50FreeCommission":40.00,"indexFreeCommission":40.00,"goldFreeCommission":40.00,"silverFreeCommission":40.00,"crudeOilFreeCommission":40.00,"britainOilFreeCommission":40.00,"btcFreeCommission":0.00,"btcsFreeCommission":40.00,"exchangeFreeCommissionEcn":0.00,"stockFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"china50FreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"goldFreeCommissionEcn":0.00,"silverFreeCommissionEcn":0.00,"crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"btcFreeCommissionEcn":0.00,"btcsFreeCommissionEcn":0.00,"exchangeFreeCommissionMini":0.00,"stockFreeCommissionMini":0.00,"china300FreeCommissionMini":0.00,"china50FreeCommissionMini":0.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionMini":0.00,"silverFreeCommissionMini":0.00,"crudeOilFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"btcFreeCommissionMini":0.00,"btcsFreeCommissionMini":0.00,"isNoLoad":"0","haveGroups":"0","settlementType":"3","joinDailiTime":1703833100000,"commissionUpTime":1703833100000,"createDate":1703753620000,"updateDate":1703833100000},{"id":38,"platform":"60","agentId":"-1","account":"51000203","dailiAccount":"51000132","generalAgentAccount":"51000130","agentLevel":"2","agentType":"0","isNoLoad":"0","joinDailiTime":1703753003000,"commissionUpTime":1703753003000,"createDate":1703753003000,"updateDate":1703753003000},{"id":37,"platform":"60","agentId":"-1","account":"51000202","dailiAccount":"51000132","generalAgentAccount":"51000130","agentLevel":"2","agentType":"0","isNoLoad":"0","joinDailiTime":1703752916000,"commissionUpTime":1703752916000,"createDate":1703752916000,"updateDate":1703752916000},{"id":35,"platform":"60","agentId":"20002","account":"51000196","username":"jock lvous","dailiAccount":"51000132","generalAgentAccount":"51000130","agentLevel":"2","agentType":"1","exchangeFreeCommission":45.00,"stockFreeCommission":45.00,"china300FreeCommission":45.00,"china50FreeCommission":45.00,"indexFreeCommission":45.00,"goldFreeCommission":45.00,"silverFreeCommission":45.00,"crudeOilFreeCommission":45.00,"britainOilFreeCommission":45.00,"btcFreeCommission":0.00,"btcsFreeCommission":45.00,"exchangeFreeCommissionEcn":0.00,"stockFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"china50FreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"goldFreeCommissionEcn":0.00,"silverFreeCommissionEcn":0.00,"crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"btcFreeCommissionEcn":0.00,"btcsFreeCommissionEcn":0.00,"exchangeFreeCommissionMini":0.00,"stockFreeCommissionMini":0.00,"china300FreeCommissionMini":0.00,"china50FreeCommissionMini":0.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionMini":0.00,"silverFreeCommissionMini":0.00,"crudeOilFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"btcFreeCommissionMini":0.00,"btcsFreeCommissionMini":0.00,"isNoLoad":"0","haveGroups":"0","settlementType":"3","latestStaticTime":1704954426000,"joinDailiTime":1703662359000,"commissionUpTime":1704879596000,"createDate":1703662259000,"updateDate":1704879596000},{"id":27,"platform":"60","agentId":"20001","account":"51000166","username":"fed df","dailiAccount":"51000132","generalAgentAccount":"51000130","agentLevel":"2","agentType":"1","exchangeFreeCommission":1.00,"stockFreeCommission":2.00,"china300FreeCommission":4.00,"china50FreeCommission":4.00,"indexFreeCommission":4.00,"goldFreeCommission":3.00,"silverFreeCommission":4.00,"crudeOilFreeCommission":4.00,"britainOilFreeCommission":4.00,"btcFreeCommission":0.00,"btcsFreeCommission":4.00,"exchangeFreeCommissionEcn":0.00,"stockFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"china50FreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"goldFreeCommissionEcn":0.00,"silverFreeCommissionEcn":0.00,"crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"btcFreeCommissionEcn":0.00,"btcsFreeCommissionEcn":0.00,"exchangeFreeCommissionMini":0.00,"stockFreeCommissionMini":0.00,"china300FreeCommissionMini":0.00,"china50FreeCommissionMini":0.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionMini":0.00,"silverFreeCommissionMini":0.00,"crudeOilFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"btcFreeCommissionMini":0.00,"btcsFreeCommissionMini":0.00,"isNoLoad":"0","haveGroups":"0","settlementType":"3","joinDailiTime":1702003999000,"commissionUpTime":1702003999000,"createDate":1702003219000,"updateDate":1702003999000},{"id":51,"platform":"60","agentId":"30001","account":"51000211","username":"san jidaili","dailiAccount":"51000196","generalAgentAccount":"51000130","agentLevel":"3","agentType":"1","exchangeFreeCommission":40.00,"stockFreeCommission":40.00,"china300FreeCommission":40.00,"china50FreeCommission":40.00,"indexFreeCommission":40.00,"goldFreeCommission":40.00,"silverFreeCommission":40.00,"crudeOilFreeCommission":40.00,"britainOilFreeCommission":40.00,"btcFreeCommission":0.00,"btcsFreeCommission":40.00,"exchangeFreeCommissionEcn":0.00,"stockFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"china50FreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"goldFreeCommissionEcn":0.00,"silverFreeCommissionEcn":0.00,"crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"btcFreeCommissionEcn":0.00,"btcsFreeCommissionEcn":0.00,"exchangeFreeCommissionMini":0.00,"stockFreeCommissionMini":0.00,"china300FreeCommissionMini":0.00,"china50FreeCommissionMini":0.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionMini":0.00,"silverFreeCommissionMini":0.00,"crudeOilFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"btcFreeCommissionMini":0.00,"btcsFreeCommissionMini":0.00,"isNoLoad":"0","haveGroups":"0","settlementType":"3","latestStaticTime":1704954426000,"joinDailiTime":1704879616000,"commissionUpTime":1704879616000,"createDate":1704879168000,"updateDate":1704879616000},{"id":52,"platform":"60","agentId":"40001","account":"51000212","username":"siji daili","dailiAccount":"51000211","generalAgentAccount":"51000130","agentLevel":"4","agentType":"1","exchangeFreeCommission":35.63,"stockFreeCommission":0.00,"china300FreeCommission":33.33,"china50FreeCommission":26.58,"indexFreeCommission":20.77,"goldFreeCommission":36.09,"silverFreeCommission":21.89,"crudeOilFreeCommission":30.00,"britainOilFreeCommission":9.99,"btcFreeCommission":0.00,"btcsFreeCommission":8.79,"exchangeFreeCommissionEcn":0.00,"stockFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"china50FreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"goldFreeCommissionEcn":0.00,"silverFreeCommissionEcn":0.00,"crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"btcFreeCommissionEcn":0.00,"btcsFreeCommissionEcn":0.00,"exchangeFreeCommissionMini":0.00,"stockFreeCommissionMini":0.00,"china300FreeCommissionMini":0.00,"china50FreeCommissionMini":0.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionMini":0.00,"silverFreeCommissionMini":0.00,"crudeOilFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"btcFreeCommissionMini":0.00,"btcsFreeCommissionMini":0.00,"isNoLoad":"0","haveGroups":"0","settlementType":"3","latestStaticTime":1704954426000,"joinDailiTime":1704937903000,"commissionUpTime":1704937946000,"createDate":1704885378000,"updateDate":1704937946000}],"Level":"1"}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'agent/getSubordinateUserData': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":[{"exchangeFreeCommissionMini":0.00,"commissionUpTime":1704267224000,"china300FreeCommission":50.00,"agentLevel":"2","silverFreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"dailiAccount":"51000132","stockFreeCommission":50.00,"btcsFreeCommissionEcn":0.00,"id":42,"goldFreeCommission":50.00,"silverFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"joinDailiTime":1704267224000,"stockFreeCommissionMini":0.00,"isNoLoad":"0","china50FreeCommission":50.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionEcn":0.00,"exchangeFreeCommissionEcn":0.00,"agentId":"20004","updateDate":1704267224000,"agentType":"1","btcFreeCommissionMini":0.00,"btcsFreeCommission":50.00,"crudeOilFreeCommission":50.00,"crudeOilFreeCommissionMini":0.00,"indexFreeCommission":50.00,"platform":"60","generalAgentAccount":"51000130","china50FreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"haveGroups":"0","china50FreeCommissionMini":0.00,"map":{"gold":"0.00","totallots":"0.00","countnum":"1","sumBackBrokerage":"0.00","totalsettledmoney":"0.00","deposit":"0.00","netincome":"0.00","totalprofit":"0.00"},"createDate":1704267124000,"stockFreeCommissionEcn":0.00,"exchangeFreeCommission":50.00,"settlementType":"3","crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommission":50.00,"btcFreeCommission":0.00,"btcsFreeCommissionMini":0.00,"silverFreeCommission":50.00,"goldFreeCommissionMini":0.00,"btcFreeCommissionEcn":0.00,"china300FreeCommissionMini":0.00,"account":"51000208","username":"test001 test001"},{"agentId":"-1","updateDate":1703834237000,"agentType":"0","joinDailiTime":1703834237000,"commissionUpTime":1703834237000,"agentLevel":"2","platform":"60","generalAgentAccount":"51000130","isNoLoad":"0","dailiAccount":"51000132","id":40,"map":{"gold":"0.00","totallots":"0.00","countnum":"1","sumBackBrokerage":"0.00","totalsettledmoney":"0.00","deposit":"0.00","netincome":"0.00","totalprofit":"0.00"},"account":"51000206","createDate":1703834237000},{"exchangeFreeCommissionMini":0.00,"commissionUpTime":1703833100000,"china300FreeCommission":40.00,"agentLevel":"2","silverFreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"dailiAccount":"51000132","stockFreeCommission":40.00,"btcsFreeCommissionEcn":0.00,"id":39,"goldFreeCommission":40.00,"silverFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"joinDailiTime":1703833100000,"stockFreeCommissionMini":0.00,"isNoLoad":"0","china50FreeCommission":40.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionEcn":0.00,"exchangeFreeCommissionEcn":0.00,"agentId":"20003","updateDate":1703833100000,"agentType":"1","btcFreeCommissionMini":0.00,"btcsFreeCommission":40.00,"crudeOilFreeCommission":40.00,"crudeOilFreeCommissionMini":0.00,"indexFreeCommission":40.00,"platform":"60","generalAgentAccount":"51000130","china50FreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"haveGroups":"0","china50FreeCommissionMini":0.00,"map":{"gold":"0.00","totallots":"0.00","countnum":"1","sumBackBrokerage":"0.00","totalsettledmoney":"0.00","deposit":"0.00","netincome":"0.00","totalprofit":"0.00"},"createDate":1703753620000,"stockFreeCommissionEcn":0.00,"exchangeFreeCommission":40.00,"settlementType":"3","crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommission":40.00,"btcFreeCommission":0.00,"btcsFreeCommissionMini":0.00,"silverFreeCommission":40.00,"goldFreeCommissionMini":0.00,"btcFreeCommissionEcn":0.00,"china300FreeCommissionMini":0.00,"account":"51000205","username":"432432 432"},{"agentId":"-1","updateDate":1703753003000,"agentType":"0","joinDailiTime":1703753003000,"commissionUpTime":1703753003000,"agentLevel":"2","platform":"60","generalAgentAccount":"51000130","isNoLoad":"0","dailiAccount":"51000132","id":38,"map":{"gold":"0.00","totallots":"0.00","countnum":"1","sumBackBrokerage":"0.00","totalsettledmoney":"0.00","deposit":"0.00","netincome":"0.00","totalprofit":"0.00"},"account":"51000203","createDate":1703753003000},{"agentId":"-1","updateDate":1703752916000,"agentType":"0","joinDailiTime":1703752916000,"commissionUpTime":1703752916000,"agentLevel":"2","platform":"60","generalAgentAccount":"51000130","isNoLoad":"0","dailiAccount":"51000132","id":37,"map":{"gold":"0.00","totallots":"0.00","countnum":"1","sumBackBrokerage":"0.00","totalsettledmoney":"0.00","deposit":"0.00","netincome":"0.00","totalprofit":"0.00"},"account":"51000202","createDate":1703752916000},{"exchangeFreeCommissionMini":0.00,"commissionUpTime":1703727637000,"china300FreeCommission":45.00,"agentLevel":"2","silverFreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"dailiAccount":"51000132","stockFreeCommission":45.00,"btcsFreeCommissionEcn":0.00,"id":35,"goldFreeCommission":45.00,"silverFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"joinDailiTime":1703662359000,"stockFreeCommissionMini":0.00,"isNoLoad":"0","china50FreeCommission":45.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionEcn":0.00,"exchangeFreeCommissionEcn":0.00,"agentId":"20002","updateDate":1703727637000,"agentType":"1","btcFreeCommissionMini":0.00,"btcsFreeCommission":45.00,"crudeOilFreeCommission":0.00,"latestStaticTime":1704261790000,"crudeOilFreeCommissionMini":0.00,"indexFreeCommission":45.00,"platform":"60","generalAgentAccount":"51000130","china50FreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"haveGroups":"0","china50FreeCommissionMini":0.00,"map":{"gold":"1555.00","totallots":"6.67","countnum":"1","sumBackBrokerage":"0.00","totalsettledmoney":"300.15","deposit":"5000.00","netincome":"3445.00","totalprofit":"-2286.82"},"createDate":1703662259000,"stockFreeCommissionEcn":0.00,"exchangeFreeCommission":45.00,"settlementType":"3","crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommission":45.00,"btcFreeCommission":0.00,"btcsFreeCommissionMini":0.00,"silverFreeCommission":45.00,"goldFreeCommissionMini":0.00,"btcFreeCommissionEcn":0.00,"china300FreeCommissionMini":0.00,"account":"51000196","username":"jock lvous"},{"exchangeFreeCommissionMini":0.00,"commissionUpTime":1702003999000,"china300FreeCommission":4.00,"agentLevel":"2","silverFreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"dailiAccount":"51000132","stockFreeCommission":2.00,"btcsFreeCommissionEcn":0.00,"id":27,"goldFreeCommission":3.00,"silverFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"joinDailiTime":1702003999000,"stockFreeCommissionMini":0.00,"isNoLoad":"0","china50FreeCommission":4.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionEcn":0.00,"exchangeFreeCommissionEcn":0.00,"agentId":"20001","updateDate":1702003999000,"agentType":"1","btcFreeCommissionMini":0.00,"btcsFreeCommission":4.00,"crudeOilFreeCommission":4.00,"crudeOilFreeCommissionMini":0.00,"indexFreeCommission":4.00,"platform":"60","generalAgentAccount":"51000130","china50FreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"haveGroups":"0","china50FreeCommissionMini":0.00,"map":{"gold":"0.00","totallots":"0.00","countnum":"1","sumBackBrokerage":"0.00","totalsettledmoney":"0.00","deposit":"0.00","netincome":"0.00","totalprofit":"0.00"},"createDate":1702003219000,"stockFreeCommissionEcn":0.00,"exchangeFreeCommission":1.00,"settlementType":"3","crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommission":4.00,"btcFreeCommission":0.00,"btcsFreeCommissionMini":0.00,"silverFreeCommission":4.00,"goldFreeCommissionMini":0.00,"btcFreeCommissionEcn":0.00,"china300FreeCommissionMini":0.00,"account":"51000166","username":"fed df"},{"exchangeFreeCommissionMini":0.00,"commissionUpTime":1703559729000,"china300FreeCommission":45.00,"agentLevel":"1","silverFreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"dailiAccount":"51000130","stockFreeCommission":45.00,"btcsFreeCommissionEcn":0.00,"id":33,"goldFreeCommission":45.00,"silverFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"joinDailiTime":1703559729000,"stockFreeCommissionMini":0.00,"isNoLoad":"0","china50FreeCommission":45.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionEcn":0.00,"exchangeFreeCommissionEcn":0.00,"agentId":"10008","updateDate":1703559729000,"agentType":"1","btcFreeCommissionMini":0.00,"btcsFreeCommission":45.00,"crudeOilFreeCommission":45.00,"crudeOilFreeCommissionMini":0.00,"indexFreeCommission":45.00,"platform":"60","generalAgentAccount":"51000130","china50FreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"haveGroups":"0","china50FreeCommissionMini":0.00,"map":{"gold":"0.00","totallots":"0.00","countnum":"1","sumBackBrokerage":"0.00","totalsettledmoney":"0.00","deposit":"0.00","netincome":"0.00","totalprofit":"0.00"},"createDate":1703233324000,"stockFreeCommissionEcn":0.00,"exchangeFreeCommission":45.00,"settlementType":"3","crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommission":45.00,"btcFreeCommission":0.00,"btcsFreeCommissionMini":0.00,"silverFreeCommission":45.00,"goldFreeCommissionMini":0.00,"btcFreeCommissionEcn":0.00,"china300FreeCommissionMini":0.00,"account":"51000188"},{"exchangeFreeCommissionMini":0.00,"commissionUpTime":1703559618000,"china300FreeCommission":1.00,"agentLevel":"1","silverFreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"dailiAccount":"51000130","stockFreeCommission":1.00,"btcsFreeCommissionEcn":0.00,"id":29,"goldFreeCommission":1.00,"silverFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"joinDailiTime":1703559618000,"stockFreeCommissionMini":0.00,"isNoLoad":"0","china50FreeCommission":1.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionEcn":0.00,"exchangeFreeCommissionEcn":0.00,"agentId":"10007","updateDate":1703559618000,"agentType":"1","btcFreeCommissionMini":0.00,"btcsFreeCommission":1.00,"crudeOilFreeCommission":1.00,"crudeOilFreeCommissionMini":0.00,"indexFreeCommission":1.00,"platform":"60","generalAgentAccount":"51000130","china50FreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"haveGroups":"0,8","china50FreeCommissionMini":0.00,"map":{"gold":"0.00","totallots":"0.00","countnum":"1","sumBackBrokerage":"0.00","totalsettledmoney":"0.00","deposit":"0.00","netincome":"0.00","totalprofit":"0.00"},"createDate":1702632686000,"stockFreeCommissionEcn":0.00,"exchangeFreeCommission":1.00,"settlementType":"3","crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommission":1.00,"btcFreeCommission":0.00,"btcsFreeCommissionMini":0.00,"silverFreeCommission":1.00,"goldFreeCommissionMini":0.00,"btcFreeCommissionEcn":0.00,"china300FreeCommissionMini":0.00,"account":"51000181"},{"exchangeFreeCommissionMini":0.00,"commissionUpTime":1703559401000,"china300FreeCommission":1.00,"agentLevel":"1","silverFreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"dailiAccount":"51000130","stockFreeCommission":1.00,"btcsFreeCommissionEcn":0.00,"id":34,"goldFreeCommission":1.00,"silverFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"joinDailiTime":1703559401000,"stockFreeCommissionMini":0.00,"isNoLoad":"0","china50FreeCommission":1.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionEcn":0.00,"exchangeFreeCommissionEcn":0.00,"agentId":"10006","updateDate":1703559401000,"agentType":"1","btcFreeCommissionMini":0.00,"btcsFreeCommission":1.00,"crudeOilFreeCommission":1.00,"crudeOilFreeCommissionMini":0.00,"indexFreeCommission":1.00,"platform":"60","generalAgentAccount":"51000130","china50FreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"haveGroups":"0,8","china50FreeCommissionMini":0.00,"map":{"gold":"0.00","totallots":"0.00","countnum":"1","sumBackBrokerage":"0.00","totalsettledmoney":"0.00","deposit":"0.00","netincome":"0.00","totalprofit":"0.00"},"createDate":1703495276000,"stockFreeCommissionEcn":0.00,"exchangeFreeCommission":1.00,"settlementType":"3","crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommission":1.00,"btcFreeCommission":0.00,"btcsFreeCommissionMini":0.00,"silverFreeCommission":1.00,"goldFreeCommissionMini":0.00,"btcFreeCommissionEcn":0.00,"china300FreeCommissionMini":0.00,"account":"51000189","username":"lee xlu"},{"exchangeFreeCommissionMini":0.00,"commissionUpTime":1703558769000,"china300FreeCommission":1.00,"agentLevel":"1","silverFreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"dailiAccount":"51000130","stockFreeCommission":1.00,"btcsFreeCommissionEcn":0.00,"id":26,"goldFreeCommission":1.00,"silverFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"joinDailiTime":1703558769000,"stockFreeCommissionMini":0.00,"isNoLoad":"0","china50FreeCommission":1.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionEcn":0.00,"exchangeFreeCommissionEcn":0.00,"agentId":"10005","updateDate":1703558769000,"agentType":"1","btcFreeCommissionMini":0.00,"btcsFreeCommission":1.00,"crudeOilFreeCommission":1.00,"crudeOilFreeCommissionMini":0.00,"indexFreeCommission":1.00,"platform":"60","generalAgentAccount":"51000130","china50FreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"haveGroups":"0","china50FreeCommissionMini":0.00,"map":{"gold":"0.00","totallots":"0.00","countnum":"1","sumBackBrokerage":"0.00","totalsettledmoney":"0.00","deposit":"0.00","netincome":"0.00","totalprofit":"0.00"},"createDate":1701915661000,"stockFreeCommissionEcn":0.00,"exchangeFreeCommission":1.00,"settlementType":"3","crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommission":1.00,"btcFreeCommission":0.00,"btcsFreeCommissionMini":0.00,"silverFreeCommission":1.00,"goldFreeCommissionMini":0.00,"btcFreeCommissionEcn":0.00,"china300FreeCommissionMini":0.00,"account":"51000165","username":"YT SD"},{"agentId":"-1","updateDate":1703225659000,"agentType":"0","joinDailiTime":1703225659000,"commissionUpTime":1703225659000,"agentLevel":"1","platform":"60","generalAgentAccount":"51000130","isNoLoad":"0","dailiAccount":"51000130","id":32,"map":{"gold":"0.00","totallots":"0.00","countnum":"1","sumBackBrokerage":"0.00","totalsettledmoney":"0.00","deposit":"0.00","netincome":"0.00","totalprofit":"0.00"},"account":"51000187","createDate":1703225659000},{"agentId":"-1","updateDate":1702633571000,"agentType":"0","joinDailiTime":1702633571000,"commissionUpTime":1702633571000,"agentLevel":"1","platform":"60","generalAgentAccount":"51000130","isNoLoad":"0","dailiAccount":"51000130","id":31,"map":{"gold":"0.00","totallots":"0.00","countnum":"1","sumBackBrokerage":"0.00","totalsettledmoney":"0.00","deposit":"0.00","netincome":"0.00","totalprofit":"0.00"},"account":"51000183","createDate":1702633571000},{"agentId":"-1","updateDate":1702633219000,"agentType":"0","joinDailiTime":1702633219000,"commissionUpTime":1702633219000,"agentLevel":"1","platform":"60","generalAgentAccount":"51000130","isNoLoad":"0","dailiAccount":"51000130","id":30,"map":{"gold":"0.00","totallots":"0.00","countnum":"1","sumBackBrokerage":"0.00","totalsettledmoney":"0.00","deposit":"0.00","netincome":"0.00","totalprofit":"0.00"},"account":"51000182","createDate":1702633219000},{"exchangeFreeCommissionMini":0.00,"commissionUpTime":1701853608000,"china300FreeCommission":50.00,"agentLevel":"1","silverFreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"dailiAccount":"51000130","stockFreeCommission":50.00,"btcsFreeCommissionEcn":0.00,"id":23,"goldFreeCommission":50.00,"silverFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"joinDailiTime":1701853608000,"stockFreeCommissionMini":0.00,"isNoLoad":"0","china50FreeCommission":50.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionEcn":0.00,"exchangeFreeCommissionEcn":0.00,"agentId":"10004","updateDate":1701853608000,"agentType":"1","btcFreeCommissionMini":0.00,"btcsFreeCommission":50.00,"crudeOilFreeCommission":50.00,"latestStaticTime":1704261790000,"crudeOilFreeCommissionMini":0.00,"indexFreeCommission":5000.00,"platform":"60","generalAgentAccount":"51000130","china50FreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"haveGroups":"0","china50FreeCommissionMini":0.00,"map":{"gold":"1555.00","totallots":"10.18","countnum":"8","sumBackBrokerage":"0.00","totalsettledmoney":"5459.00","deposit":"10000.00","netincome":"8445.00","totalprofit":"-2390.33"},"createDate":1701756607000,"stockFreeCommissionEcn":0.00,"exchangeFreeCommission":50.00,"settlementType":"3","crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommission":50.00,"btcFreeCommission":0.00,"btcsFreeCommissionMini":0.00,"silverFreeCommission":50.00,"goldFreeCommissionMini":0.00,"btcFreeCommissionEcn":0.00,"china300FreeCommissionMini":0.00,"account":"51000132","username":""},{"exchangeFreeCommissionMini":0.00,"commissionUpTime":1701853184000,"china300FreeCommission":50.00,"agentLevel":"1","silverFreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"dailiAccount":"51000130","stockFreeCommission":50.00,"btcsFreeCommissionEcn":0.00,"id":25,"goldFreeCommission":50.00,"silverFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"joinDailiTime":1701853184000,"stockFreeCommissionMini":0.00,"isNoLoad":"0","china50FreeCommission":50.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionEcn":0.00,"exchangeFreeCommissionEcn":0.00,"agentId":"10003","updateDate":1701853184000,"agentType":"1","btcFreeCommissionMini":0.00,"btcsFreeCommission":50.00,"crudeOilFreeCommission":50.00,"crudeOilFreeCommissionMini":0.00,"indexFreeCommission":50.00,"platform":"60","generalAgentAccount":"51000130","china50FreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"haveGroups":"0","china50FreeCommissionMini":0.00,"map":{"gold":"0.00","totallots":"0.00","countnum":"1","sumBackBrokerage":"0.00","totalsettledmoney":"0.00","deposit":"0.00","netincome":"0.00","totalprofit":"0.00"},"createDate":1701852949000,"stockFreeCommissionEcn":0.00,"exchangeFreeCommission":50.00,"settlementType":"3","crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommission":50.00,"btcFreeCommission":0.00,"btcsFreeCommissionMini":0.00,"silverFreeCommission":50.00,"goldFreeCommissionMini":0.00,"btcFreeCommissionEcn":0.00,"china300FreeCommissionMini":0.00,"account":"51000164"},{"exchangeFreeCommissionMini":0.00,"commissionUpTime":1701829164000,"china300FreeCommission":3.00,"agentLevel":"1","silverFreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"dailiAccount":"51000130","stockFreeCommission":2.00,"btcsFreeCommissionEcn":0.00,"id":24,"goldFreeCommission":6.00,"silverFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"joinDailiTime":1701829164000,"stockFreeCommissionMini":0.00,"isNoLoad":"0","china50FreeCommission":4.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionEcn":0.00,"exchangeFreeCommissionEcn":0.00,"agentId":"10002","updateDate":1701829164000,"agentType":"1","btcFreeCommissionMini":0.00,"btcsFreeCommission":10.00,"crudeOilFreeCommission":8.00,"crudeOilFreeCommissionMini":0.00,"indexFreeCommission":5.00,"platform":"60","generalAgentAccount":"51000130","china50FreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"haveGroups":"0","china50FreeCommissionMini":0.00,"map":{"gold":"0.00","totallots":"0.00","countnum":"1","sumBackBrokerage":"0.00","totalsettledmoney":"0.00","deposit":"0.00","netincome":"0.00","totalprofit":"0.00"},"createDate":1701767807000,"stockFreeCommissionEcn":0.00,"exchangeFreeCommission":1.00,"settlementType":"3","crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommission":9.00,"btcFreeCommission":0.00,"btcsFreeCommissionMini":0.00,"silverFreeCommission":7.00,"goldFreeCommissionMini":0.00,"btcFreeCommissionEcn":0.00,"china300FreeCommissionMini":0.00,"account":"51000137","username":"1223 232"},{"exchangeFreeCommissionMini":0.00,"commissionUpTime":1703497580000,"china300FreeCommission":41.00,"agentLevel":"1","silverFreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"dailiAccount":"51000130","stockFreeCommission":40.00,"btcsFreeCommissionEcn":0.00,"id":22,"goldFreeCommission":44.00,"silverFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"joinDailiTime":1701759366000,"stockFreeCommissionMini":0.00,"isNoLoad":"0","china50FreeCommission":42.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionEcn":0.00,"exchangeFreeCommissionEcn":0.00,"agentId":"10001","updateDate":1703497580000,"agentType":"1","btcFreeCommissionMini":0.00,"btcsFreeCommission":47.00,"crudeOilFreeCommission":46.00,"crudeOilFreeCommissionMini":0.00,"indexFreeCommission":43.00,"platform":"60","generalAgentAccount":"51000130","china50FreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"haveGroups":"0,8","china50FreeCommissionMini":0.00,"map":{"gold":"0.00","totallots":"0.00","countnum":"1","sumBackBrokerage":"0.00","totalsettledmoney":"0.00","deposit":"0.00","netincome":"0.00","totalprofit":"0.00"},"createDate":1701756530000,"stockFreeCommissionEcn":0.00,"exchangeFreeCommission":30.00,"settlementType":"3","crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommission":47.00,"btcFreeCommission":0.00,"btcsFreeCommissionMini":0.00,"silverFreeCommission":45.00,"goldFreeCommissionMini":0.00,"btcFreeCommissionEcn":0.00,"china300FreeCommissionMini":0.00,"account":"51000131"}]}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'agent/reports/positionDetail': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":{"statistic":{"margin":0,"riskValue":0,"balance":0,"equity":0,"marginFree":0},"page":{"count":2,"list":[{"Comment":" ","Symbol":"ETHUSDT","Commission":0.000000,"StopLoss":0.000000,"Login":51000196,"OrderId":6144,"OrderSwaps":0.000000,"Lot":0.03,"OpenTime":1704420814000,"TakeProfit":0.000000,"Command":"OP_BUY","Volume":3,"OpenPrice":2243.010000,"name":"jock lvous","is_no_load":"0"},{"Comment":" ","Symbol":"DOTUSDT","Commission":0.000000,"StopLoss":0.000000,"Login":51000196,"OrderId":6014,"OrderSwaps":-0.750000,"Lot":0.05,"OpenTime":1704262538000,"TakeProfit":0.000000,"Command":"OP_BUY","Volume":5,"OpenPrice":8.508800,"name":"jock lvous","is_no_load":"0"}]}}}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'agent/reports/closeOrderDetail': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":{"statistic":{"Message":"","IsSuccess":true,"Data":{"all":{"USOIL":0.0500,"indexSymbols":1.1500,"exchangeSymbols":3.0300,"btcSymbols":2.0800,"UKOIL":1.0000,"CH50":0.7000,"CH300":0.0400},"allTotalProfit":-2329.8700}},"page":{"count":5,"list":[{"Comment":" ","Symbol":"BTCUSDT","Commission":0.000000,"StopLoss":42668.400000,"Login":51000196,"OrderId":14859,"ClosePrice":43530.400000,"OrderSwaps":-0.270000,"Lot":0.01,"OpenTime":1704262514000,"TakeProfit":44676.700000,"Command":"OP_BUY","Volume":1,"CloseTime":1704421273000,"OpenPrice":45215.230000,"name":"jock lvous","Profit":-16.850000,"is_no_load":"0"},{"Comment":" ","Symbol":"CHINA300","Commission":0.000000,"StopLoss":0.000000,"Login":51000196,"OrderId":14857,"ClosePrice":3358.300000,"OrderSwaps":0.000000,"Lot":0.04,"OpenTime":1704418839000,"TakeProfit":0.000000,"Command":"OP_BUY","Volume":4,"CloseTime":1704418845000,"OpenPrice":3360.600000,"name":"jock lvous","Profit":-3.850000,"is_no_load":"0"},{"Comment":" ","Symbol":"SANDUSDT","Commission":0.000000,"StopLoss":0.000000,"Login":51000196,"OrderId":14853,"ClosePrice":0.521000,"OrderSwaps":0.000000,"Lot":0.06,"OpenTime":1704370416000,"TakeProfit":0.000000,"Command":"OP_BUY","Volume":6,"CloseTime":1704370423000,"OpenPrice":0.521100,"name":"jock lvous","Profit":-0.120000,"is_no_load":"0"},{"Comment":" ","Symbol":"LTCUSDT","Commission":0.000000,"StopLoss":0.000000,"Login":51000196,"OrderId":14851,"ClosePrice":65.090000,"OrderSwaps":0.000000,"Lot":1.0,"OpenTime":1704370135000,"TakeProfit":0.000000,"Command":"OP_BUY","Volume":100,"CloseTime":1704370143000,"OpenPrice":65.100000,"name":"jock lvous","Profit":-5.000000,"is_no_load":"0"},{"Comment":" ","Symbol":"US500","Commission":0.000000,"StopLoss":0.000000,"Login":51000196,"OrderId":14849,"ClosePrice":4703.100000,"OrderSwaps":0.000000,"Lot":0.06,"OpenTime":1704369925000,"TakeProfit":0.000000,"Command":"OP_BUY","Volume":6,"CloseTime":1704369990000,"OpenPrice":4704.700000,"name":"jock lvous","Profit":-4.800000,"is_no_load":"0"}]}}}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'agent/tradeInfoDetail': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":{"settmentOverview":{"generalAgentStatic":0,"goldCountStatic":0,"silverCountStatic":0,"oilCountStatic":0.05,"britainOilCountStatic":1.00,"exchangeCountStatic":3.03,"stockCountStatic":0,"indexCountStatic":1.15,"china300CountStatic":0.04,"china50CountStatic":0.70,"btcCountStatic":0,"btcsCountStatic":2.08,"totalRebateMoney":0,"alreadySettledMoney":300.15,"unsettledMoney":0.00,"sumBackBrokerage":0.00,"sumLot":0,"backPointNum":0,"backBrokerageNum":0},"count":17,"tradeInfo":[{"close_time":1704421273000,"account_commission":0.00,"isNoLoad":"0","command":"OP_BUY","username":"jock lvous","account_can_gain_comm":0.00,"backBrokerage":0.00,"daliName":"","order_id":"14859","lot":0.01,"symbol":"BTCUSDT","account":"51000196","updateDate":1704421407000,"isSettlement":"未结算"},{"order_id":"14857","account_commission":0.00,"isNoLoad":"0","command":"OP_BUY","username":"jock lvous","close_time":1704418845000,"account_can_gain_comm":0.00,"backBrokerage":0.00,"daliName":"","lot":0.04,"symbol":"CHINA300","account":"51000196","updateDate":1704418887000,"isSettlement":"未结算"},{"account_commission":0.00,"isNoLoad":"0","order_id":"14853","command":"OP_BUY","symbol":"SANDUSDT","username":"jock lvous","account_can_gain_comm":0.00,"backBrokerage":0.00,"lot":0.06,"daliName":"","updateDate":1704370579000,"account":"51000196","close_time":1704370423000,"isSettlement":"未结算"},{"symbol":"LTCUSDT","account_commission":0.00,"isNoLoad":"0","command":"OP_BUY","order_id":"14851","username":"jock lvous","account_can_gain_comm":0.00,"backBrokerage":0.00,"daliName":"","lot":1.00,"account":"51000196","close_time":1704370143000,"isSettlement":"未结算","updateDate":1704370218000},{"updateDate":1704370098000,"symbol":"US500","account_commission":0.00,"isNoLoad":"0","command":"OP_BUY","username":"jock lvous","account_can_gain_comm":0.00,"close_time":1704369990000,"backBrokerage":0.00,"lot":0.06,"daliName":"","order_id":"14849","account":"51000196","isSettlement":"未结算"},{"close_time":1704369987000,"symbol":"EURJPY","account_commission":0.00,"isNoLoad":"0","command":"OP_BUY","username":"jock lvous","account_can_gain_comm":0.00,"backBrokerage":0.00,"daliName":"","order_id":"14848","lot":0.03,"account":"51000196","updateDate":1704370097000,"isSettlement":"未结算"},{"symbol":"USOIL","account_commission":0.00,"isNoLoad":"0","command":"OP_BUY","username":"jock lvous","account_can_gain_comm":0.00,"backBrokerage":0.00,"daliName":"","lot":0.05,"order_id":"14847","account":"51000196","close_time":1704369984000,"updateDate":1704370097000,"isSettlement":"未结算"},{"order_id":"14846","account_commission":0.00,"isNoLoad":"0","command":"OP_BUY","symbol":"CHA50","username":"jock lvous","account_can_gain_comm":0.00,"backBrokerage":0.00,"daliName":"","lot":0.04,"close_time":1704369977000,"account":"51000196","updateDate":1704370097000,"isSettlement":"未结算"},{"order_id":"14845","symbol":"US500","account_commission":0.00,"isNoLoad":"0","command":"OP_BUY","username":"jock lvous","account_can_gain_comm":0.00,"lot":0.09,"backBrokerage":0.00,"daliName":"","updateDate":1704370096000,"close_time":1704369973000,"account":"51000196","isSettlement":"未结算"},{"account_can_gain_comm":29.70,"isNoLoad":"0","command":"OP_BUY","isSettlement":"已结算","symbol":"CHA50","username":"jock lvous","backBrokerage":0.00,"updateDate":1704261857000,"order_id":"14708","daliName":"","account_commission":45.00,"lot":0.66,"account":"51000196","close_time":1704261790000}]}}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'commissionManage/electronicWallet': {
        result: {
          content: '{"Status":"0","IsSuccess":true,"Data":{"settlementType":"3","balance":"5000.00","account":"51000132"}}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'commissionManage/tradeInfoDetails': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":{"settmentOverview":{"generalAgentStatic":0,"goldCountStatic":0,"silverCountStatic":0,"oilCountStatic":0.05,"britainOilCountStatic":1.00,"exchangeCountStatic":5.53,"stockCountStatic":0,"indexCountStatic":1.15,"china300CountStatic":0.09,"china50CountStatic":1.76,"btcCountStatic":0,"btcsCountStatic":3.61,"totalRebateMoney":0,"alreadySettledMoney":5158.85,"unsettledMoney":0.00,"sumBackBrokerage":0.00,"sumLot":0,"backPointNum":0,"backBrokerageNum":0},"count":27,"tradeInfo":[{"order_id":"14867","username":"test001 test001","account_commission":0.00,"isNoLoad":"0","command":"OP_BUY","updateDate":1704424889000,"account_can_gain_comm":0.00,"backBrokerage":0.00,"daliName":"","close_time":1704424773000,"lot":0.03,"account":"51000132","symbol":"BCHUSDT","isSettlement":"未结算"},{"order_id":"14866","username":"test001 test001","account_commission":0.00,"isNoLoad":"0","updateDate":1704424769000,"symbol":"CHA50","account_can_gain_comm":0.00,"backBrokerage":0.00,"daliName":"","lot":0.05,"command":"OP_SELL","account":"51000132","close_time":1704424730000,"isSettlement":"未结算"},{"username":"test001 test001","account_commission":0.00,"isNoLoad":"0","order_id":"14864","command":"OP_BUY","updateDate":1704424769000,"account_can_gain_comm":0.00,"backBrokerage":0.00,"daliName":"","lot":0.05,"account":"51000132","symbol":"CHINA300","close_time":1704424715000,"isSettlement":"未结算"},{"username":"test001 test001","account_commission":0.00,"isNoLoad":"0","order_id":"14862","close_time":1704424582000,"account_can_gain_comm":0.00,"backBrokerage":0.00,"daliName":"","lot":1.00,"updateDate":1704424648000,"command":"OP_SELL","account":"51000132","symbol":"BCHUSDT","isSettlement":"未结算"},{"close_time":1704421273000,"account_commission":0.00,"isNoLoad":"0","command":"OP_BUY","username":"jock lvous","account_can_gain_comm":0.00,"backBrokerage":0.00,"daliName":"","order_id":"14859","lot":0.01,"account":"51000132","symbol":"BTCUSDT","updateDate":1704421407000,"isSettlement":"未结算"},{"order_id":"14857","account_commission":0.00,"isNoLoad":"0","command":"OP_BUY","username":"jock lvous","close_time":1704418845000,"account_can_gain_comm":0.00,"backBrokerage":0.00,"daliName":"","lot":0.04,"account":"51000132","symbol":"CHINA300","updateDate":1704418887000,"isSettlement":"未结算"},{"account_commission":0.00,"isNoLoad":"0","order_id":"14853","command":"OP_BUY","symbol":"SANDUSDT","username":"jock lvous","account_can_gain_comm":0.00,"backBrokerage":0.00,"lot":0.06,"daliName":"","account":"51000132","updateDate":1704370579000,"close_time":1704370423000,"isSettlement":"未结算"},{"symbol":"LTCUSDT","account_commission":0.00,"isNoLoad":"0","command":"OP_BUY","order_id":"14851","username":"jock lvous","account_can_gain_comm":0.00,"backBrokerage":0.00,"daliName":"","lot":1.00,"account":"51000132","close_time":1704370143000,"isSettlement":"未结算","updateDate":1704370218000},{"updateDate":1704370098000,"symbol":"US500","account_commission":0.00,"isNoLoad":"0","command":"OP_BUY","username":"jock lvous","account_can_gain_comm":0.00,"close_time":1704369990000,"backBrokerage":0.00,"lot":0.06,"daliName":"","order_id":"14849","account":"51000132","isSettlement":"未结算"},{"close_time":1704369987000,"updateDate":1704370098000,"symbol":"EURJPY","account_commission":0.00,"isNoLoad":"0","command":"OP_BUY","username":"jock lvous","account_can_gain_comm":0.00,"backBrokerage":0.00,"daliName":"","order_id":"14848","lot":0.03,"account":"51000132","isSettlement":"未结算"}]}}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'agent/getGroupsAndBackPoint': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":{"id":23,"platform":"60","agentId":"10004","account":"51000132","username":"","dailiAccount":"51000130","generalAgentAccount":"51000130","agentLevel":"1","agentType":"1","exchangeFreeCommission":50.00,"stockFreeCommission":50.00,"china300FreeCommission":50.00,"china50FreeCommission":50.00,"indexFreeCommission":5000.00,"goldFreeCommission":50.00,"silverFreeCommission":50.00,"crudeOilFreeCommission":50.00,"britainOilFreeCommission":50.00,"btcFreeCommission":0.00,"btcsFreeCommission":50.00,"exchangeFreeCommissionEcn":0.00,"stockFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"china50FreeCommissionEcn":0.00,"indexFreeCommissionEcn":0.00,"goldFreeCommissionEcn":0.00,"silverFreeCommissionEcn":0.00,"crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommissionEcn":0.00,"btcFreeCommissionEcn":0.00,"btcsFreeCommissionEcn":0.00,"exchangeFreeCommissionMini":0.00,"stockFreeCommissionMini":0.00,"china300FreeCommissionMini":0.00,"china50FreeCommissionMini":0.00,"indexFreeCommissionMini":0.00,"goldFreeCommissionMini":0.00,"silverFreeCommissionMini":0.00,"crudeOilFreeCommissionMini":0.00,"britainOilFreeCommissionMini":0.00,"btcFreeCommissionMini":0.00,"btcsFreeCommissionMini":0.00,"isNoLoad":"0","haveGroups":"0","settlementType":"3","latestStaticTime":1704261790000,"joinDailiTime":1701853608000,"commissionUpTime":1701853608000,"createDate":1701756607000,"updateDate":1701853608000}}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'agent/reports/userPositionsCount': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":{"totalTransactions":4,"totalUsers":3,"totalProfit":0,"totalLots":"0.59","page":{"PageSize":10,"count":4,"PageNo":1,"content":[{"Comment":" ","Symbol":"BTCUSDT","Commission":0.000000,"StopLoss":0.000000,"Login":51000208,"OrderId":6162,"OrderSwaps":0.000000,"Lot":0.01,"OpenTime":1704437734000,"TakeProfit":0.000000,"Command":"OP_BUY","Volume":1,"OpenPrice":43854.200000,"name":"test001 test001","is_no_load":"0"},{"Comment":" ","Symbol":"ETHUSDT","Commission":0.000000,"StopLoss":0.000000,"Login":51000196,"OrderId":6144,"OrderSwaps":0.000000,"Lot":0.03,"OpenTime":1704420814000,"TakeProfit":0.000000,"Command":"OP_BUY","Volume":3,"OpenPrice":2243.010000,"name":"jock lvous","is_no_load":"0"},{"Comment":" ","Symbol":"BTCUSDT","Commission":0.000000,"StopLoss":0.000000,"Login":51000208,"OrderId":6022,"OrderSwaps":0.000000,"Lot":0.5,"OpenTime":1704332970000,"TakeProfit":0.000000,"Command":"OP_BUY","Volume":50,"OpenPrice":42752.190000,"name":"test001 test001","is_no_load":"0"},{"Comment":" ","Symbol":"DOTUSDT","Commission":0.000000,"StopLoss":0.000000,"Login":51000196,"OrderId":6014,"OrderSwaps":-0.750000,"Lot":0.05,"OpenTime":1704262538000,"TakeProfit":0.000000,"Command":"OP_BUY","Volume":5,"OpenPrice":8.508800,"name":"jock lvous","is_no_load":"0"}]}}}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'agent/reports/userClosePositionsCount': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":{"totalTransactions":22,"totalUsers":18,"totalProfit":-2371.7000,"totalLots":9.6800,"page":{"PageSize":10,"count":22,"PageNo":1,"content":[{"Comment":"[sl 235.28]","Symbol":"BCHUSDT","Commission":0.000000,"Login":51000208,"OrderId":14867,"ClosePrice":235.260000,"OrderSwaps":0.000000,"Lot":0.03,"OpenTime":1704424557000,"Command":"OP_BUY","Volume":3,"CloseTime":1704424773000,"OpenPrice":235.350000,"name":"test001 test001","Profit":-0.540000,"is_no_load":"0"},{"Comment":" ","Symbol":"CHA50","Commission":0.000000,"Login":51000208,"OrderId":14866,"ClosePrice":11285.800000,"OrderSwaps":0.000000,"Lot":0.05,"OpenTime":1704424725000,"Command":"OP_SELL","Volume":5,"CloseTime":1704424730000,"OpenPrice":11278.800000,"name":"test001 test001","Profit":-3.500000,"is_no_load":"0"},{"Comment":" ","Symbol":"CHINA300","Commission":0.000000,"Login":51000208,"OrderId":14864,"ClosePrice":3361.300000,"OrderSwaps":0.000000,"Lot":0.05,"OpenTime":1704424697000,"Command":"OP_BUY","Volume":5,"CloseTime":1704424715000,"OpenPrice":3363.500000,"name":"test001 test001","Profit":-4.600000,"is_no_load":"0"},{"Comment":" ","Symbol":"BCHUSDT","Commission":0.000000,"Login":51000208,"OrderId":14862,"ClosePrice":235.520000,"OrderSwaps":0.000000,"Lot":1.0,"OpenTime":1704424575000,"Command":"OP_SELL","Volume":100,"CloseTime":1704424582000,"OpenPrice":235.360000,"name":"test001 test001","Profit":-32.000000,"is_no_load":"0"},{"Comment":" ","Symbol":"BTCUSDT","Commission":0.000000,"Login":51000196,"OrderId":14859,"ClosePrice":43530.400000,"OrderSwaps":-0.270000,"Lot":0.01,"OpenTime":1704262514000,"Command":"OP_BUY","Volume":1,"CloseTime":1704421273000,"OpenPrice":45215.230000,"name":"jock lvous","Profit":-16.850000,"is_no_load":"0"},{"Comment":" ","Symbol":"CHINA300","Commission":0.000000,"Login":51000196,"OrderId":14857,"ClosePrice":3358.300000,"OrderSwaps":0.000000,"Lot":0.04,"OpenTime":1704418839000,"Command":"OP_BUY","Volume":4,"CloseTime":1704418845000,"OpenPrice":3360.600000,"name":"jock lvous","Profit":-3.850000,"is_no_load":"0"},{"Comment":" ","Symbol":"SANDUSDT","Commission":0.000000,"Login":51000196,"OrderId":14853,"ClosePrice":0.521000,"OrderSwaps":0.000000,"Lot":0.06,"OpenTime":1704370416000,"Command":"OP_BUY","Volume":6,"CloseTime":1704370423000,"OpenPrice":0.521100,"name":"jock lvous","Profit":-0.120000,"is_no_load":"0"},{"Comment":" ","Symbol":"LTCUSDT","Commission":0.000000,"Login":51000196,"OrderId":14851,"ClosePrice":65.090000,"OrderSwaps":0.000000,"Lot":1.0,"OpenTime":1704370135000,"Command":"OP_BUY","Volume":100,"CloseTime":1704370143000,"OpenPrice":65.100000,"name":"jock lvous","Profit":-5.000000,"is_no_load":"0"},{"Comment":" ","Symbol":"US500","Commission":0.000000,"Login":51000196,"OrderId":14849,"ClosePrice":4703.100000,"OrderSwaps":0.000000,"Lot":0.06,"OpenTime":1704369925000,"Command":"OP_BUY","Volume":6,"CloseTime":1704369990000,"OpenPrice":4704.700000,"name":"jock lvous","Profit":-4.800000,"is_no_load":"0"},{"Comment":" ","Symbol":"EURJPY","Commission":0.000000,"Login":51000196,"OrderId":14848,"ClosePrice":157.818000,"OrderSwaps":0.000000,"Lot":0.03,"OpenTime":1704369881000,"Command":"OP_BUY","Volume":3,"CloseTime":1704369987000,"OpenPrice":157.903000,"name":"jock lvous","Profit":-1.770000,"is_no_load":"0"}]}}}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'agent/reports/bankrollCountnew': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":{"cdeposit":1,"gold":-1555,"cgold":2,"withdrawDeposits":[{"amount":5000,"orderid":"14593","time":"2023-12-27 16:19:12","type":"入金","account":"51000196","is_no_load":"0","username":"jock lvous"},{"amount":-1500,"orderid":"14616","time":"2023-12-28 17:16:10","type":"出金","account":"51000196","is_no_load":"0","username":"jock lvous"},{"amount":-55,"orderid":"14621","time":"2023-12-28 17:39:46","type":"出金","account":"51000196","is_no_load":"0","username":"jock lvous"}],"deposit":5000,"commission":0,"ccommission":0}}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'agent/reports/bankrollInfo': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":{"gold":-12,"withdrawDeposits":[{"amount":5000,"orderid":"14920","time":"2024-01-09 11:39:39","type":"1","account":"51000210","is_no_load":"0","username":"opsd mdlu"},{"amount":-12,"orderid":"14923","time":"2024-01-09 11:53:45","type":"2","account":"51000210","is_no_load":"0","username":"opsd mdlu"}],"deposit":5000,"netincome":4988}}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'agent/reports/tradeCount': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":{"orderPeople":2,"total":7,"profitTotal":"-2371.70","lotTotal":"9.68","list":[{"exchangeLot":0,"indexLot":0,"btcLot":0,"china300Lot":0,"lot":0,"btcsLot":0,"stockLot":0,"name":"fed df","china50Lot":0,"oilLot":0,"goldLot":0,"ukoilLot":0,"profit":0,"account":"51000166","silverLot":0},{"exchangeLot":3.03,"indexLot":1.15,"btcLot":0,"china300Lot":0.04,"lot":8.05,"btcsLot":2.08,"stockLot":0,"name":"jock lvous","china50Lot":0.70,"oilLot":0.05,"goldLot":0,"ukoilLot":1.00,"profit":-2329.87,"account":"51000196","silverLot":0},{"exchangeLot":0,"indexLot":0,"btcLot":0,"china300Lot":0,"lot":0,"btcsLot":0,"stockLot":0,"china50Lot":0,"oilLot":0,"goldLot":0,"ukoilLot":0,"profit":0,"account":"51000202","silverLot":0},{"exchangeLot":0,"indexLot":0,"btcLot":0,"china300Lot":0,"lot":0,"btcsLot":0,"stockLot":0,"china50Lot":0,"oilLot":0,"goldLot":0,"ukoilLot":0,"profit":0,"account":"51000203","silverLot":0},{"exchangeLot":0,"indexLot":0,"btcLot":0,"china300Lot":0,"lot":0,"btcsLot":0,"stockLot":0,"name":"432432 432","china50Lot":0,"oilLot":0,"goldLot":0,"ukoilLot":0,"profit":0,"account":"51000205","silverLot":0},{"exchangeLot":0,"indexLot":0,"btcLot":0,"china300Lot":0,"lot":0,"btcsLot":0,"stockLot":0,"china50Lot":0,"oilLot":0,"goldLot":0,"ukoilLot":0,"profit":0,"account":"51000206","silverLot":0},{"exchangeLot":0,"indexLot":0,"btcLot":0,"china300Lot":0.05,"lot":1.63,"btcsLot":1.53,"stockLot":0,"name":"test001 test001","china50Lot":0.05,"oilLot":0,"goldLot":0,"ukoilLot":0,"profit":-41.83,"account":"51000208","silverLot":0}]},"Token":""}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'agent/tradeInfoDetails': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":{"settmentOverview":{"generalAgentStatic":0,"goldCountStatic":0,"silverCountStatic":0,"oilCountStatic":0,"britainOilCountStatic":0,"exchangeCountStatic":0,"stockCountStatic":0,"indexCountStatic":0,"china300CountStatic":0.05,"china50CountStatic":0.05,"btcCountStatic":0,"btcsCountStatic":1.53,"totalRebateMoney":0,"alreadySettledMoney":0,"unsettledMoney":0.00,"sumBackBrokerage":0,"sumLot":0,"backPointNum":0,"backBrokerageNum":0},"count":5,"tradeInfo":[{"order_id":"14867","username":"test001 test001","account_commission":0.00,"isNoLoad":"0","command":"OP_BUY","updateDate":1704424889000,"account_can_gain_comm":0.00,"backBrokerage":0.00,"account":"51000208","daliName":"","close_time":1704424773000,"lot":0.03,"symbol":"BCHUSDT","isSettlement":"未结算"},{"order_id":"14866","username":"test001 test001","account_commission":0.00,"isNoLoad":"0","updateDate":1704424769000,"symbol":"CHA50","account_can_gain_comm":0.00,"backBrokerage":0.00,"account":"51000208","daliName":"","lot":0.05,"command":"OP_SELL","close_time":1704424730000,"isSettlement":"未结算"},{"username":"test001 test001","account_commission":0.00,"isNoLoad":"0","order_id":"14864","command":"OP_BUY","updateDate":1704424769000,"account_can_gain_comm":0.00,"backBrokerage":0.00,"account":"51000208","daliName":"","lot":0.05,"symbol":"CHINA300","close_time":1704424715000,"isSettlement":"未结算"},{"username":"test001 test001","account_commission":0.00,"isNoLoad":"0","order_id":"14862","close_time":1704424582000,"account_can_gain_comm":0.00,"backBrokerage":0.00,"account":"51000208","daliName":"","lot":1.00,"updateDate":1704424648000,"command":"OP_SELL","symbol":"BCHUSDT","isSettlement":"未结算"},{"lot":0.50,"username":"test001 test001","account_commission":0.00,"isNoLoad":"0","command":"OP_BUY","account_can_gain_comm":0.00,"backBrokerage":0.00,"account":"51000208","daliName":"","updateDate":1704333029000,"order_id":"14728","symbol":"BTCUSDT","close_time":1704332995000,"isSettlement":"未结算"}]}}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'agent/agentUpdateInfo': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":{"agentGoldFreeCommission":50.00,"agentSilverFreeCommission":50.00,"exchangeFreeCommissionMini":0.00,"agentCrudeOilFreeCommission":50.00,"type":2,"china300FreeCommission":50.00,"agentBritainOilFreeCommissionMini":0.00,"silverFreeCommissionEcn":0.00,"agentBtcFreeCommissionMini":0.00,"agentIndexFreeCommission":5000.00,"indexFreeCommissionEcn":0.00,"agentSilverFreeCommissionEcn":0.00,"china300FreeCommissionEcn":0.00,"stockFreeCommission":50.00,"btcsFreeCommissionEcn":0.00,"agentChina300FreeCommissionMini":0.00,"agentCrudeOilFreeCommissionMini":0.00,"goldFreeCommission":50.00,"agentHaveGroups":"0","silverFreeCommissionMini":0.00,"agentStockFreeCommission":50.00,"britainOilFreeCommissionMini":0.00,"agentBritainOilFreeCommission":50.00,"agentStockFreeCommissionEcn":0.00,"agentBtcsFreeCommission":50.00,"agentIndexFreeCommissionMini":0.00,"stockFreeCommissionMini":0.00,"agentSilverFreeCommissionMini":0.00,"china50FreeCommission":50.00,"agentCrudeOilFreeCommissionEcn":0.00,"agentBritainOilFreeCommissionEcn":0.00,"name":"test001 test001","agentStockFreeCommissionMini":0.00,"indexFreeCommissionMini":0.00,"agentChina300FreeCommission":50.00,"goldFreeCommissionEcn":0.00,"agentBtcFreeCommissionEcn":0.00,"exchangeFreeCommissionEcn":0.00,"btcFreeCommissionMini":0.00,"agentChina300FreeCommissionEcn":0.00,"btcsFreeCommission":50.00,"agentGoldFreeCommissionEcn":0.00,"crudeOilFreeCommission":50.00,"crudeOilFreeCommissionMini":0.00,"indexFreeCommission":50.00,"agentExchangeFreeCommissionMini":0.00,"china50FreeCommissionEcn":0.00,"agentChina50FreeCommissionMini":0.00,"agentBtcFreeCommission":0.00,"britainOilFreeCommissionEcn":0.00,"agentIndexFreeCommissionEcn":0.00,"haveGroups":"0","china50FreeCommissionMini":0.00,"stockFreeCommissionEcn":0.00,"exchangeFreeCommission":50.00,"agentExchangeFreeCommission":50.00,"crudeOilFreeCommissionEcn":0.00,"britainOilFreeCommission":50.00,"btcFreeCommission":0.00,"silverFreeCommission":50.00,"btcsFreeCommissionMini":0.00,"goldFreeCommissionMini":0.00,"agentChina50FreeCommissionEcn":0.00,"btcFreeCommissionEcn":0.00,"china300FreeCommissionMini":0.00,"agentBtcsFreeCommissionMini":0.00,"agentChina50FreeCommission":50.00,"agentExchangeFreeCommissionEcn":0.00,"agentBtcsFreeCommissionEcn":0.00,"agentGoldFreeCommissionMini":0.00,"account":"51000208"}}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      },
      'commissionManage/commissionhandledata': {
        result: {
          content:
            '{"Status":"0","IsSuccess":true,"Data":{"total":2,"commissionHandleData":[{"id":16,"account":"51000132","platform":"60","type":"1","mjMoney":"136.85","status":"1","createDate":1704337282000,"updateDate":1704337282000},{"id":14,"account":"51000132","platform":"60","type":"1","mjMoney":"22","status":"1","createDate":1704272239000,"updateDate":1704272239000}]}}',
          statusCode: 200,
          responseStatus: 1,
          errorMessage: null
        },
        targetUrl: null,
        success: true,
        error: null,
        unAuthorizedRequest: false,
        __abp: true
      }
    }[url]

    res.send(data)
  },
  '/api/services/app/FundManage/GetMyCoinsManageList': async (req: Request, res: Response) => {
    await waitTime(1200)
    res.send({
      result: [
        {
          id: 41,
          userId: 6,
          chainName: 'USDT-OMNI',
          coinsAddress: '455254254254',
          remark: '3',
          isDefault: true,
          type: 1,
          modifyTime: null
        },
        {
          id: 33,
          userId: 6,
          chainName: 'USDT-OMNI',
          coinsAddress: 'rewrwerew3242432432',
          remark: '432432',
          isDefault: false,
          type: 1,
          modifyTime: null
        },
        {
          id: 32,
          userId: 6,
          chainName: 'USDT-OMNI',
          coinsAddress: '424234',
          remark: '43',
          isDefault: false,
          type: 1,
          modifyTime: null
        }
      ],
      targetUrl: null,
      success: true,
      error: null,
      unAuthorizedRequest: false,
      __abp: true
    })
  },
  '/api/services/app/FundManage/GetDepositDetails': async (req: Request, res: Response) => {
    await waitTime(1200)
    res.send({
      result: {
        totalCount: 1,
        items: [
          {
            id: 6,
            account: 51000132,
            accountGroup: 'Standard',
            mtOrder: '25401701853327851',
            payMoney: 5000.0,
            payCurrency: 'Usd',
            mtMoney: 5000.0,
            successTime: '2023-12-06 17:02:23',
            channelName: 'ANT-Deal'
          }
        ]
      },
      targetUrl: null,
      success: true,
      error: null,
      unAuthorizedRequest: false,
      __abp: true
    })
  },
  '/api/services/app/FundManage/GetWithdrawDetails': async (req: Request, res: Response) => {
    await waitTime(1200)
    res.send({
      result: {
        totalCount: 1,
        items: [
          {
            id: 30,
            account: 51000132,
            accountGroup: 'Standard',
            mtOrder: '--',
            channel: 1,
            channelName: 'USDT',
            chainName: 'USDT-OMNI',
            chainCoinAddress: '455254254254',
            mtMoney: 30.0,
            trueMtMoney: 27.0,
            fee: 3.0,
            arrivedMoneyCurrency: 1,
            arrivedMoneyCurrencyName: 'IDR',
            arrivedMoney: 0.0,
            status: 3,
            statusName: 'Failed',
            submitTime: '2024-01-03 19:05:15',
            auditTime: '2024-01-03 19:05:35',
            successTime: ''
          }
        ]
      },
      targetUrl: null,
      success: true,
      error: null,
      unAuthorizedRequest: false,
      __abp: true
    })
  },
  'POST /api/services/app/FundManage/ApplyOutMargin': async (req: Request, res: Response) => {
    await waitTime(1000)
    res.send({
      result: {},
      targetUrl: null,
      success: true,
      error: null,
      unAuthorizedRequest: false,
      __abp: true
    })
  },
  'POST /api/services/app/Customer/SubmitAgentData': async (req: Request, res: Response) => {
    await waitTime(1000)
    res.send({
      result: {},
      targetUrl: null,
      success: true,
      error: null,
      unAuthorizedRequest: false,
      __abp: true
    })
  },
  '/api/services/app/UniversalConfig/GetDomainByType': {
    result: {
      README: {
        '注意!': '此处为描述事项，必须补全，如有需要，可多行备注！！！'
      },
      websocket: {
        WebSocket: ['https://mt5trader-config.transaction9.com:9443/AppConfig/Apps/MT5Trade'],
        WebSocket_guest: [
          'wss://live-wsapp.cd-ex.com/api/bbtc/noauth/websocks/mt5sock',
          'wss://tradeapi-cdex.appcdex.com/api/bbtc/noauth/websocks/mt5sock'
        ],
        WebSocket_demo: [
          'wss://live-wsapp.zftechs.com:50000/api/bbtc/demoauth/websocks/mt5sock',
          'wss://tradeapi-cdex.appcdex.com/api/bbtc/demoauth/websocks/mt5sock'
        ],
        WebSocket_real: [
          'wss://live-wsapp.zftechs.com:50000/api/bbtc/auth/websocks/mt5sock',
          'wss://tradeapi-cdex.appcdex.com/api/bbtc/auth/websocks/mt5sock'
        ]
      },
      api: {
        BASE_API: ['https://awapis.cd-ex.io', 'https://awapis.cdexapp500.com'],
        PAY_API: [
          'https://idcdex2ant.nbtwcw.com:14430/',
          'https://incdex2ant.nbtwcw.com:14430/',
          'https://cdex2ant.nbtwcw.com/',
          'https://hs2ant.wordkei.com/'
        ],
        WAP_URI: ['https://www.cd-ex.com/', 'https://www.cd-ex.com/'],
        WEB_URI: ['https://mt.cd-ex.io/'],
        CRM_API: ['https://crm.etescape.com:12343/maidian/scada/collect'],
        KLine_API: ['https://cckl.gwchart.com', 'https://cckl.gneia.com', 'https://cckl.gwchart.com'],
        KLinePage: ['https://mt.cd-ex.io/tradecdex'],
        CMS_API: ['https://crossnz.jiwqsa.com:50000/', 'https://crossnz.tienae.com:50000/'],
        CDEX_Live800: [
          'https://f88.live800.com/live800/chatClient/chatbox.jsp?companyID=1539023&configID=158453&jid=1533075335&subject=%E5%92%A8%E8%AF%A2&prechatinfoexist=1&s=1'
        ]
      }
    },
    targetUrl: null,
    success: true,
    error: null,
    unAuthorizedRequest: false,
    __abp: true
  }
}
