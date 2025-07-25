// @ts-nocheck
import { useEffect, useRef, useState } from 'react'

const BouncingAnimation = ({
  children,
  duration = 1000, // 单次动画持续时间(毫秒)
  height = 30, // 弹跳高度(像素)
  delay = 0, // 动画开始延迟(毫秒)
  repeat = true // 是否重复动画
}) => {
  const [position, setPosition] = useState(0)
  const animationRef = useRef(null)
  const startTimeRef = useRef(null)
  const delayRef = useRef(delay)

  // 弹跳函数 - 使用二次贝塞尔曲线模拟弹跳效果
  const bounce = (t) => {
    for (let a = 0, b = 1; 1; a += b, b /= 2) {
      if (t >= (7 - 4 * a) / 11) {
        return -Math.pow((11 - 6 * a - 11 * t) / 4, 2) + Math.pow(b, 2)
      }
    }
  }

  const animate = (timestamp) => {
    // 处理延迟
    if (delayRef.current > 0) {
      delayRef.current -= timestamp - (startTimeRef.current || timestamp)
      startTimeRef.current = timestamp
      animationRef.current = requestAnimationFrame(animate)
      return
    }

    if (!startTimeRef.current) startTimeRef.current = timestamp
    const elapsed = timestamp - startTimeRef.current
    const progress = Math.min(elapsed / duration, 1)

    const bounceProgress = bounce(progress)
    setPosition(bounceProgress * height)

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate)
    } else if (repeat) {
      // 重置动画
      startTimeRef.current = null
      delayRef.current = delay
      animationRef.current = requestAnimationFrame(animate)
    }
  }

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [duration, height, delay, repeat])

  const style = {
    display: 'inline-block',
    transform: `translateY(${-position}px)`,
    transition: 'none' // 禁用CSS过渡以保证requestAnimationFrame的平滑性
  }

  return <div style={style}>{children}</div>
}

// 使用示例 - 三个连续弹跳的圆点
const JumpingLoader = () => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-end',
        height: '100px',
        gap: '10px'
      }}
    >
      <BouncingAnimation duration={800} height={30} delay={0}>
        <div style={{ width: '20px', height: '20px', background: '#ff6b6b', borderRadius: '50%' }} />
      </BouncingAnimation>
      <BouncingAnimation duration={800} height={30} delay={200}>
        <div style={{ width: '20px', height: '20px', background: '#48dbfb', borderRadius: '50%' }} />
      </BouncingAnimation>
      <BouncingAnimation duration={800} height={30} delay={400}>
        <div style={{ width: '20px', height: '20px', background: '#1dd1a1', borderRadius: '50%' }} />
      </BouncingAnimation>
    </div>
  )
}

export default JumpingLoader
