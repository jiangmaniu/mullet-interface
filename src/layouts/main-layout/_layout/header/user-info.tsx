import { Trans } from '@/components/t'
import { GeneralTooltip } from '@/components/tooltip'
import { IconButton } from '@/libs/ui/components/button'
import { Iconify } from '@/libs/ui/components/icons'
import { Link } from '@/libs/ui/next/link'

export const UserInfo = () => {
  return (
    <div>
      <GeneralTooltip content={<Trans>账户中心</Trans>}>
        <Link href="/account">
          <IconButton className="size-9">
            <Iconify icon="iconoir:user" className="size-5" />
            <span className="sr-only">User Info</span>
          </IconButton>
        </Link>
      </GeneralTooltip>
    </div>
  )
}
