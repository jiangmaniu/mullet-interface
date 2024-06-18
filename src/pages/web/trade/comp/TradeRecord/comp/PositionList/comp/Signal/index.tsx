import classNames from 'classnames'

/**
 * 爆仓信号
 * @returns
 */
export default function Signal() {
  const list = [{ status: 1 }, { status: 1 }, { status: 1 }, { status: 2 }]
  return (
    <div className="flex items-center">
      {list.map((item, idx) => {
        return <div className={classNames('w-1 h-3 mr-[2px]', item.status === 1 ? 'bg-green' : 'bg-gray-360')} key={idx}></div>
      })}
    </div>
  )
}
