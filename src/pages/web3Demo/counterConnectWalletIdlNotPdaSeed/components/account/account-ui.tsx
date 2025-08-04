import { useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { RefreshCw } from 'lucide-react'
import { useMemo, useState } from 'react'

import Button from '@/components/Base/Button'
import { useCluster } from '@/pages/web3Demo/context/clusterProvider'
import { ellipsify } from '@/utils'
import { AppAlert } from '../app/app-alert'
import { AppModal } from '../app/app-modal'
import { ExplorerLink } from '../cluster-ui'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useGetBalance, useGetSignatures, useGetTokenAccounts, useRequestAirdrop, useTransferSol } from './account-data-access'

export function AccountBalance({ address }: { address: PublicKey }) {
  const query = useGetBalance({ address })

  return (
    <h1 className="text-5xl font-bold cursor-pointer" onClick={() => query.refetch()}>
      {query.balance ? <BalanceSol balance={query.balance} /> : '...'} SOL
    </h1>
  )
}

export function AccountChecker() {
  const { publicKey } = useWallet()
  if (!publicKey) {
    return null
  }
  return <AccountBalanceCheck address={publicKey} />
}

export function AccountBalanceCheck({ address }: { address: PublicKey }) {
  const { cluster } = useCluster()
  const mutation = useRequestAirdrop({ address })
  const query = useGetBalance({ address })

  if (query.loading) {
    return null
  }
  if (query.error || !query.balance) {
    return (
      <AppAlert action={<Button onClick={() => mutation.mutate(1).catch((err) => console.log(err))}>Request Airdrop</Button>}>
        You are connected to <strong>{cluster.name}</strong> but your account is not found on this cluster.
      </AppAlert>
    )
  }
  return null
}

export function AccountButtons({ address }: { address: PublicKey }) {
  const { cluster } = useCluster()
  return (
    <div>
      <div className="space-x-2">
        {cluster.network?.includes('mainnet') ? null : <ModalAirdrop address={address} />}
        <ModalSend address={address} />
        <ModalReceive address={address} />
      </div>
    </div>
  )
}

export function AccountTokens({ address }: { address: PublicKey }) {
  const [showAll, setShowAll] = useState(false)
  const query = useGetTokenAccounts({ address })
  const items = useMemo(() => {
    if (showAll) return query.tokenAccounts
    return query.tokenAccounts?.slice(0, 5)
  }, [query.tokenAccounts, showAll])

  return (
    <div className="space-y-2">
      <div className="justify-between">
        <div className="flex justify-between">
          <h2 className="text-2xl font-bold">Token Accounts</h2>
          <div className="space-x-2">
            {query.loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              <Button
                onClick={async () => {
                  await query.refetch()
                }}
              >
                <RefreshCw size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
      {query.error && <pre className="alert alert-error">Error: {query.error?.message.toString()}</pre>}
      <div>
        {query.tokenAccounts.length === 0 ? (
          <div>No token accounts found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Public Key</TableHead>
                <TableHead>Mint</TableHead>
                <TableHead className="text-right">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items?.map(({ account, pubkey }) => (
                <TableRow key={pubkey.toString()}>
                  <TableCell>
                    <div className="flex space-x-2">
                      <span className="font-mono">
                        <ExplorerLink label={ellipsify(pubkey.toString())} path={`account/${pubkey.toString()}`} />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <span className="font-mono">
                        <ExplorerLink
                          label={ellipsify(account.data.parsed.info.mint)}
                          path={`account/${account.data.parsed.info.mint.toString()}`}
                        />
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-mono">{account.data.parsed.info.tokenAmount.uiAmount}</span>
                  </TableCell>
                </TableRow>
              ))}

              {(query.tokenAccounts?.length ?? 0) > 5 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <Button onClick={() => setShowAll(!showAll)}>{showAll ? 'Show Less' : 'Show All'}</Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

export function AccountTransactions({ address }: { address: PublicKey }) {
  const query = useGetSignatures({ address })
  const [showAll, setShowAll] = useState(false)

  const items = useMemo(() => {
    if (showAll) return query.signatures
    return query.signatures?.slice(0, 5)
  }, [query.signatures, showAll])

  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <h2 className="text-2xl font-bold">Transaction History</h2>
        <div className="space-x-2">
          {query.loading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <Button onClick={() => query.refetch()}>
              <RefreshCw size={16} />
            </Button>
          )}
        </div>
      </div>
      {query.error && <pre className="alert alert-error">Error: {query.error?.message.toString()}</pre>}
      <div>
        {query.signatures.length === 0 ? (
          <div>No transactions found.</div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Signature</TableHead>
                <TableHead className="text-right">Slot</TableHead>
                <TableHead>Block Time</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items?.map((item: any) => (
                <TableRow key={item.signature}>
                  <TableHead className="font-mono">
                    <ExplorerLink path={`tx/${item.signature}`} label={ellipsify(item.signature, 8)} />
                  </TableHead>
                  <TableCell className="font-mono text-right">
                    <ExplorerLink path={`block/${item.slot}`} label={item.slot.toString()} />
                  </TableCell>
                  <TableCell>{new Date((item.blockTime ?? 0) * 1000).toISOString()}</TableCell>
                  <TableCell className="text-right">
                    {item.err ? (
                      <span className="text-red-500" title={item.err.toString()}>
                        Failed
                      </span>
                    ) : (
                      <span className="text-green-500">Success</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {(query.signatures?.length ?? 0) > 5 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <Button onClick={() => setShowAll(!showAll)}>{showAll ? 'Show Less' : 'Show All'}</Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

function BalanceSol({ balance }: { balance: number }) {
  return <span>{Math.round((balance / LAMPORTS_PER_SOL) * 100000) / 100000}</span>
}

function ModalReceive({ address }: { address: PublicKey }) {
  return (
    <AppModal title="Receive">
      <p>Receive assets by sending them to your public key:</p>
      <code>{address.toString()}</code>
    </AppModal>
  )
}

function ModalAirdrop({ address }: { address: PublicKey }) {
  const mutation = useRequestAirdrop({ address })
  const [amount, setAmount] = useState('2')

  return (
    <AppModal
      title="Airdrop"
      submitDisabled={!amount || mutation.loading}
      submitLabel="Request Airdrop"
      submit={() => {
        mutation.mutate(parseFloat(amount))
      }}
    >
      <Label htmlFor="amount">Amount</Label>
      <Input id="amount" min="1" onChange={(e) => setAmount(e.target.value)} placeholder="Amount" step="any" type="number" value={amount} />
    </AppModal>
  )
}

function ModalSend({ address }: { address: PublicKey }) {
  const wallet = useWallet()
  const mutation = useTransferSol({ address })
  const [destination, setDestination] = useState('')
  const [amount, setAmount] = useState('1')

  if (!address || !wallet.sendTransaction) {
    return <div>Wallet not connected</div>
  }

  return (
    <AppModal
      title="Send"
      submitDisabled={!destination || !amount || mutation.loading}
      submitLabel="Send"
      submit={() => {
        mutation.mutate({
          destination: new PublicKey(destination),
          amount: parseFloat(amount)
        })
      }}
    >
      <Label htmlFor="destination">Destination</Label>
      <Input
        disabled={mutation.loading}
        id="destination"
        onChange={(e) => setDestination(e.target.value)}
        placeholder="Destination"
        type="text"
        value={destination}
      />
      <Label htmlFor="amount">Amount</Label>
      <Input
        disabled={mutation.loading}
        id="amount"
        min="1"
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
        step="any"
        type="number"
        value={amount}
      />
    </AppModal>
  )
}
