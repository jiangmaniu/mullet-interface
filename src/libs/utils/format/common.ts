export const formatAddress = (address: any, { prefix = 6, suffix = 4 }: { prefix?: number; suffix?: number } = {}) => {
  if (!address) return ''
  return `${address.slice(0, prefix)}...${address.slice(-suffix)}`
}
