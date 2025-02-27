/**获取webview页面传递过来的参数，有时用const [searchParams] = useSearchParams()不生效 */
export default function useWebviewPageSearchParams() {
  // const searchParams = qs.parse(location.search, { ignoreQueryPrefix: true })

  return new URLSearchParams(location.search)
}
