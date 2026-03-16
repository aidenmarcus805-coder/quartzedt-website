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
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50 h-8">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-hidden rounded-full bg-zinc-200 select-none h-1 w-full"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="bg-black select-none h-full"
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            className="block size-5 shrink-0 rounded-full border-[1.5px] border-black bg-white shadow-md transition-transform hover:scale-110 active:scale-90 select-none focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
