import { Button } from "@/components/ui/button"

const variants = [
  "default",
  "destructive",
  "outline",
  "secondary",
  "ghost",
  "link",
] as const
const sizes = ["default", "sm", "lg", "icon"] as const

export default function ButtonShowcase() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex gap-20" data-component-container="">
        {variants.map((variant) =>
          sizes.map((size) => (
            <div key={`${variant}-${size}`} className="flex flex-col gap-10">
              <Button
                variant={variant}
                size={size}
                data-component-root={`${variant} · ${size} · normal`}
              >
                Button
              </Button>
              <Button
                variant={variant}
                size={size}
                data-component-root={`${variant} · ${size} · hovered`}
              >
                Button
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
