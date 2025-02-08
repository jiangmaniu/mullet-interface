import { useLang } from '@/context/languageProvider'
import { useIntl } from '@umijs/max'
import { MessageDescriptor } from '@umijs/route-utils/dist/types'

export const useI18n = () => {
  const intl = useIntl()
  const lng = useLang()

  const t = (id: MessageDescriptor['id'], values?: any) => {
    return intl.formatMessage({ id: id }, values)
  }

  const loadLocale = lng.setLng

  return {
    t,
    loadLocale,
    locale: lng.lng
  }
}
