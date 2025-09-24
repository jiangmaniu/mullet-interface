import { create, useModal } from '@ebay/nice-modal-react'
import { ComponentProps } from 'react'

import { SecondaryConfirmationDialog } from '@/components/dialog/secondary-confirm-dialog'

type SecondaryConfirmationGlobalModalProps = Omit<ComponentProps<typeof SecondaryConfirmationDialog>, 'isOpen' | 'onClose'>

export const SecondaryConfirmationGlobalModal = create((props: SecondaryConfirmationGlobalModalProps) => {
  const modal = useModal()

  return <SecondaryConfirmationDialog isOpen={modal.visible} onClose={modal.hide} {...props} />
})
