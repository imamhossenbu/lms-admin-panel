import React from "react";
import { PrimaryButton, PrimaryButtonProps } from "./primary-button";

export const OutlineButton = React.forwardRef<
  HTMLButtonElement,
  PrimaryButtonProps
>((props, ref) => {
  return <PrimaryButton ref={ref} variant="outline" {...props} />;
});

OutlineButton.displayName = "OutlineButton";
