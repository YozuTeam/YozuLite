"use client";
import { Button as MUIButton, ButtonProps } from "@mui/material";
import { twMerge } from "tailwind-merge";
import clsx from "clsx";

export default function Button({ className, ...props }: ButtonProps & { className?: string }) {
  return <MUIButton className={twMerge(clsx(className))} {...props} />;
}
