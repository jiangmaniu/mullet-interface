import { FormattedMessage } from '@umijs/max'

export default function Header() {
  return (
    <div className="flex items-center">
      <div className="flex items-center">
        <span className="text-gray text-xl font-bold">
          <FormattedMessage id="mt.myAccount" />
        </span>
        <span className="text-gray text-sm font-bold pl-6">Hi, 670****02</span>
        <span className="text-green text-sm ml-3 px-[7px] py-1 rounded bg-[rgba(69,164,138,0.04)]">
          <FormattedMessage id="mt.yirenzheng" />
        </span>
        <span className="text-red text-sm ml-3 px-[7px] py-1 rounded bg-[rgba(69,164,138,0.04)]">
          <FormattedMessage id="mt.weirenzheng" />
        </span>
      </div>
    </div>
  )
}
