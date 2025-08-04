import { AddressProps, Address as AntdAddress } from '@ant-design/web3'

export default function Address({ address, ...res }: AddressProps) {
  return (
    <AntdAddress
      ellipsis={{
        headClip: 8,
        tailClip: 6
      }}
      addressPrefix={false}
      address={address}
      {...res}
    />
  )
}
