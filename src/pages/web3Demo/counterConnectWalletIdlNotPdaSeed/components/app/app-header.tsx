import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { ClusterUiSelect } from '../cluster-ui'
import { Button } from '../ui/button'

export function AppHeader({ links = [] }: { links: { label: string; path: string }[] }) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <header className="relative z-50 px-4 py-2 bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-400">
      <div className="mx-auto flex justify-between items-center">
        <div className="flex items-baseline gap-4">
          <a className="text-xl hover:text-neutral-500 dark:hover:text-white" href="/">
            <span>Tradedapp001</span>
          </a>
          <div className="hidden md:flex items-center">
            <ul className="flex gap-4 flex-nowrap items-center">
              {links.map(({ label, path }) => (
                <li key={path}>
                  <a className={`hover:text-neutral-500 dark:hover:text-white`} href={path}>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setShowMenu(!showMenu)}>
          {showMenu ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        <div className="hidden md:flex items-center gap-4">
          <WalletMultiButton />
          <ClusterUiSelect />
        </div>

        {showMenu && (
          <div className="md:hidden fixed inset-x-0 top-[52px] bottom-0 bg-neutral-100/95 dark:bg-neutral-900/95 backdrop-blur-sm">
            <div className="flex flex-col p-4 gap-4 border-t dark:border-neutral-800">
              <ul className="flex flex-col gap-4">
                {links.map(({ label, path }) => (
                  <li key={path}>
                    <a
                      className={`hover:text-neutral-500 dark:hover:text-white block text-lg py-2`}
                      href={path}
                      onClick={() => setShowMenu(false)}
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-4">
                <WalletMultiButton />
                <ClusterUiSelect />
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
