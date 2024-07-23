import { IListItemTypes, ListItem } from './ListItem'

type IProps = {
  columns: IListItemTypes[]
  datas: any[]
  onClick?: (item: any) => void
}
const TabList = ({ datas, columns, onClick }: IProps) => {
  return (
    <div className=" flex flex-col gap-3">
      {datas.map((item, index) => (
        <ListItem item={item} columns={columns} key={index} onClick={onClick} />
      ))}
    </div>
  )
}

export default TabList
