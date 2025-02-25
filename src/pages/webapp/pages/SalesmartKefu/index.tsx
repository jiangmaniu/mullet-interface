import { useEnv } from '@/context/envProvider'
import useSalesmartly from '@/hooks/useSalesmartly'
import { push } from '@/utils/navigator'
import { useIntl } from '@umijs/max'
import { useTitle } from 'ahooks'
import { useEffect } from 'react'
import Header from '../../components/Base/Header'

// Salesmartly在线客服页面
export default function SalesmartKefu() {
  const intl = useIntl()
  const { isRNWebview } = useEnv()
  const { chatOpen, chatClose } = useSalesmartly()

  useTitle(intl.formatMessage({ id: 'mt.zaixiankefu' }))

  useEffect(() => {
    setTimeout(() => {
      chatOpen()
    }, 500)

    !isRNWebview && document.body.classList.add('h5-s-chat-plugin')
    return () => {
      document.body.classList.remove('h5-s-chat-plugin')
      chatClose()
    }
  }, [isRNWebview])

  return <Header onBack={() => push('/app/user-center')} title={intl.formatMessage({ id: 'mt.zaixiankefu' })} />
}
