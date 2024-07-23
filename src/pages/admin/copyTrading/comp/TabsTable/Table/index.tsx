import './style.less'

import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'

type IProps = {
  columns: ColumnsType
  datas: any[]
}
const TabTable = ({ columns, datas }: IProps) => {
  return <Table columns={columns} dataSource={datas} />
}

export default TabTable
