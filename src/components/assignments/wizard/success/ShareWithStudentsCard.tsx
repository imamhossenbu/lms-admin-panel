"use client";

import React from "react";
import { Copy, Mail, MessageCircle, Send } from "lucide-react";
import { toast } from "sonner";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { CopyButton } from "@/components/ui/CopyButton";
import { ShareTargetButton } from "./ShareTargetButton";

export interface ShareWithStudentsCardProps {
  link: string;
  title: string;
}

/** "Share with Students": read-only link + copy, and share targets (email, WhatsApp, Facebook, X). */
export function ShareWithStudentsCard({ link, title }: ShareWithStudentsCardProps) {
  const message = `New assignment: ${title}`;
  const enc = encodeURIComponent;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Link copied", { description: link });
    } catch {
      toast.error("Could not copy", { description: "Your browser blocked clipboard access." });
    }
  };

  return (
    <IconSectionCard icon={<Send className="h-5 w-5" />} title="Share with Students" description="Let your students know about this new assignment." className="h-full" bodyClassName="mt-4">
      <div className="flex items-center gap-2 rounded-lg border border-dash bg-gray-bg py-1.5 pl-3.5 pr-1.5">
        <input
          readOnly
          value={link}
          aria-label="Assignment link"
          onFocus={(e) => e.target.select()}
          className="min-w-0 flex-1 truncate bg-transparent body-sm-regular text-primary-400 outline-none"
        />
        <CopyButton value={link} label="Link copied" className="h-8 w-8 bg-white" />
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <ShareTargetButton label="Copy link" tone="border border-dash bg-white text-primary-400" onClick={() => void copy()}>
          <Copy className="h-4.5 w-4.5" />
        </ShareTargetButton>
        <ShareTargetButton label="Share by email" tone="bg-blue-14 text-blue" href={`mailto:?subject=${enc(message)}&body=${enc(`${message}\n${link}`)}`}>
          <Mail className="h-4.5 w-4.5" />
        </ShareTargetButton>
        <ShareTargetButton label="Share on WhatsApp" tone="bg-green text-white" href={`https://wa.me/?text=${enc(`${message} ${link}`)}`}>
          <MessageCircle className="h-4.5 w-4.5" />
        </ShareTargetButton>
        <ShareTargetButton label="Share on Facebook" tone="bg-blue text-white" href={`https://www.facebook.com/sharer/sharer.php?u=${enc(link)}`}>
          <span className="title-bold">f</span>
        </ShareTargetButton>
        <ShareTargetButton label="Share on X" tone="bg-primary-500 text-white" href={`https://twitter.com/intent/tweet?text=${enc(message)}&url=${enc(link)}`}>
          <span className="title-bold">X</span>
        </ShareTargetButton>
      </div>
    </IconSectionCard>
  );
}

export default ShareWithStudentsCard;
