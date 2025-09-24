import type React from 'react'
import { useModal, type NiceModalHandler } from '@ebay/nice-modal-react'

export function useNiceModal(): NiceModalHandler & { setVisible: (visible: boolean) => void }
export function useNiceModal(modal: string, args?: Record<string, unknown>): NiceModalHandler & { setVisible: (visible: boolean) => void }
export function useNiceModal<C extends any, P extends Partial<Record<string, unknown>> = Partial<Record<string, unknown>>>(
  modal: React.FC<C>,
  args?: P
): (Omit<NiceModalHandler, 'show'> & { show: (args?: P) => Promise<unknown> }) & { setVisible: (visible: boolean) => void }

export function useNiceModal(...args: any[]): any {
  const modal = useModal as any
  const handler = modal(...args)
  return {
    ...handler,
    setVisible: (visible: boolean) => {
      visible ? handler.show() : handler.hide()
    }
  }
}
