"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { AnimatePresence, motion } from "framer-motion";
import { Lock, ShoppingCart } from "lucide-react";
import type { PaymentSettings } from "@/validations/platformSettingsSchema";
import { IconSectionCard } from "@/components/ui/IconSectionCard";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { cn } from "@/lib/cn";
import { GATEWAYS, GATEWAY_TILE, formatMoney, taxExample, type Currency } from "./paymentsMeta";

/** Student-facing checkout mock: enabled gateways become payment options, totals follow the tax settings. */
export function CheckoutPreviewCard({ currency }: { currency: Currency }) {
  const { control } = useFormContext<PaymentSettings>();
  const values = useWatch({ control });
  const enabled = GATEWAYS.filter((g) => values[g.key]?.enabled);
  const ex = taxExample(Number(values.taxRate), !!values.taxInclusive, currency);
  const m = (n: number) => formatMoney(n, currency);

  return (
    <IconSectionCard icon={<ShoppingCart className="h-5 w-5" />} title="Checkout preview" description="What students see when they pay." tone="purple">
      <div className="space-y-4 rounded-xl border border-dash p-4">
        <div className="flex items-center gap-3">
          <span className="h-10 w-14 shrink-0 rounded-lg bg-brand-orange-light" aria-hidden />
          <div className="min-w-0 flex-1">
            <p className="truncate body-sm-medium text-primary-500">UI/UX Design Masterclass</p>
            <p className="body-xsm-regular text-primary-300">Lifetime access</p>
          </div>
          <p className="body-sm-medium font-semibold! text-primary-500">{m(ex.price)}</p>
        </div>

        <div>
          <p className="mb-2 body-xsm-medium text-primary-400">Pay with</p>
          <div role="radiogroup" aria-label="Payment method (preview)" className="space-y-2">
            <AnimatePresence initial={false}>
              {enabled.map((g, i) => (
                <motion.div
                  key={g.key}
                  layout
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  <div className={cn("flex items-center gap-3 rounded-xl border px-3 py-2.5", i === 0 ? "border-brand-orange bg-brand-orange-light" : "border-dash bg-white")}>
                    <span className={cn("flex h-4 w-4 shrink-0 items-center justify-center rounded-full border bg-white", i === 0 ? "border-brand-orange" : "border-dash")}>
                      {i === 0 && <span className="h-2 w-2 rounded-full bg-brand-orange" />}
                    </span>
                    <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", GATEWAY_TILE[g.tone])}>{g.icon}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate body-xsm-medium text-primary-500">{g.checkoutLabel}</span>
                      <span className="block truncate body-2xsm-regular text-primary-300">{g.checkoutHint}</span>
                    </span>
                    {values[g.key]?.mode === "TEST" && (
                      <ToneBadge tone="yellow" size="sm">
                        Test
                      </ToneBadge>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {enabled.length === 0 && (
              <p className="rounded-xl border border-dashed border-red/40 bg-red-14 px-3 py-3 text-center body-xsm-regular text-red">
                No payment method — students can&apos;t check out.
              </p>
            )}
          </div>
        </div>

        <dl className="space-y-1.5 border-t border-dash pt-3 body-xsm-regular">
          <div className="flex justify-between text-primary-300">
            <dt>Subtotal</dt>
            <dd>{m(ex.net)}</dd>
          </div>
          <div className="flex justify-between text-primary-300">
            <dt>Tax ({Number.isFinite(Number(values.taxRate)) ? Number(values.taxRate) : 0}%)</dt>
            <dd>{m(ex.tax)}</dd>
          </div>
          <div className="flex justify-between body-sm-medium font-semibold! text-primary-500">
            <dt>Total</dt>
            <dd>{m(ex.total)}</dd>
          </div>
        </dl>

        <span
          aria-hidden
          className={cn(
            "flex h-10 w-full items-center justify-center gap-2 rounded-lg body-sm-medium",
            enabled.length ? "bg-brand-orange text-white" : "bg-slate-200 text-primary-300"
          )}
        >
          <Lock className="h-4 w-4" /> Pay {m(ex.total)}
        </span>
      </div>
    </IconSectionCard>
  );
}

export default CheckoutPreviewCard;
