"use client"

import { useFormStatus } from "react-dom"
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface FormSubmitProps {
  children: React.ReactNode,
  disabled?: boolean,
  className?: string,
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link",
}

export const FormSubmit = ({ children, disabled, className, variant }: FormSubmitProps) => {
  const { pending } = useFormStatus();


  return (
    <Button
      disabled={disabled || pending}
      type="submit"
      className={cn("", className)}
      variant={variant}
      size="sm"
    >
      {children}
    </Button>
  )
}
