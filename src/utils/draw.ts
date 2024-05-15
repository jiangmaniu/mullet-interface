// @ts-nocheck

// 分享海报
class Draw {
  constructor(context, canvas, use2dCanvas = false) {
    this.ctx = context
    this.canvas = canvas || null
    this.use2dCanvas = use2dCanvas
  }

  roundRect(x, y, w, h, r, fill = true, stroke = false) {
    if (r < 0) return
    const ctx = this.ctx

    ctx.beginPath()
    ctx.arc(x + r, y + r, r, Math.PI, (Math.PI * 3) / 2)
    ctx.arc(x + w - r, y + r, r, (Math.PI * 3) / 2, 0)
    ctx.arc(x + w - r, y + h - r, r, 0, Math.PI / 2)
    ctx.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI)
    ctx.lineTo(x, y + r)
    if (stroke) ctx.stroke()
    if (fill) ctx.fill()
  }

  drawView(box, style = {}) {
    const ctx = this.ctx
    const { left: x, top: y, width: w, height: h } = box
    const { borderRadius = 0, borderWidth = 0, borderColor, color = '#000', backgroundColor = 'transparent' } = style
    ctx.save()
    // 外环
    if (borderWidth > 0) {
      ctx.fillStyle = borderColor || color
      this.roundRect(x, y, w, h, borderRadius)
    }

    // 内环
    ctx.fillStyle = backgroundColor
    const innerWidth = w - 2 * borderWidth
    const innerHeight = h - 2 * borderWidth
    const innerRadius = borderRadius - borderWidth >= 0 ? borderRadius - borderWidth : 0
    this.roundRect(x + borderWidth, y + borderWidth, innerWidth, innerHeight, innerRadius)
    ctx.restore()
  }

  async drawImage(img, box = {}, style = {}) {
    return new Promise((resolve, reject) => {
      const ctx = this.ctx
      const canvas = this.canvas

      const { borderRadius = 0 } = style
      const { left: x, top: y, width: w, height: h } = box
      ctx.save()
      this.roundRect(x, y, w, h, borderRadius, false, false)
      ctx.clip()

      const _drawImage = (img) => {
        if (this.use2dCanvas) {
          const image = new Image()
          image.onload = () => {
            ctx.drawImage(image, x, y, w, h)
            ctx.restore()
            resolve()
          }
          image.onerror = () => {
            reject(new Error(`createImage fail: ${img}`))
          }
          image.src = img
        } else {
          ctx.drawImage(img, x, y, w, h)
          ctx.restore()
          resolve()
        }
      }

      const isTempFile = /^wxfile:\/\//.test(img)
      const isNetworkFile = /^https?:\/\//.test(img)
      const isBase64 = /^data:(image|application)\/([\w-]+);base64,/.test(img)
      if (isTempFile) {
        _drawImage(img)
      } else if (isBase64) {
        _drawImage(img)
      } else if (isNetworkFile) {
        this.getNetworkImg2Base64(img)
          .then((base64) => {
            _drawImage(base64)
          })
          .catch((err) => {
            reject(err?.message)
          })
      } else {
        reject(new Error(`image format error: ${img}`))
      }
    })
  }

  // eslint-disable-next-line complexity
  drawText(text, box = {}, style = {}) {
    const ctx = this.ctx
    let { left: x, top: y, width: w, height: h } = box
    let {
      color = '#000',
      lineHeight = '1.4em',
      fontSize = 14,
      textAlign = 'left',
      verticalAlign = 'top',
      backgroundColor = 'transparent',
      isBold
    } = style

    if (typeof lineHeight === 'string') {
      // 2em
      lineHeight = Math.ceil(parseFloat(lineHeight.replace('em')) * fontSize)
    }
    if (!text || lineHeight > h) return

    ctx.save()
    ctx.textBaseline = 'top'
    ctx.font = isBold ? `${fontSize}px bold sans-serif` : `${fontSize}px sans-serif`
    ctx.textAlign = textAlign

    // 背景色
    ctx.fillStyle = backgroundColor
    this.roundRect(x, y, w, h, 0)

    // 文字颜色
    ctx.fillStyle = color

    // 水平布局
    switch (textAlign) {
      case 'left':
        break
      case 'center':
        x += 0.5 * w
        break
      case 'right':
        x += w
        break
      default:
        break
    }

    const textWidth = ctx.measureText(text).width
    const actualHeight = Math.ceil(textWidth / w) * lineHeight
    let paddingTop = Math.ceil((h - actualHeight) / 2)
    if (paddingTop < 0) paddingTop = 0

    // 垂直布局
    switch (verticalAlign) {
      case 'top':
        break
      case 'middle':
        y += paddingTop
        break
      case 'bottom':
        y += 2 * paddingTop
        break
      default:
        break
    }

    const inlinePaddingTop = Math.ceil((lineHeight - fontSize) / 2)

    // 不超过一行
    if (textWidth <= w) {
      ctx.fillText(text, x, y + inlinePaddingTop)
      return
    }

    // 多行文本
    const chars = text.split('')
    const _y = y

    // 逐行绘制
    let line = ''
    for (const ch of chars) {
      const testLine = line + ch
      const testWidth = ctx.measureText(testLine).width

      if (testWidth > w) {
        ctx.fillText(line, x, y + inlinePaddingTop)
        y += lineHeight
        line = ch
        if (y + lineHeight > _y + h) break
      } else {
        line = testLine
      }
    }

    // 避免溢出
    if (y + lineHeight <= _y + h) {
      ctx.fillText(line, x, y + inlinePaddingTop)
    }
    ctx.restore()
  }

  async drawNode(element) {
    const { layoutBox, computedStyle, name } = element
    const { src, text } = element.attributes
    if (name === 'view') {
      this.drawView(layoutBox, computedStyle)
    } else if (name === 'image') {
      await this.drawImage(src, layoutBox, computedStyle)
    } else if (name === 'text') {
      this.drawText(text, layoutBox, computedStyle)
    }
    const childs = Object.values(element.children)
    for (const child of childs) {
      await this.drawNode(child)
    }
  }

  //将远程图片转化为base64
  getNetworkImg2Base64(img) {
    function getBase64Image(img, width, height) {
      //width、height调用时传入具体像素值，控制大小 ,不传则默认图像大小
      let canvas = document.createElement('canvas') as HTMLCanvasElement
      canvas.width = width ? width : img.width
      canvas.height = height ? height : img.height

      let ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      let dataURL = canvas.toDataURL()
      return dataURL
    }
    let image = new Image()
    // image.crossOrigin = 'anonymous'; // 设置图像的跨域属性
    image.setAttribute('crossOrigin', 'anonymous') //设置图片可跨域
    // image.src = img;
    image.src = img + '?tamp=' + new Date().valueOf() //图片的连接地址
    return new Promise((resolve, reject) => {
      image.onload = function () {
        resolve(getBase64Image(image)) //将base64传给done上传处理
      }
      image.onerror = () => {
        reject(new Error(`network img download fail: ${img}`))
      }
    })
  }

  /* 绘图方法 */
  // 绘制矩形路径
  drawRoundRectPath(width, height, radius) {
    const ctx = this.ctx
    ctx.beginPath(0)
    // 从右下角顺时针绘制，弧度从0到1/2PI
    ctx.arc(width - radius, height - radius, radius, 0, Math.PI / 2)

    // 矩形下边线
    ctx.lineTo(radius, height)

    // 左下角圆弧，弧度从1/2PI到PI
    ctx.arc(radius, height - radius, radius, Math.PI / 2, Math.PI)

    // 矩形左边线
    ctx.lineTo(0, radius)

    // 左上角圆弧，弧度从PI到3/2PI
    ctx.arc(radius, radius, radius, Math.PI, (Math.PI * 3) / 2)

    // 上边线
    ctx.lineTo(width - radius, 0)

    // 右上角圆弧
    ctx.arc(width - radius, radius, radius, (Math.PI * 3) / 2, Math.PI * 2)

    // 右边线
    ctx.lineTo(width, height - radius)
    ctx.closePath()
  }

  /** 该方法用来绘制一个有填充色的圆角矩形
   *@param ctx:canvas的上下文环境
   *@param x:左上角x轴坐标
   *@param y:左上角y轴坐标
   *@param width:矩形的宽度
   *@param height:矩形的高度
   *@param radius:圆的半径
   *@param fillColor:填充颜色
   **/
  fillRoundRect(x, y, width, height, radius, fillColor) {
    const ctx = this.ctx
    // 圆的直径必然要小于矩形的宽高
    if (2 * radius > width || 2 * radius > height) {
      return false
    }

    ctx.save()
    ctx.translate(x, y)
    // 绘制圆角矩形的各个边
    this.drawRoundRectPath(ctx, width, height, radius)
    ctx.fillStyle = fillColor || '#000' // 若是给定了值就用给定的值否则给予默认值
    ctx.fill()
    ctx.restore()
  }

  /**
   * 循环写字
   *
   * example. 商品名称写字-提示
    writeText(morningTitle, {
      font      : 'normal normal 20px sans-serif',
      fontColor : '#333',
      areaWidth : (424 * scale),
      areaX     : (52 * scale),
      areaY     : (528 * scale),
      lineNum   : 2,
      lineHeight: (43 * scale),
    });
  */
  writeText(text, setting) {
    const ctx = this.ctx
    const { font, fontColor, areaWidth, areaX, areaY, lineNum, lineHeight } = setting

    // 文字样式
    ctx.font = font
    ctx.fillStyle = fontColor

    // 逐字累加计算宽度
    // 行数组
    const lines = []
    // 当前文字，默认空字符串
    let line = ''
    // 文字数组
    const array = text.split('')
    // 循环
    for (let index = 0; index < array.length; index++) {
      const element = array[index]
      line = line + element
      const metrics = ctx.measureText(line)
      if (metrics.width >= areaWidth) {
        if (lines.length + 1 === lineNum) {
          line = line.substring(0, line.length - 3) + '......'
          lines.push(line)
          break
        } else {
          lines.push(line)
          line = ''
        }
      }
      if (index === array.length - 1) {
        lines.push(line)
      }
    }

    // 循环写字
    for (let i = 0; i < lines.length; i++) {
      const item = lines[i]
      ctx.fillText(item, areaX, areaY + i * lineHeight)
    }
  }
}

export default Draw
