import React from "react";
import { Clock, CreditCard, Gift, Globe, Infinity as InfinityIcon, Layers, Mail, RefreshCw, UserCheck } from "lucide-react";
import type { ChoiceOption } from "@/components/ui/ChoiceCardGroup";
import {
  ACCESS_DURATION_LABEL,
  ENROLLMENT_LABEL,
  PRICE_TYPE_LABEL,
  type CoursePublishInput,
} from "@/validations/coursePublishSchema";

const iconClass = "w-5 h-5";

export const PRICE_TYPE_OPTIONS: ChoiceOption<CoursePublishInput["priceType"]>[] = [
  { value: "FREE", title: PRICE_TYPE_LABEL.FREE, description: "Available to everyone at no cost", icon: <Gift className={iconClass} /> },
  { value: "ONE_TIME", title: PRICE_TYPE_LABEL.ONE_TIME, description: "Charge a single payment", icon: <CreditCard className={iconClass} /> },
  { value: "SUBSCRIPTION", title: PRICE_TYPE_LABEL.SUBSCRIPTION, description: "Include in a subscription plan", icon: <RefreshCw className={iconClass} /> },
  { value: "BUNDLE", title: PRICE_TYPE_LABEL.BUNDLE, description: "Offer as part of a bundle with other courses", icon: <Layers className={iconClass} /> },
];

export const ENROLLMENT_OPTIONS: ChoiceOption<CoursePublishInput["enrollment"]>[] = [
  { value: "OPEN", title: ENROLLMENT_LABEL.OPEN, description: "Anyone can enroll at any time", icon: <Globe className={iconClass} /> },
  { value: "APPROVAL", title: ENROLLMENT_LABEL.APPROVAL, description: "Students need admin approval to enroll", icon: <UserCheck className={iconClass} /> },
  { value: "INVITE", title: ENROLLMENT_LABEL.INVITE, description: "Only invited students can enroll", icon: <Mail className={iconClass} /> },
];

export const ACCESS_DURATION_OPTIONS: ChoiceOption<CoursePublishInput["accessDuration"]>[] = [
  { value: "LIFETIME", title: ACCESS_DURATION_LABEL.LIFETIME, description: "Students will have permanent access", icon: <InfinityIcon className={iconClass} /> },
  { value: "LIMITED", title: ACCESS_DURATION_LABEL.LIMITED, description: "Access for a specific duration", icon: <Clock className={iconClass} /> },
  { value: "SUBSCRIPTION", title: ACCESS_DURATION_LABEL.SUBSCRIPTION, description: "Access while subscription is active", icon: <RefreshCw className={iconClass} /> },
];
