import { useModal } from '@ebay/nice-modal-react'

export function useNiceModal(): ReturnType<typeof useModal> & {
  setVisible: (visible: boolean) => void
} {
  const modal = useModal()
  return {
    ...modal,
    setVisible: (visible: boolean) => {
      visible ? modal.show() : modal.hide()
    }
  }
}
