import { Button, Result } from 'antd'
import React from 'react'

import { useEnv } from '@/context/envProvider'
import { push } from '@/utils/navigator'

const NoFoundPage: React.FC = () => {
  const { isPc } = useEnv()
  return (
    <Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={
        <Button
          type="primary"
          onClick={() => {
            // @ts-ignore
            if (window.ReactNativeWebView) {
              // @ts-ignore
              window.ReactNativeWebView.postMessage(
                JSON.stringify({
                  type: 'home'
                })
              )
            } else {
              push(isPc ? '/' : '/app/quote')
            }
          }}
        >
          Back Home
        </Button>
      }
    />
  )
}

export default NoFoundPage
