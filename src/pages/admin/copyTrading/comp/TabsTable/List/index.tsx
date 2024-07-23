import { IListItemTypes, ListItem } from './ListItem'

type IProps = {
  columns: IListItemTypes[]
  datas: any[]
}
const TabList = ({ datas, columns }: IProps) => {
  return (
    <div className=" flex flex-col gap-3">
      {datas.map((item, index) => (
        <ListItem item={item} columns={columns} key={index} />
      ))}
    </div>
  )
}

export default TabList
