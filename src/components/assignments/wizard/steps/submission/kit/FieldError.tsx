import React from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Animated field-level error line (for groups that have no built-in error slot). */
export function FieldError({ message, id }: { message?: string; id?: string }) {
  return (
    <AnimatePresence initial={false}>
      {message && (
        <motion.p
          id={id}
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="mt-1.5 body-xsm-regular text-red"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  );
}

export default FieldError;
