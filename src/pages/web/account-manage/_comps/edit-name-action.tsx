import { getEnv } from '@/env'
import { IconButton } from '@/libs/ui/components/button'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Iconify } from '@/libs/ui/components/icons'
import { useNiceModal } from '@/components/providers/nice-modal-provider/hooks'
import { create } from '@ebay/nice-modal-react'
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalFooter, ModalAction } from '@/libs/ui/components/modal'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/libs/ui/components/form'
import { Trans, useLingui } from '@/libs/lingui/react/macro'
import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/libs/ui/components/input'
import { UpdateAccount } from '@/services/api/tradeCore/account'
import { useModel } from '@umijs/max'
import { toast } from '@/libs/ui/components/toast'

type EdiAccountNameActionProps = {
  accountInfo?: User.AccountItem
}

export const EdiAccountNameAction = ({ accountInfo }: EdiAccountNameActionProps) => {
  const ENV = getEnv()

  console.log('EdiAccountNameAction', ENV.HIDE_ACCOUNT_RENAME, accountInfo, ENV.HIDE_ACCOUNT_RENAME || !accountInfo)
  if (ENV.HIDE_ACCOUNT_RENAME || !accountInfo) return null
  console.log('EdiAccountNameAction2', ENV.HIDE_ACCOUNT_RENAME, accountInfo, ENV.HIDE_ACCOUNT_RENAME || !accountInfo)

  return <EdiAccountNameModal accountInfo={accountInfo} />
}

const EdiAccountNameModal = ({ accountInfo }: EdiAccountNameActionProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const hide = () => {
    setIsOpen(false)
  }
  const show = () => {
    setIsOpen(true)
  }

  const { t } = useLingui()
  const formSchema = z
    .object({
      name: z.string()
    })
    .refine((data) => data.name !== accountInfo?.name, {
      message: t`名称不能与原始名称相同`,
      path: ['name']
    })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: ''
    }
  })
  const { fetchUserInfo } = useModel('user')

  useEffect(() => {
    if (isOpen) {
      form.reset()
    }
  }, [isOpen])

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    const params = {
      ...data,
      id: accountInfo?.id
    }

    const res = await UpdateAccount(params)
    const success = res.success

    if (success) {
      // 刷新账户列表
      await fetchUserInfo(false)
      toast.success(t`操作成功`)
      hide()
    }
  }

  return (
    <div className="flex items-center">
      <IconButton size="icon-sm" variant="ghost" className="size-4 p-0 text-brand-secondary-3" onClick={() => show()}>
        <Iconify icon="iconoir:edit" className="size-full" />
      </IconButton>

      <Modal open={isOpen} onOpenChange={hide}>
        <ModalContent aria-describedby={undefined}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2xs">
              <ModalHeader>
                <ModalTitle>
                  <Trans>编辑账户名称</Trans>
                </ModalTitle>
              </ModalHeader>

              <div className="mt-medium flex flex-col gap-2xl">
                <div className="text-paragraph-p3 text-content-4">
                  <Trans>如果您有多个账户，您可以以不同名称命名每个账户以便于区分</Trans>
                </div>

                <FormField
                  control={form.control}
                  name={'name'}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="flex-1 space-y-2">
                          <Input autoFocus labelText={<Trans>账户名称</Trans>} placeholder={accountInfo?.name} {...field} />

                          <FormMessage />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <ModalFooter className="mt-2xl">
                <ModalAction
                  hide={hide}
                  confirm={{
                    loading: form.formState.isSubmitting,
                    disabled: !form.formState.isDirty,
                    type: 'submit'
                  }}
                  cancel={false}
                />
              </ModalFooter>
            </form>
          </Form>
        </ModalContent>
      </Modal>
    </div>
  )
}
