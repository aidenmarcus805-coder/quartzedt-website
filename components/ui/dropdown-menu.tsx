"use client"

import * as React from "react"
import { Menu } from "@base-ui/react/menu"
import { cn } from "@/lib/utils"

function DropdownMenu({ ...props }: Menu.Root.Props) {
  return <Menu.Root {...props} />
}

function DropdownMenuTrigger({ ...props }: Menu.Trigger.Props) {
  return <Menu.Trigger data-slot="dropdown-menu-trigger" {...props} />
}

function DropdownMenuPortal({ ...props }: Menu.Portal.Props) {
  return <Menu.Portal {...props} />
}

function DropdownMenuContent({
  className,
  sideOffset = 8,
  align,
  ...props
}: Menu.Popup.Props & {
  sideOffset?: number
  align?: React.ComponentProps<typeof Menu.Positioner>["align"]
}) {
  return (
    <Menu.Portal>
      <Menu.Positioner sideOffset={sideOffset} align={align}>
        <Menu.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            "z-50 min-w-48 overflow-hidden rounded-xl border border-border/40 bg-popover/80 p-1 text-popover-foreground shadow-lg backdrop-blur-2xl outline-none",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
            // Quartz Dark Mode Specifics
            "dark:border-white/10 dark:bg-obsidian-surface/70 dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]",
            className
          )}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  )
}

function DropdownMenuItem({
  className,
  ...props
}: Menu.Item.Props) {
  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-medium outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
        // Quartz alignment
        "hover:bg-black/5 dark:hover:bg-white/5",
        className
      )}
      {...props}
    />
  )
}

function DropdownMenuSeparator({
  className,
  ...props
}: Menu.Separator.Props) {
  return (
    <Menu.Separator
      data-slot="dropdown-menu-separator"
      className={cn("-mx-1 my-1 h-px bg-border/40 dark:bg-white/5", className)}
      {...props}
    />
  )
}

function DropdownMenuLabel({
  className,
  ...props
}: React.ComponentProps<typeof Menu.GroupLabel>) {
  return (
    <Menu.GroupLabel
      data-slot="dropdown-menu-label"
      className={cn(
        "px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuPortal,
}
