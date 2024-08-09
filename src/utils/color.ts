export function colorToRGBA(color: string, alpha = 1) {
  // 检查是否为 RGB 格式
  if (color.startsWith('rgb')) {
    const rgb = color.match(/\d+/g)
    if (rgb && rgb.length >= 3) {
      return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${alpha})`
    }
  }

  // 处理 Hex 格式
  let _color = color.replace('#', '')

  // 将 3 位颜色扩展为 6 位
  if (color.length === 3) {
    _color = color[0] + color[0] + color[1] + color[1] + color[2] + color[2]
  }

  // 如果不是有效的 6 位 Hex，返回原始输入
  if (_color.length !== 6) {
    return _color
  }

  // 解析 R、G、B 值
  const r = parseInt(_color.substring(0, 2), 16)
  const g = parseInt(_color.substring(2, 4), 16)
  const b = parseInt(_color.substring(4, 6), 16)

  // 返回 RGBA 格式的字符串
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}
