"use client";

import React, { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronDown, ChevronLeft, ChevronRight, Check } from "lucide-react";
import { toast } from "sonner";

interface DateRangePickerProps {
  initialRange?: string;
  onRangeApply?: (range: string) => void;
}

const PRESETS = [
  "Today",
  "Yesterday",
  "Last 7 days",
  "Last 30 days",
  "This Month",
  "Custom Range",
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DateRangePicker({
  initialRange = "Oct 01 - Oct 20, 2026",
  onRangeApply,
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState("Last 30 days");
  const [startDay, setStartDay] = useState(1);
  const [endDay, setEndDay] = useState(20);
  const [displayedRange, setDisplayedRange] = useState(initialRange);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDayClick = (day: number) => {
    if (day < startDay) {
      setStartDay(day);
    } else if (day === startDay) {
      // Toggle
      setStartDay(day);
    } else {
      setEndDay(day);
      setSelectedPreset("Custom Range");
    }
  };

  const handlePresetSelect = (preset: string) => {
    setSelectedPreset(preset);
    if (preset === "Today") {
      setStartDay(20);
      setEndDay(20);
    } else if (preset === "Yesterday") {
      setStartDay(19);
      setEndDay(19);
    } else if (preset === "Last 7 days") {
      setStartDay(14);
      setEndDay(20);
    } else if (preset === "Last 30 days" || preset === "This Month") {
      setStartDay(1);
      setEndDay(20);
    }
  };

  const handleApply = () => {
    const formatted = `Oct ${startDay < 10 ? `0${startDay}` : startDay} - Oct ${
      endDay < 10 ? `0${endDay}` : endDay
    }, 2026`;
    setDisplayedRange(formatted);
    setIsOpen(false);

    toast.success("Date Range Applied", {
      description: `Filtering analytics from ${formatted}.`,
    });

    if (onRangeApply) {
      onRangeApply(formatted);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dash bg-white body-sm-medium text-primary-500 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer"
      >
        <CalendarIcon className="w-4 h-4 text-primary-400 shrink-0" />
        <span className="whitespace-nowrap text-xs sm:text-sm">{displayedRange}</span>
        <ChevronDown className="w-3.5 h-3.5 text-primary-300 shrink-0" />
      </button>

      {/* Floating Date Range Picker Card */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-auto min-w-[340px] sm:min-w-[480px] bg-white rounded-2xl shadow-xl border border-dash overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex flex-col sm:flex-row">
            {/* Presets Sidebar */}
            <div className="w-full sm:w-36 p-3 border-b sm:border-b-0 sm:border-r border-dash bg-slate-50/50 space-y-1">
              <span className="px-2.5 py-1 block body-2xsm-regular font-bold text-primary-300 uppercase tracking-wider">
                Presets
              </span>
              {PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => handlePresetSelect(p)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg body-sm-medium transition-colors flex items-center justify-between cursor-pointer ${
                    selectedPreset === p
                      ? "bg-brand-orange-light text-brand-orange font-bold"
                      : "text-primary-400 hover:bg-slate-100 hover:text-primary-500"
                  }`}
                >
                  <span>{p}</span>
                  {selectedPreset === p && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>

            {/* Calendar Grid Container */}
            <div className="p-4 flex-1">
              {/* Calendar Month Header */}
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="body-sm-medium font-bold text-primary-500">
                  October 2026
                </span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    className="p-1 rounded-lg text-primary-300 hover:text-primary-500 hover:bg-slate-100 transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    className="p-1 rounded-lg text-primary-300 hover:text-primary-500 hover:bg-slate-100 transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Days Header */}
              <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {DAYS_OF_WEEK.map((d) => (
                  <span
                    key={d}
                    className="body-2xsm-regular font-semibold text-primary-300 py-1"
                  >
                    {d}
                  </span>
                ))}
              </div>

              {/* Days Cells (Oct 2026 starts on Thursday, so 4 empty cells) */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {[...Array(4)].map((_, i) => (
                  <span key={`empty-${i}`} className="h-8" />
                ))}

                {[...Array(31)].map((_, i) => {
                  const day = i + 1;
                  const isStart = day === startDay;
                  const isEnd = day === endDay;
                  const isInRange = day > startDay && day < endDay;

                  let cellClass =
                    "h-8 flex items-center justify-center body-xsm-medium rounded-lg cursor-pointer transition-colors";

                  if (isStart || isEnd) {
                    cellClass += " bg-brand-orange text-white font-bold shadow-xs";
                  } else if (isInRange) {
                    cellClass += " bg-brand-orange-light text-brand-orange font-medium";
                  } else {
                    cellClass +=
                      " text-primary-500 hover:bg-slate-100 hover:text-brand-orange";
                  }

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleDayClick(day)}
                      className={cellClass}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="px-4 py-3 bg-slate-50/80 border-t border-dash flex items-center justify-between gap-3">
            <span className="body-2xsm-regular text-primary-400 font-medium truncate">
              Selected: Oct {startDay < 10 ? `0${startDay}` : startDay} – Oct{" "}
              {endDay < 10 ? `0${endDay}` : endDay}, 2026
            </span>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-dash body-xsm-medium text-primary-400 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleApply}
                className="px-3.5 py-1.5 rounded-lg bg-brand-orange hover:bg-brand-orange-hover text-white body-xsm-medium font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Apply Range
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
