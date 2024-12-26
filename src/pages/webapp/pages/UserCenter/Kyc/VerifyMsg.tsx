import Button from '@/components/Base/Button'
import Iconfont from '@/components/Base/Iconfont'
import { useEnv } from '@/context/envProvider'
import { useTheme } from '@/context/themeProvider'
import { TextField } from '@/pages/webapp/components/Base/Form/TextField'
import Header from '@/pages/webapp/components/Base/Header'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import BasicLayout from '@/pages/webapp/layouts/BasicLayout'
import { navigateTo } from '@/pages/webapp/utils/navigator'
import { getAreaCode } from '@/services/api/common'
import { zodResolver } from '@hookform/resolvers/zod'
import { Radio } from 'antd'
import { useLayoutEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { ModalRef } from './comp/SelectCountryModal'
import SelectCountryModal from './comp/SelectCountryModal'
import StepBox from './comp/StepBox'

type FormData = {
  areaCodeItem?: Common.AreaCodeItem
  areaCode: string
  country: string
  firstName: string
  lastName: string
  identificationCode: string
  identificationType: string
}

export default function VerifyMsg() {
  const { cn, theme } = useTheme()
  const i18n = useI18n()
  const { t, locale } = i18n

  const { screenSize } = useEnv()

  const step = 1
  /** 表单控制 */
  const schema = z.object({
    areaCodeItem: z
      .object(
        {
          id: z.string().min(1, { message: t('pages.login.Residence Country is required') }),
          areaCode: z.string().min(1, { message: t('pages.login.Residence Country is required') })
        },
        { message: t('pages.login.Residence Country is required') }
      )
      .optional(),
    country: z.string().min(1, { message: t('pages.userCenter.qingxuanzeguojia') }),
    firstName: z.string().min(1, { message: t('pages.userCenter.qingshuruxingshi') }),
    lastName: z.string().min(1, { message: t('pages.userCenter.qingshurumingzi') }),
    identificationCode: z.string().min(1, { message: t('pages.userCenter.qingshuruzhengjianhaoma') }),
    identificationType: z.string().min(1, { message: t('pages.userCenter.qingxuanzezhengjianleixing') })
  })

  const {
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      areaCode: '',
      areaCodeItem: undefined,
      country: '',
      firstName: '',
      lastName: '',
      identificationCode: '',
      identificationType: 'ID_CARD'
    },
    mode: 'all',
    resolver: zodResolver(schema)
  })

  const areaCode = watch('areaCode')
  const country = watch('country')
  const areaCodeItem = watch('areaCodeItem')
  const firstName = watch('firstName')
  const lastName = watch('lastName')
  const identificationCode = watch('identificationCode')
  const identificationType = watch('identificationType')

  const selectCountryModalRef = useRef<ModalRef>(null)
  const handleSelectCountry = (item?: Common.AreaCodeItem) => {
    if (item) {
      setValue('areaCode', item.areaCode)
      setValue('country', item.abbr)
      setValue('areaCodeItem', item)
      trigger('areaCode')
    } else {
      setValue('areaCode', '')
      setValue('country', '')
      setValue('areaCodeItem', undefined)
      trigger('areaCode')
    }
  }

  const handleSelectCodeType = (value: string) => {
    setValue('identificationType', value)
    trigger('identificationType')
  }

  const firstNameInput = useRef<any>(null)
  const lastNameInput = useRef<any>(null)
  const identificationCodeInput = useRef<any>(null)

  const onSubmit = (data: FormData) => {
    navigateTo('/app/user-center/verify-document', {
      ...data
    })
  }

  const disabled = !areaCode || !firstName || !lastName || !identificationCode || !identificationType

  const [countryList, setCountryList] = useState<Common.AreaCodeItem[]>([])
  useLayoutEffect(() => {
    getAreaCode().then((res) => {
      const list = res.data?.filter((item) => item.areaCode !== '0')
      setCountryList(list || [])
    })
  }, [])

  return (
    <BasicLayout bgColor="secondary" style={{ paddingLeft: 14, paddingRight: 14 }}>
      <Header title={i18n.t('pages.userCenter.shenfenrenzheng')} />
      <StepBox step={step} />
      <View className={cn('mt-5 px-2 flex-1')}>
        <View
          className={cn('flex flex-col gap-6')}
          style={{
            maxHeight: screenSize.height
          }}
        >
          <Text className={cn('text-xl font-bold text-primary')}>{i18n.t('pages.userCenter.shenfenrenzheng')}</Text>
          <Text className={cn('text-xs text-weak')}>{i18n.t('pages.userCenter.qingquebaozixunzuixinyouxiao')}</Text>
          <View className={cn('flex flex-col mt-3 gap-[11px]')}>
            <TextField
              value={areaCodeItem ? `(${areaCodeItem.areaCode}) ${locale === 'zh-TW' ? areaCodeItem?.nameCn : areaCodeItem?.nameEn}` : ''}
              onFocus={() => {
                if (!areaCodeItem) {
                  selectCountryModalRef.current?.show()
                }
              }}
              onChange={(val) => {
                if (val) selectCountryModalRef.current?.show()
                else handleSelectCountry()
              }}
              // onPressIn={() => {
              //   selectCountryModalRef.current?.show()
              // }}
              label={`1.${t('pages.userCenter.xuanzeguojia')}`}
              placeholder={t('pages.userCenter.qingxuanzeguojia')}
              height={50}
              containerClassName={'mt-4'}
              className={'leading-[18px]'}
              autoCapitalize="none"
              autoComplete="password"
              // autoCorrect={false}
              // onSubmitEditing={() => lastNameInput.current?.focus()}
              LeftAccessory={() => <Iconfont name="earth" size={18} color={theme.colors.textColor.weak} style={{ marginLeft: 16 }} />}
              RightAccessory={() => <Iconfont name="qiehuanzhanghu-xiala" size={20} style={{ marginRight: 16 }} />}
            />
            {errors.country && <Text color="red">{errors.country.message}</Text>}
            <TextField
              value={lastName}
              ref={lastNameInput}
              onChange={(val) => {
                setValue('lastName', val?.trim())
                trigger('lastName')
              }}
              label={t('pages.userCenter.xing')}
              placeholder={t('pages.userCenter.qingshuruxingshi')}
              height={50}
              autoCapitalize="none"
              autoComplete="email"
              // autoCorrect={false}
              // keyboardType="email-address"
              // onSubmitEditing={() => firstNameInput.current?.focus()}
            />
            {errors.lastName && <Text color="red">{errors.lastName.message}</Text>}
            <TextField
              value={firstName}
              ref={firstNameInput}
              onChange={(val) => {
                setValue('firstName', val?.trim())
                trigger('firstName')
              }}
              label={t('pages.userCenter.ming')}
              placeholder={t('pages.userCenter.qingshurumingzi')}
              height={50}
              autoCapitalize="none"
              autoComplete="email"
              // autoCorrect={false}
              // keyboardType="email-address"
              // onSubmitEditing={() => identificationCodeInput.current?.focus()}
            />
            {errors.firstName && <Text color="red">{errors.firstName.message}</Text>}
            <Text className={cn('mb-1')}>{t('pages.userCenter.xuanzezhengjianleixing')}</Text>
            <Radio.Group
              onChange={(e) => {
                // @ts-ignore
                handleSelectCodeType(e.target.value)
              }}
              value={identificationType}
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-around',
                gap: 8
              }}
            >
              <Radio value="ID_CARD">
                <Text className={cn('text-sm text-primary')}>{t('pages.userCenter.shenfenzheng')}</Text>
              </Radio>
              <Radio value="PASSPORT">
                <Text className={cn('text-sm text-primary')}>{t('pages.userCenter.hukoubenjuzhuzheng')}</Text>
              </Radio>
            </Radio.Group>
            <TextField
              value={identificationCode}
              ref={identificationCodeInput}
              onChange={(val) => {
                setValue('identificationCode', val?.trim())
                trigger('identificationCode')
              }}
              label={t('pages.userCenter.zhengjianhao')}
              placeholder={t('pages.userCenter.qingshuruzhengjianhaoma')}
              height={50}
              autoCapitalize="none"
              autoComplete="email"
              // autoCorrect={false}
              // keyboardType="email-address"
              // onSubmitEditing={() => {}}
            />
            {errors.identificationCode && <Text color="red">{errors.identificationCode.message}</Text>}
          </View>
        </View>
      </View>
      <Button type="primary" className="mb-2.5" loading={false} height={48} onPress={handleSubmit(onSubmit)} disabled={disabled}>
        {t('common.operate.Continue')}
      </Button>
      <SelectCountryModal ref={selectCountryModalRef} onPress={handleSelectCountry} list={countryList} />
    </BasicLayout>
  )
}
