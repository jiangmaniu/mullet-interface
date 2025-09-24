import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/utils/cn'
import * as SliderPrimitive from '@radix-ui/react-slider'
import * as React from 'react'

type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> & {
  showTooltip?: boolean
  tooltipFormat?: (value: number[]) => React.ReactNode
  interval?: number
}

const SliderTooltip = React.forwardRef<React.ComponentRef<typeof SliderPrimitive.Root>, SliderProps>(
  ({ className, showTooltip = false, onValueChange, tooltipFormat, ...props }, ref) => {
    const [value, setValue] = React.useState<number[]>((props.defaultValue as number[]) ?? (props.value as number[]) ?? [0])
    const [innerInterval] = React.useState<number>(props.interval ?? props.step ?? 25)
    const numberOfMarks = Math.floor(props.max ?? 100 / innerInterval) + 1
    const marks = Array.from({ length: numberOfMarks }, (_, i) => i * innerInterval)

    React.useEffect(() => {
      if (props.value) {
        setValue(props.value)
      }
    }, [props.value])

    function tickIndex(value: number): number {
      // Calculate the index based on the value
      return Math.floor(value / innerInterval)
    }

    function calculateTickPercent(index: number, max: number): number {
      // Calculate the percentage from left of the slider's width
      const percent = ((index * innerInterval) / max) * 100
      return percent
    }

    function handleValueChange(v: number[]) {
      setValue(v)
      if (onValueChange) onValueChange(v)
    }

    const [showTooltipState, setShowTooltipState] = React.useState(false)
    const handlePointerDown = () => {
      setShowTooltipState(true)
    }

    const handlePointerUp = () => {
      setShowTooltipState(false)
    }

    React.useEffect(() => {
      document.addEventListener('pointerup', handlePointerUp)
      return () => {
        document.removeEventListener('pointerup', handlePointerUp)
      }
    }, [])

    return (
      <SliderPrimitive.Root
        data-slot="slider"
        ref={ref}
        className={cn('relative flex w-full touch-none select-none items-center', className)}
        onValueChange={handleValueChange}
        onPointerDown={handlePointerDown}
        {...props}
      >
        <SliderPrimitive.Track
          data-slot="slider-track"
          className={cn(
            'relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-2.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5'
          )}
        >
          <div className="w-full items-center flex  h-full">
            <div className="flex-1 w-full h-0.5 bg-[#3B3D52]"></div>
          </div>
          <SliderPrimitive.Range
            data-slot="slider-range"
            className={cn(
              'bg-[#EED94C] top-1/2 -translate-y-1/2 absolute data-[orientation=horizontal]:h-0.5 data-[orientation=vertical]:w-full'
            )}
          />
          {marks.map((_, i) => (
            <div
              id={`${i}`}
              key={`${i}`}
              role="presentation"
              className={cn('text-sm h-2.5 w-2.5 rounded-full absolute top-1/2 -translate-y-1/2', {
                ' text-secondary z-1 bg-[#3B3D52]': i > tickIndex(value[0]!),
                'text-primary bg-[#EED94C]': i <= tickIndex(value[0]!)
              })}
              style={{
                left: `${calculateTickPercent(i, props.max ?? 100)}%`,
                translate: `-${calculateTickPercent(i, props.max ?? 100)}%`
              }}
            />
          ))}
        </SliderPrimitive.Track>

        <TooltipProvider>
          <Tooltip open={showTooltip && showTooltipState}>
            <TooltipTrigger asChild>
              <SliderPrimitive.Thumb
                data-slot="slider-thumb"
                className="border-[#EED94C] bg-[#0E123A] ring-ring/50 block size-3.5 shrink-0 rounded-full border-2 shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50"
                onMouseEnter={() => setShowTooltipState(true)}
                onMouseLeave={() => setShowTooltipState(false)}
              />
            </TooltipTrigger>
            <TooltipContent className="w-auto p-2 mb-1">
              {tooltipFormat ? tooltipFormat(value) : <div className="font-medium">{value[0]}%</div>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SliderPrimitive.Root>
    )
  }
)

SliderTooltip.displayName = 'SliderTooltip'
export default SliderTooltip
