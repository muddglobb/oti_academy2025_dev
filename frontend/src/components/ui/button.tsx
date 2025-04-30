import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const buttonVariants = cva(
    "inline-flex items-center justify-center rounded-lg text-sm hover:cursor-pointer font-bold",
    {
        variants: {
            variant: {
                default: "bg-primary-500 text-neutral-50 hover:bg-primary-700",
                "learn-more-blue": "bg-neutral-700 text-neutral-50 hover:bg-neutral-900",
                "learn-more-white": "bg-neutral-50 text-neutral-700",
                "FAQ-button": "bg-gradient-to-b from-neutral-50 to-[#959599] text-neutral-900 font-normal",
            },
            size: {
                default: "h-9 px-4 py-2 has-[>svg]:px-3",
                "FAQ-button": "p-5 text-[18px] has-[>svg]:px-5",
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        }
    }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode;
}

function Button({
    className,
    variant,
    size, 
    children,
    ...props
}: ButtonProps) {
    return (
        <button
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
        >
            {children}
        </button>
    )
}

export { Button, buttonVariants }
