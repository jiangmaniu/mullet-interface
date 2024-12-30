import type { EffectCallback } from 'react'
import { useEffect } from 'react'
import { history, useLocation } from 'umi'

export default function useFocusEffect(effect: EffectCallback) {
  const location = useLocation()

  if (arguments[1] !== undefined) {
    const message =
      "You passed a second argument to 'useFocusEffect', but it only accepts one argument. " +
      "If you want to pass a dependency array, you can use 'React.useCallback':\n\n" +
      'useFocusEffect(\n' +
      '  React.useCallback(() => {\n' +
      '    // Your code here\n' +
      '  }, [depA, depB])\n' +
      ');'

    console.error(message)
  }

  useEffect(() => {
    let isFocused = false
    let cleanup: undefined | void | (() => void)

    const callback = () => {
      const destroy = effect()

      if (destroy === undefined || typeof destroy === 'function') {
        return destroy
      }

      if (process.env.NODE_ENV !== 'production') {
        let message = 'An effect function must not return anything besides a function, which is used for clean-up.'

        if (destroy === null) {
          message += " You returned 'null'. If your effect does not require clean-up, return 'undefined' (or nothing)."
        } else if (typeof (destroy as any).then === 'function') {
          message +=
            "\n\nIt looks like you wrote 'useFocusEffect(async () => ...)' or returned a Promise. " +
            'Instead, write the async function inside your effect ' +
            'and call it immediately:\n\n' +
            'useFocusEffect(\n' +
            '  React.useCallback(() => {\n' +
            '    async function fetchData() {\n' +
            '      // You can await here\n' +
            '      const response = await MyAPI.getData(someId);\n' +
            '      // ...\n' +
            '    }\n\n' +
            '    fetchData();\n' +
            '  }, [someId])\n' +
            ');'
        } else {
          message += ` You returned '${JSON.stringify(destroy)}'.`
        }

        console.error(message)
      }
    }

    // 初始化时执行一次
    cleanup = callback()
    isFocused = true

    // 监听路由变化
    const unsubscribe = history.listen(() => {
      if (location.pathname === window.location.pathname) {
        // 当前路由获得焦点
        if (!isFocused) {
          if (cleanup !== undefined) {
            cleanup()
          }
          cleanup = callback()
          isFocused = true
        }
      } else {
        // 当前路由失去焦点
        if (cleanup !== undefined) {
          cleanup()
        }
        cleanup = undefined
        isFocused = false
      }
    })

    return () => {
      if (cleanup !== undefined) {
        cleanup()
      }
      unsubscribe()
    }
  }, [effect, location])
}
