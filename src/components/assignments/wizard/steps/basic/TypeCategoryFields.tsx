"use client";

import React from "react";
import { Tag } from "lucide-react";
import { SelectController } from "./SelectController";
import { NO_CATEGORY, categoryOptions, typeOptions } from "./basicOptions";

/** Assignment Type * and Category (Optional) selects. */
export function TypeCategoryFields() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <SelectController name="type" label="Assignment Type" required options={typeOptions} placeholder="Select a type" />
      <SelectController
        name="category"
        label="Category"
        optional
        options={categoryOptions}
        placeholder="Select a category"
        icon={<Tag className="h-4 w-4" />}
        fromSelect={(v) => (v === NO_CATEGORY ? "" : v)}
      />
    </div>
  );
}

export default TypeCategoryFields;
