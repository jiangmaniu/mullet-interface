// 校验线上版本是否更新，如果更新则提示用户刷新页面

export const checkVersion = (updateCb?: () => void) => {
  if (process.env.NODE_ENV === 'development') {
    return
  }
  fetch('/version.json?t=' + Date.now())
    .then((res) => res.json())
    .then((res: any) => {
      const { version } = res
      const htmlVersion = (document.querySelector('meta[name="version"]') as any)?.content
      if (htmlVersion && Number(version) && version !== Number(htmlVersion)) {
        updateCb?.()
        // notification.info({
        //   duration: 0,
        //   message: <span className="text-primary font-medium">{getIntl().formatMessage({ id: 'mt.banbengengxin' })}</span>,
        //   description: (
        //     <div>
        //       <span className="text-secondary">{getIntl().formatMessage({ id: 'mt.banbengengxintips' })}</span>
        //     </div>
        //   ),
        //   style: {
        //     background: 'var(--dropdown-bg)'
        //   },
        //   btn: (
        //     <Button
        //       type="primary"
        //       size="small"
        //       onClick={() => {
        //         window.location.reload()
        //       }}
        //       icon={<RedoOutlined />}
        //     >
        //       {getIntl().formatMessage({ id: 'common.shuaxin' })}
        //     </Button>
        //   ),
        //   placement: 'bottomRight'
        // })
        window.location.reload()
      }
    })
}
