import { FormattedMessage } from '@umijs/max'
import { Space } from 'antd'
import classNames from 'classnames'

type IProps = {
  avatar?: string
  name?: string
  introduction?: string
  tags?: string[]
}

/**
 * 個人簡介
 * @param props
 * @returns
 */
export const Introduction = (props: IProps) => {
  return (
    <div className="flex items-center gap-5">
      <img src={props.avatar} width={54} height={54} className="rounded-xl border border-solid border-gray-340" />
      <div className=" flex flex-col gap-1">
        {/* 名字 & 標籤 */}
        <div className=" flex items-center gap-4 ">
          <span className=" text-xl font-medium text-black-900"> {props.name} </span>
          <Space direction="horizontal" size={2}>
            {props.tags?.map((tag, idx) => (
              <span key={idx} className={classNames('text-xs font-light border-none px-1 rounded', 'text-green bg-green bg-opacity-20')}>
                <FormattedMessage id={`mt.${tag}`} />
              </span>
            ))}
          </Space>
        </div>
        {/* 個人介紹 */}
        <span className="text-sm text-gray-600 whitespace-break-spaces">{props.introduction}</span>
      </div>
    </div>
  )
}
