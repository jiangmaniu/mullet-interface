import { Space } from 'antd'

import Tags from '@/components/Admin/Tags'

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
              <Tags size="small" color="green" format={{ id: `mt.${tag}` }} key={idx} />
            ))}
          </Space>
        </div>
        {/* 個人介紹 */}
        <span className="text-sm text-gray-600 whitespace-break-spaces">{props.introduction}</span>
      </div>
    </div>
  )
}
