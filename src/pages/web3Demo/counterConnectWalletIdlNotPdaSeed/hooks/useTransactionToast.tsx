import { useCluster } from '@/pages/web3Demo/context/clusterProvider'
import { toast } from 'sonner'

export function ExplorerLink({ path, label, className }: { path: string; label: string; className?: string }) {
  const { getExplorerUrl } = useCluster()
  return (
    <a href={getExplorerUrl(path)} target="_blank" rel="noopener noreferrer" className={className ? className : `link font-mono`}>
      {label}
    </a>
  )
}

export function useTransactionToast() {
  return (signature: string) => {
    toast('Transaction sent', {
      description: <ExplorerLink path={`tx/${signature}`} label="View Transaction" />
    })
  }
}
