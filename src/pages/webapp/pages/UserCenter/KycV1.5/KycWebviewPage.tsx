import { STORAGE_SET_TOKEN } from '@/utils/storage'
import { useSearchParams } from '@umijs/max'
import { useEffect } from 'react'
import VerifyDoc from './VerifyDoc'
import VerifyMsg from './VerifyMsg'

export default function KycWebviewPage() {
  const [searchParams] = useSearchParams()

  const token = searchParams.get('token')
  const step = searchParams.get('step') || 'base'

  useEffect(() => {
    const setTokenToStorage = () => {
      console.log('token', token)
      STORAGE_SET_TOKEN(token)
    }

    setTokenToStorage()
  }, [token])

  const onSuccess = () => {
    // @ts-ignore
    window.ReactNativeWebView.postMessage(
      JSON.stringify({
        type: 'success',
        token
      })
    )
  }

  return <div>{step === 'base' ? <VerifyMsg onSuccess={onSuccess} /> : <VerifyDoc onSuccess={onSuccess} />}</div>
}
