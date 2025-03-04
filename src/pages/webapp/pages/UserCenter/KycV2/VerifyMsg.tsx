import Iconfont from '@/components/Base/Iconfont'
import { DEFAULT_AREA_CODE } from '@/constants'
import { useTheme } from '@/context/themeProvider'
import { TextField } from '@/pages/webapp/components/Base/Form/TextField'
import { Text } from '@/pages/webapp/components/Base/Text'
import { View } from '@/pages/webapp/components/Base/View'
import { useI18n } from '@/pages/webapp/hooks/useI18n'
import { getAreaCode } from '@/services/api/common'
import { submitBaseAuth } from '@/services/api/crm/kycAuth'
import { message } from '@/utils/message'
import { zodResolver } from '@hookform/resolvers/zod'
import { useModel } from '@umijs/max'
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import SelectCountryModal, { ModalRef } from '../Kyc/comp/SelectCountryModal'

type FormData = {
  areaCode: string
  country: string
  firstName: string
  lastName: string
  identificationCode: string
  identificationType: string
}

const Messages = forwardRef(
  ({ onSuccess, onDisabledChange }: { onSuccess: () => void; onDisabledChange: (disabled: boolean) => void }, ref: any) => {
    const { cn, theme } = useTheme()
    const i18n = useI18n()
    const { t, locale } = i18n

    /** 表单控制 */
    const schema = z.object({
      areaCode: z.string().min(1, { message: t('pages.userCenter.qingxuanzeguojia') }),
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
        areaCode: DEFAULT_AREA_CODE,
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
    const firstName = watch('firstName')
    const lastName = watch('lastName')
    const identificationCode = watch('identificationCode')
    const identificationType = watch('identificationType')

    const selectCountryModalRef = useRef<ModalRef>(null)
    const handleSelectCountry = (item?: Common.AreaCodeItem) => {
      if (item) {
        setValue('areaCode', item.areaCode)
        setValue('country', item.abbr)
        trigger('areaCode')
        areacodeRef.current?.blur()
        setTimeout(() => {
          lastNameInput.current?.focus()
        }, 100)
      } else {
        setValue('areaCode', '')
        setValue('country', '')
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

    const disabled = !areaCode || !firstName || !lastName || !identificationCode || !identificationType

    useEffect(() => {
      onDisabledChange(disabled)
    }, [disabled])

    // 获取国家列表
    const [countryList, setCountryList] = useState<Common.AreaCodeItem[]>([])
    const getCountryList = async () => {
      try {
        const res = await getAreaCode()
        const list = res.data?.filter((item) => item.areaCode !== '0')
        setCountryList(list || [])
      } catch (error) {
        console.error(error)
      }
    }

    useLayoutEffect(() => {
      getCountryList()
    }, [])

    const areacodeRef = useRef<any>(null)

    const handlerAreaCodeFocus = () => {
      selectCountryModalRef.current?.show()
      areacodeRef.current?.blur()
    }

    const areaCodeItem = useMemo(() => {
      const item = countryList.find((item) => item.areaCode === areaCode)

      setValue('country', item?.abbr || '')

      return item
    }, [areaCode, countryList])

    const onSubmit = (data: FormData) => {
      submitBaseAuth({
        ...data,
        identificationType: data.identificationType as API.IdentificationType
      }).then(async (res) => {
        if (res.success) {
          message.info(i18n.t('common.operate.Op Success'))

          onSuccess()

          return
        }
      })
    }

    useImperativeHandle(ref, () => ({
      onSubmit: handleSubmit(onSubmit)
    }))

    return (
      <View className={cn('flex flex-col mt-3 gap-[11px]')}>
        <TextField
          ref={areacodeRef}
          value={areaCodeItem ? `(${areaCodeItem.areaCode}) ${locale === 'zh-TW' ? areaCodeItem?.nameCn : areaCodeItem?.nameEn}` : ''}
          onFocus={handlerAreaCodeFocus}
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
          onEnterPress={() => {
            if (areaCodeItem) {
              lastNameInput.current?.focus()
            }
          }}
          LeftAccessory={() => (
            <Iconfont
              name="earth"
              size={18}
              color={theme.colors.textColor.weak}
              style={{ marginLeft: 16 }}
              onClick={handlerAreaCodeFocus}
            />
          )}
          RightAccessory={() => (
            <Iconfont name="qiehuanzhanghu-xiala" size={20} style={{ marginRight: 16 }} onClick={handlerAreaCodeFocus} />
          )}
        />
        {errors.areaCode && <Text color="red">{errors.areaCode.message}</Text>}
        <View className={cn(' grid grid-cols-2 gap-2')}>
          <View className={cn('flex flex-col gap-2')}>
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
              onEnterPress={() => {
                if (lastName) {
                  firstNameInput.current?.focus()
                }
              }}
            />
            {errors.lastName && <Text color="red">{errors.lastName.message}</Text>}
          </View>
          <View className={cn('flex flex-col gap-2')}>
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
              onEnterPress={() => {
                if (firstName) {
                  identificationCodeInput.current?.focus()
                }
              }}
            />
            {errors.firstName && <Text color="red">{errors.firstName.message}</Text>}
          </View>
        </View>

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
        <SelectCountryModal ref={selectCountryModalRef} onPress={handleSelectCountry} />
      </View>
    )
  }
)

const VerifyDoc = forwardRef(
  ({ onSuccess, onDisabledChange }: { onSuccess: () => void; onDisabledChange: (disabled: boolean) => void }, ref: any) => {
    const { cn, theme } = useTheme()
    const i18n = useI18n()

    const { initialState } = useModel('@@initialState')
    const currentUser = initialState?.currentUser
    const userInfo = currentUser?.userInfo
    const phone = userInfo?.phone

    const messagesRef = useRef<any>(null)

    useImperativeHandle(ref, () => ({
      onSubmit: messagesRef.current?.onSubmit
    }))

    return (
      <View className={cn('px-2 flex flex-col gap-2 ')}>
        <Text className={cn('text-xl font-bold text-primary')} weight="bold">
          {i18n.t('pages.userCenter.shenfenrenzheng')}
        </Text>
        <Text className={cn('text-xs text-weak')} color="weak">
          {i18n.t('pages.userCenter.qingquebaoyixiazixunshibenrenmingxia')}
        </Text>
        <View className={cn('flex flex-col mt-3 gap-[11px]')}>
          <View className={cn('flex flex-row gap-2')}>
            <Text size="base" weight="medium">
              {i18n.t('common.shoujihaoma')}:&nbsp;
              {phone}
            </Text>
          </View>
        </View>
        <Messages ref={messagesRef} onSuccess={onSuccess} onDisabledChange={onDisabledChange} />
      </View>
    )
  }
)

export default VerifyDoc
