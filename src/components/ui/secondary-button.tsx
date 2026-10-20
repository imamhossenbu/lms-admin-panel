import React from "react";
import { PrimaryButton, PrimaryButtonProps } from "./primary-button";

export const SecondaryButton = React.forwardRef<
  HTMLButtonElement,
  PrimaryButtonProps
>((props, ref) => {
  return <PrimaryButton ref={ref} variant="secondary" {...props} />;
});

SecondaryButton.displayName = "SecondaryButton";
