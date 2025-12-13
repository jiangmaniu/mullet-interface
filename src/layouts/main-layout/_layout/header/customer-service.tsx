import { Trans } from '@/components/t'
import { GeneralTooltip } from '@/components/tooltip'
import { IconButton } from '@/libs/ui/components/button'
import { Iconify } from '@/libs/ui/components/icons'
import { goKefu, push } from '@/utils/navigator'

export const CustomerService = () => {
  return (
    <GeneralTooltip content={<Trans>账户中心</Trans>}>
      <IconButton className="size-9" onClick={goKefu}>
        <Iconify icon="iconoir:headset-help" className="size-5" />
        <span className="sr-only">Customer Service</span>
      </IconButton>
    </GeneralTooltip>
  )
}
