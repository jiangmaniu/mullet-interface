import { useModel } from "@umijs/max"

export function useMainAccount() {
  const { initialState } = useModel('@@initialState')

  const currentUser = initialState?.currentUser
  const accountList = currentUser?.accountList || []
  const mainAccount = accountList.filter((item) => !item.isSimulate)[0]

  return mainAccount
}
