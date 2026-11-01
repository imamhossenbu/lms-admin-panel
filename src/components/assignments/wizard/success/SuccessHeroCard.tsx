"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, Plus } from "lucide-react";
import { PrimaryButton } from "@/components/ui/primary-button";
import { SecondaryButton } from "@/components/ui/secondary-button";
import { SuccessCheckBurst } from "./SuccessCheckBurst";

export interface SuccessHeroCardProps {
  title: string;
  moduleLabel: string;
  published: boolean;
  onView: () => void;
  onCreateAnother: () => void;
  onGoToList: () => void;
}

/** Big centred confirmation: animated check, headline, message and the three primary actions. */
export function SuccessHeroCard({ title, moduleLabel, published, onView, onCreateAnother, onGoToList }: SuccessHeroCardProps) {
  return (
    <div className="flex flex-col items-center px-4 pt-4 text-center">
      <SuccessCheckBurst />
      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
        className="mt-2 heading-h3 font-bold! text-primary-500"
      >
        Assignment Created Successfully!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="mt-2 max-w-xl body-l-medium text-primary-300"
      >
        The assignment <span className="font-semibold! text-primary-500">&ldquo;{title}&rdquo;</span> has been created
        {published ? " and published" : " as a draft"}
        {moduleLabel ? ` in ${moduleLabel}` : ""}.
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
        className="mt-6 flex flex-wrap items-center justify-center gap-3"
      >
        <PrimaryButton size="lg" leftIcon={<Eye />} rightIcon={<ArrowRight />} onClick={onView} className="bg-blue! hover:bg-blue/90! px-8">
          View Assignment
        </PrimaryButton>
        <SecondaryButton size="lg" leftIcon={<Plus />} onClick={onCreateAnother} className="text-blue! px-8">
          Create Another
        </SecondaryButton>
      </motion.div>
      <motion.button
        type="button"
        whileTap={{ scale: 0.96 }}
        onClick={onGoToList}
        className="mt-5 inline-flex cursor-pointer items-center gap-1.5 body-medium text-blue hover:underline"
      >
        Go to Assignments List
        <ArrowRight className="h-4 w-4" />
      </motion.button>
    </div>
  );
}

export default SuccessHeroCard;
