// 移动端工具方法
export function mergeCss(...objectsArray: React.CSSProperties[]) {
  return objectsArray.reduce((acc, obj) => {
    return { ...acc, ...obj }
  }, {})
}
