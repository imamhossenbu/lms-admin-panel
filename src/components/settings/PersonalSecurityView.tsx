"use client";

import React from "react";
import { motion } from "framer-motion";
import { MyTwoFactorCard } from "./sections/security/two-factor/MyTwoFactorCard";

/**
 * /settings for team members without the "Settings → View" permission: only their own account security (2FA),
 * so a workspace that requires admin 2FA never strands them without a way to set it up.
 */
export function PersonalSecurityView() {
  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25, ease: "easeOut" }} className="space-y-5 pb-8 text-left">
      <div>
        <h1 className="heading-h4 text-primary-500">Account security</h1>
        <p className="body-sm-regular text-primary-300 mt-0.5">Workspace settings are managed by your admins. You can protect your own account here.</p>
      </div>
      <MyTwoFactorCard />
    </motion.div>
  );
}

export default PersonalSecurityView;
