import { SecondaryConfirmationGlobalModal } from './global-modal'

const GLOBAL_MODAL_ID_PREFIX = 'global-modal'

export const GLOBAL_MODAL_ID = {
  SecondaryConfirmation: `${GLOBAL_MODAL_ID_PREFIX}_secondary-confirmation`
}

export const RegisterGlobalModal = () => {
  return (
    <>
      <SecondaryConfirmationGlobalModal id={GLOBAL_MODAL_ID.SecondaryConfirmation} />
    </>
  )
}
