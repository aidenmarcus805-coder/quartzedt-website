"use client"

import * as React from "react"
import { Slider as SliderPrimitive } from "@base-ui/react/slider"

// Standalone cn implementation to avoid ReferenceErrors
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  ...props
}: SliderPrimitive.Root.Props) {
  const _values = React.useMemo(
    () =>
      Array.isArray(value)
        ? value
        : Array.isArray(defaultValue)
          ? defaultValue
          : [min, max],
    [value, defaultValue, min, max]
  )

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="center"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 h-8">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-zinc-100 select-none h-2 w-full transition-colors duration-300 group-hover:bg-zinc-200/50"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-black select-none h-full transition-all duration-300 ease-out"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="block size-6 shrink-0 rounded-full border border-white/50 bg-white/70 backdrop-blur-md shadow-[0_4px_12px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.8)] transition-all duration-300 ease-out hover:scale-110 active:scale-95 select-none focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
