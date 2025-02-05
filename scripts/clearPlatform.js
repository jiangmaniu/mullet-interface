const fs = require('fs-extra')
const path = require('path')

const dir = path.join(__dirname, '..', 'dist', 'platform')

fs.remove(dir)
  .then(() => {
    console.log(`已删除目录及其所有内容: ${dir}`)

    // 重建目录
    fs.mkdir(dir)
  })
  .catch((err) => {
    console.error('删除目录时出错:', err)
  })
