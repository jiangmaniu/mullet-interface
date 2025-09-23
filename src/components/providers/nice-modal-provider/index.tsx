import NiceModal from '@ebay/nice-modal-react'

export const NiceModalProvider = ({ children }: { children: React.ReactNode }) => {
  return <NiceModal.Provider>{children}</NiceModal.Provider>
}
