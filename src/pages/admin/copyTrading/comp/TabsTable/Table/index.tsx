import './style.less'

import { Table } from 'antd'
import { ColumnsType } from 'antd/lib/table'

type IProps = {
  columns: ColumnsType
  datas: any[]
  loading?: boolean
}
const TabTable = ({ columns, datas, loading }: IProps) => {
  return <Table columns={columns} dataSource={datas} pagination={false} loading={loading} />
}

export default TabTable
