import Button from '@/components/Base/Button'
import { useCluster } from '@/pages/web3Demo/context/clusterProvider'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'

export function ExplorerLink({ path, label, className }: { path: string; label: string; className?: string }) {
  const { getExplorerUrl } = useCluster()
  return (
    <a href={getExplorerUrl(path)} target="_blank" rel="noopener noreferrer" className={className ? className : `link font-mono`}>
      {label}
    </a>
  )
}

export function ClusterUiSelect() {
  const { clusters, setCluster, cluster } = useCluster()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button>{cluster.name}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {clusters.map((item) => (
          <DropdownMenuItem key={item.name} onClick={() => setCluster(item)}>
            {item.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
