"use client";
import { Button as MUIButton, type ButtonProps } from "@mui/material";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export default function Button({ className, ...props }: ButtonProps & { className?: string }) {
  return <MUIButton className={twMerge(clsx(className))} {...props} />;
}
