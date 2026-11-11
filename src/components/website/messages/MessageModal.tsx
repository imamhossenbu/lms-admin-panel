"use client";

import React from "react";
import { Archive, Mail, Phone, Reply, Trash2 } from "lucide-react";
import type { ContactMessage } from "@/types/website";
import { ModalShell } from "@/components/ui/ModalShell";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { MESSAGE_STATUS, MESSAGE_TOPIC, fmtDateTime } from "./messageMeta";

/** Full message with Reply by email (marks it replied), Archive and Delete. */
export function MessageModal({ message, canManage, onClose, onReply, onArchive, onDelete }: { message: ContactMessage | null; canManage: boolean; onClose: () => void; onReply: (m: ContactMessage) => void; onArchive: (m: ContactMessage) => void; onDelete: (m: ContactMessage) => void }) {
  const m = message;
  const btn = "inline-flex h-10 items-center gap-2 rounded-lg border px-4 body-sm-medium transition-colors";
  return (
    <ModalShell
      isOpen={!!m}
      onClose={onClose}
      title={m ? m.name : "Message"}
      subtitle={m ? `${MESSAGE_TOPIC[m.topic].label} · ${fmtDateTime(m.createdAt)}` : undefined}
      titleIcon={<Mail className="h-5 w-5" />}
      maxWidth="lg"
      footer={
        m && (
          <div className="flex w-full flex-wrap items-center justify-between gap-2">
            {canManage ? (
              <button type="button" onClick={() => onDelete(m)} className={`${btn} border-red/30 text-red hover:bg-red-14`}>
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            ) : (
              <span />
            )}
            <div className="flex gap-2">
              {canManage && m.status !== "ARCHIVED" && (
                <button type="button" onClick={() => onArchive(m)} className={`${btn} border-dash bg-white text-primary-500 hover:border-primary-300`}>
                  <Archive className="h-4 w-4" />
                  Archive
                </button>
              )}
              <button type="button" onClick={() => onReply(m)} className={`${btn} border-transparent bg-brand-orange text-white hover:bg-brand-orange-hover`}>
                <Reply className="h-4 w-4" />
                Reply by email
              </button>
            </div>
          </div>
        )
      }
    >
      {m && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <ToneBadge tone={MESSAGE_TOPIC[m.topic].tone} size="sm">
              {MESSAGE_TOPIC[m.topic].label}
            </ToneBadge>
            <ToneBadge tone={MESSAGE_STATUS[m.status].tone} size="sm" dot>
              {MESSAGE_STATUS[m.status].label}
            </ToneBadge>
          </div>
          <div className="grid gap-2 rounded-lg border border-dash bg-slate-50 p-4 body-sm-regular sm:grid-cols-2">
            <a href={`mailto:${m.email}`} className="inline-flex items-center gap-2 text-primary-500 hover:text-brand-orange">
              <Mail className="h-4 w-4 text-primary-300" />
              <span className="truncate">{m.email}</span>
            </a>
            {m.phone && (
              <a href={`tel:${m.phone.replace(/\s+/g, "")}`} className="inline-flex items-center gap-2 text-primary-500 hover:text-brand-orange">
                <Phone className="h-4 w-4 text-primary-300" />
                {m.phone}
              </a>
            )}
          </div>
          <p className="whitespace-pre-line body-regular text-primary-500">{m.message}</p>
        </div>
      )}
    </ModalShell>
  );
}

export default MessageModal;
