"use client";

import React, { useState } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { CalendarDays, Clock3, Earth } from "lucide-react";
import type { GeneralSettings } from "@/validations/platformSettingsSchema";
import { AppSelect } from "@/components/ui/AppSelect";
import { ChoiceCardGroup } from "@/components/ui/ChoiceCardGroup";
import { FieldError } from "@/components/courses/create/basic/FieldLabel";
import { SettingsCard } from "../../shared/SettingsCard";
import { SettingsRow } from "../../shared/SettingsRow";
import { TimezoneSelect } from "./TimezoneSelect";
import { CURRENCIES, DATE_FORMATS, WEEK_STARTS, formatDateAs, formatTimeAs } from "./generalUtils";

/** Timezone (searchable), date format (with today's example), 12h/24h, currency and week start. */
export function RegionalCard() {
  const { control } = useFormContext<GeneralSettings>();
  const [timezone, dateFormat] = useWatch({ control, name: ["timezone", "dateFormat"] });
  const [now] = useState(() => new Date());
  const tz = timezone || "UTC";

  return (
    <SettingsCard icon={<Earth className="h-5 w-5" />} title="Regional" description="Dates, times and prices across the admin panel and student app." tone="green">
      <SettingsRow label="Timezone" description="Used for schedules, live classes and reports." htmlFor="general-timezone" required>
        <Controller
          control={control}
          name="timezone"
          render={({ field, fieldState }) => (
            <TimezoneSelect id="general-timezone" value={field.value} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} />
          )}
        />
        <p className="mt-1.5 flex items-center gap-1.5 body-xsm-regular text-primary-300">
          <Clock3 className="h-3.5 w-3.5 shrink-0" />
          It&apos;s {formatTimeAs(now, "12h", tz)} there right now.
        </p>
      </SettingsRow>

      <SettingsRow label="Date format" description="How dates appear in tables, emails and certificates.">
        <Controller
          control={control}
          name="dateFormat"
          render={({ field, fieldState }) => (
            <>
              <AppSelect
                value={field.value}
                onValueChange={(v) => field.onChange(v as GeneralSettings["dateFormat"])}
                options={DATE_FORMATS.map((f) => ({ value: f, label: `${formatDateAs(now, f, tz)}  ·  ${f}` }))}
                icon={<CalendarDays className="h-4 w-4" />}
                className="w-full"
                triggerClassName="w-full body-sm-regular"
              />
              <FieldError message={fieldState.error?.message} />
            </>
          )}
        />
        <p className="mt-1.5 body-xsm-regular text-primary-300">
          Today shows as <span className="body-xsm-medium text-primary-500">{formatDateAs(now, dateFormat ?? "MMM D, YYYY", tz)}</span>
        </p>
      </SettingsRow>

      <SettingsRow label="Time format" description="Clock style for class times and timestamps.">
        <Controller
          control={control}
          name="timeFormat"
          render={({ field }) => (
            <ChoiceCardGroup<GeneralSettings["timeFormat"]>
              name="general-time-format"
              aria-label="Time format"
              columns={2}
              value={field.value}
              onChange={field.onChange}
              options={[
                { value: "12h", title: "12-hour", description: `e.g. ${formatTimeAs(now, "12h", tz)}` },
                { value: "24h", title: "24-hour", description: `e.g. ${formatTimeAs(now, "24h", tz)}` },
              ]}
            />
          )}
        />
      </SettingsRow>

      <SettingsRow label="Currency" description="Course prices, invoices and revenue reports.">
        <Controller
          control={control}
          name="currency"
          render={({ field, fieldState }) => (
            <>
              <AppSelect
                value={field.value}
                onValueChange={(v) => field.onChange(v as GeneralSettings["currency"])}
                options={CURRENCIES.map((c) => ({ value: c.value, label: c.label }))}
                className="w-full"
                triggerClassName="w-full body-sm-regular"
              />
              <FieldError message={fieldState.error?.message} />
            </>
          )}
        />
      </SettingsRow>

      <SettingsRow label="Week starts on" description="First day of calendars and weekly reports.">
        <Controller
          control={control}
          name="weekStartsOn"
          render={({ field }) => (
            <ChoiceCardGroup<GeneralSettings["weekStartsOn"]>
              name="general-week-start"
              aria-label="Week starts on"
              variant="inline"
              value={field.value}
              onChange={field.onChange}
              options={WEEK_STARTS}
              className="min-h-10"
            />
          )}
        />
      </SettingsRow>
    </SettingsCard>
  );
}

export default RegionalCard;
