const fs = require('fs-extra')
const path = require('path')

const distDir = path.join(__dirname, '..', 'dist', 'platform')
const publicDir = path.join(__dirname, '..', 'public', 'platform')

fs.remove(distDir)
  .then(() => {
    console.log(`已删除目录及其所有内容: ${distDir}`)

    // 重建目录
    return fs.mkdir(distDir)
  })
  .then(() => {
    // 复制 public/platform/ 到 dist/platform/
    return fs.copy(publicDir, distDir)
  })
  .then(() => {
    console.log(`已复制 ${publicDir} 到 ${distDir}`)
  })
  .catch((err) => {
    console.error('处理目录时出错:', err)
  })
