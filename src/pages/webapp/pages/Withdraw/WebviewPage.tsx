export type WebviewComponentProps = {
  onSuccess?: (params?: any) => void
  onDisabledChange?: (disabled: boolean) => void
}

export type WebviewComponentRef = {
  onSubmit: () => void
}

export default function WebviewPage() {
  return <div>WebviewPage</div>
}
