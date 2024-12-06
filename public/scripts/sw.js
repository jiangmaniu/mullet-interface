// 注册pwa
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-wroker.js') //这块注意不要改动
      .then((registration) => {
        // console.log('SW registered: ', registration)
      })
      .catch((registrationError) => {
        // console.log('SW registration failed: ', registrationError)
      })
  })
}
