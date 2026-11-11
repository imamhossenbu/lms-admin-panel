"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { ChevronDown, LogOut, UserCog } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { Avatar } from "@/components/ui/Avatar";

/** Top bar: workspace label and the teacher's menu (Profile, Sign out). */
export function TeacherNavbar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((s) => s.auth.user);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const signOut = () => {
    setOpen(false);
    dispatch(logout());
    toast.success("Signed out", { description: "See you next class!" });
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-dash bg-white px-4 sm:px-6">
      <p className="body-sm-medium text-primary-400">Teacher mode</p>
      <div ref={ref} className="relative">
        <motion.button type="button" whileTap={{ scale: 0.97 }} onClick={() => setOpen((v) => !v)} aria-haspopup="menu" aria-expanded={open} className="flex items-center gap-2.5 rounded-xl border border-dash px-2 py-1.5 hover:border-primary-300">
          <Avatar name={user?.name ?? "Teacher"} src={user?.avatar ?? undefined} size="sm" />
          <span className="hidden text-left sm:block">
            <span className="block body-sm-medium text-primary-500">{user?.name ?? "Teacher"}</span>
            <span className="block body-2xsm-regular text-primary-300">Instructor</span>
          </span>
          <ChevronDown className="h-4 w-4 text-primary-300" />
        </motion.button>
        <AnimatePresence>
          {open && (
            <motion.div role="menu" initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.15 }} className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl border border-dash bg-white p-1.5 shadow-lg">
              <Link href="/teach/profile" role="menuitem" onClick={() => setOpen(false)} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 body-sm-medium text-primary-500 hover:bg-slate-50">
                <UserCog className="h-4 w-4" />
                Profile
              </Link>
              <button type="button" role="menuitem" onClick={signOut} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 body-sm-medium text-red hover:bg-red-14">
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}

export default TeacherNavbar;
