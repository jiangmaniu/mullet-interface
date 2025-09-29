import { QueriesKeyConfig } from "@/components/providers/react-query-provider/helper";
import { FollowManage } from "../instance/gen";
import { GetTWRRecordListRequestQuery } from "../hooks/follow-manage/twr-record-list";
import { GetPoolDetailRequestQuery } from "../hooks/follow-manage/pool-detail";
import { GetPoolPageListRequestQuery } from "../hooks/follow-manage/pool-list";

export const followManageKeyConfig = {
  poolList: (query?: GetPoolPageListRequestQuery) => [query],
  poolDetail: (query: GetPoolDetailRequestQuery) => [query],
  twrRecordList: (query: GetTWRRecordListRequestQuery) => [query],

  poolVaultDivvy: undefined,
  poolVaultClose: undefined,
} satisfies QueriesKeyConfig
