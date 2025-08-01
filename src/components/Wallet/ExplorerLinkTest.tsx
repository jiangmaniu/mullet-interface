import { useCluster } from '@/context/clusterProvider'

export function ExplorerLinkTest({ path, label, className }: { path: any; label: React.ReactNode; className?: string }) {
  const { getExplorerUrl } = useCluster()
  return (
    <a href={getExplorerUrl(path)} target="_blank" rel="noopener noreferrer" className={className ? className : `link font-mono`}>
      {label}
    </a>
  )
}
