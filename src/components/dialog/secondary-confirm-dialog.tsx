import { Trans } from '@/libs/lingui/react/macro'
import { Button, IconButton } from '@/libs/ui/components/button'
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/libs/ui/components/dialog'
import { Iconify } from '@/libs/ui/components/icons'
import { cn } from '@/utils/cn'
import { useEffect, useState } from 'react'

type Props = {
  isOpen?: boolean
  onClose?: () => void
  message?: React.ReactNode
  title?: React.ReactNode
  cancel?:
    | {
        className?: string
        label?: React.ReactNode
        cb?: () => Promise<Nilable<boolean>> | Nilable<boolean>
        loading?: boolean
      }
    | false
  confirm?: {
    loading?: boolean
    className?: string
    label?: React.ReactNode
    cb?: () => Promise<Nilable<boolean>> | Nilable<boolean>
  }
}

export const SecondaryConfirmationDialog = (props: Props) => {
  const { isOpen, onClose } = props
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(false)
  const [isHandleComfirn, setIsHandleComfirn] = useState(false)
  const [isHandleCancel, setIsHandleCancel] = useState(false)

  useEffect(() => {
    if (isHandleComfirn && !props.confirm?.loading) {
      onClose?.()
      setIsHandleComfirn(false)
    }
  }, [props.confirm?.loading, isHandleComfirn])

  useEffect(() => {
    if (isHandleCancel && props.cancel !== false && !props.cancel?.loading) {
      onClose?.()
      setIsHandleCancel(false)
    }
  }, [props.cancel, isHandleCancel])

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[360px]" aria-describedby={undefined} onInteractOutside={(event) => event.preventDefault()}>
        <DialogHeader className="">
          <DialogTitle className="flex items-center justify-between gap-3">
            {props.title && <div className={cn('')}> {props.title}</div>}

            <DialogClose asChild>
              <IconButton
                variant="ghost"
                disabled={props.confirm?.loading ?? (confirmLoading || (props.cancel !== false && props.cancel?.loading)) ?? cancelLoading}
                size={'icon-sm'}
                className="text-brand-secondary-2"
              >
                <Iconify icon="iconoir:xmark" className="size-4" />
                <span className="sr-only">Close</span>
              </IconButton>
            </DialogClose>
          </DialogTitle>
        </DialogHeader>

        {!!props.message && <div className="flex-1 py-2 leading-normal"> {props.message}</div>}

        <DialogFooter className="flex gap-3  mt-5">
          {props.cancel !== false ? (
            <>
              <Button
                variant="primary"
                color={'default'}
                size="lg"
                disabled={props.confirm?.loading ?? confirmLoading}
                loading={props.cancel?.loading ?? cancelLoading}
                className={cn('flex-1', props.cancel?.className)}
                onClick={async () => {
                  if (props.cancel === false) {
                    return
                  }

                  setCancelLoading(true)

                  try {
                    const result = await Promise.resolve(props.cancel?.cb?.())
                    if (result === false) {
                      return
                    }

                    if (!props.cancel?.loading) {
                      onClose?.()
                    } else {
                      setIsHandleCancel(true)
                    }
                  } catch {
                  } finally {
                    setCancelLoading(false)
                  }
                }}
              >
                {props.cancel?.label ?? <Trans>取消</Trans>}
              </Button>
            </>
          ) : null}

          {props.confirm && (
            <>
              <Button
                variant="primary"
                color={'primary'}
                size="lg"
                loading={props.confirm?.loading ?? confirmLoading}
                disabled={props.confirm?.loading ?? confirmLoading}
                className={cn('flex-1', props.confirm?.className)}
                onClick={async () => {
                  setConfirmLoading(true)

                  try {
                    const result = await Promise.resolve(props.confirm?.cb?.())
                    if (result === false) {
                      return
                    }

                    if (!props.confirm?.loading) {
                      onClose?.()
                    } else {
                      setIsHandleComfirn(true)
                    }
                  } catch {
                  } finally {
                    setConfirmLoading(false)
                  }
                }}
              >
                {props.confirm?.label ?? <Trans>确定</Trans>}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
