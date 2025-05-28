"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/lib/utils"

function HelpAccordion({
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return <AccordionPrimitive.Root data-slot="accordion" {...props} />
}

function HelpAccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn(" last:border-b-0", className)}
      {...props}
    />
  )
}

function HelpAccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "active:rounded-t-lg focus-visible:border-ring p-3 hover:cursor-pointer border focus-visible:ring-ring/50 flex border-2 border-neutral-500 justify-between gap-4 rounded-md text-left transition-all focus-visible:ring-[3px] disabled:pointer-events-none disabled:opacity-50 [&[data-state=open]>svg]:rotate-180 w-full [&[data-state=open]]:rounded-t-md [&[data-state=open]]:rounded-b-none [&[data-state=open]]:border-b-0 text-[12px]",
          className
        )}
        {...props}
      >
        {children}
        <ChevronDownIcon className="text-muted-foreground pointer-events-none size-4 shrink-0 translate-y-0.5 transition-transform duration-200"/>
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function HelpAccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      data-slot="accordion-content"
      className="data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down overflow-hidden text-sm"
      {...props}
    >
      <div className={cn("px-3 pb-3 rounded-b-md border-2 border-t-0 border-neutral-500 ", className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
}

export { HelpAccordion, HelpAccordionItem, HelpAccordionTrigger, HelpAccordionContent }