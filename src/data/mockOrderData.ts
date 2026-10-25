import { MOCK_STUDENTS } from "@/data/mockStudentData";
import {
  OrderCourse,
  OrderItem,
  OrderStatus,
  OrderTimelineStep,
  PaymentMethod,
} from "@/types/order";

const thumb = (id: string) => `https://images.unsplash.com/photo-${id}?w=160&auto=format&fit=crop&q=80`;

export const ORDER_COURSES: OrderCourse[] = [
  { id: "c-101", title: "Complete Web Development Bootcamp", thumbnailUrl: thumb("1587620962725-abab7fe55159"), instructor: "Fahim Rahman", price: 39 },
  { id: "c-201", title: "UI/UX Design Fundamentals", thumbnailUrl: thumb("1542744094-3a31f272c490"), instructor: "Sadia Islam", price: 29 },
  { id: "c-301", title: "Digital Marketing Masterclass", thumbnailUrl: thumb("1460925895917-afdab827c52f"), instructor: "Nafis Ahmed", price: 49 },
  { id: "c-401", title: "Photography Basics", thumbnailUrl: thumb("1516035069371-29a1b244cc32"), instructor: "Ayesha Khan", price: 19 },
  { id: "c-103", title: "JavaScript for Beginners", thumbnailUrl: thumb("1579468118864-ddb57b98d286"), instructor: "Fahim Rahman", price: 39 },
  { id: "c-102", title: "CSS Styling and Layout", thumbnailUrl: thumb("1507238691740-187a5b1d37b8"), instructor: "Tanvir Hossain", price: 29 },
  { id: "c-501", title: "Mobile App Development", thumbnailUrl: thumb("1512941937669-90a1b58e7e9c"), instructor: "Rafiul Karim", price: 49 },
  { id: "c-601", title: "Content Writing Mastery", thumbnailUrl: thumb("1455390582262-044cdead277a"), instructor: "Meherun Nesa", price: 19 },
  { id: "c-701", title: "Graphic Design Pro", thumbnailUrl: thumb("1513956589380-bad6acb9b9d4"), instructor: "Imran Hossain", price: 39 },
  { id: "c-801", title: "English for Professionals", thumbnailUrl: thumb("1523240795612-9a054b0db644"), instructor: "Tahia Akter", price: 29 },
];

export const PAYMENT_METHODS: PaymentMethod[] = ["Stripe", "PayPal", "SSLCommerz", "bKash", "Nagad"];

const TOTAL_ORDERS = 248;
const STATUS_COUNTS: Record<OrderStatus, number> = { Paid: 222, Pending: 12, Failed: 6, Cancelled: 4, Refunded: 4 };

// The first rows match the reference design exactly
const DESIGN_ROWS: { status: OrderStatus; method: PaymentMethod }[] = [
  { status: "Paid", method: "Stripe" },
  { status: "Paid", method: "PayPal" },
  { status: "Pending", method: "SSLCommerz" },
  { status: "Paid", method: "bKash" },
  { status: "Paid", method: "Nagad" },
  { status: "Failed", method: "Stripe" },
  { status: "Paid", method: "PayPal" },
  { status: "Refunded", method: "SSLCommerz" },
  { status: "Paid", method: "bKash" },
  { status: "Paid", method: "Nagad" },
];

const seeded = (seed: number) => {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
};

/** Exact status mix (222/12/6/4/4) with the design rows pinned to the top. */
const buildStatuses = (): OrderStatus[] => {
  const remaining = { ...STATUS_COUNTS };
  DESIGN_ROWS.forEach((r) => remaining[r.status]--);
  const pool = (Object.keys(remaining) as OrderStatus[]).flatMap((s) => Array(remaining[s]).fill(s));
  const rand = seeded(42);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return [...DESIGN_ROWS.map((r) => r.status), ...pool];
};

const addMinutes = (iso: string, minutes: number) => new Date(new Date(iso).getTime() + minutes * 60000).toISOString();

/** Seed timeline for each status (gateway-driven, no manual admin steps). */
export const buildTimeline = (status: OrderStatus, placedAt: string): OrderTimelineStep[] => {
  const placed: OrderTimelineStep = { label: "Order Placed", at: placedAt };
  switch (status) {
    case "Pending":
      return [placed, { label: "Payment Completed" }, { label: "Enrollment Created" }, { label: "Course Access Granted" }];
    case "Failed":
      return [placed, { label: "Payment Failed", at: addMinutes(placedAt, 2), note: "Declined by the payment gateway" }];
    case "Cancelled":
      return [placed, { label: "Order Cancelled", at: addMinutes(placedAt, 5), note: "Payment cancelled by student" }];
    case "Refunded":
      return [
        placed,
        { label: "Payment Completed", at: placedAt },
        { label: "Enrollment Created", at: placedAt },
        { label: "Course Access Granted", at: addMinutes(placedAt, 1) },
        { label: "Refund Issued", at: addMinutes(placedAt, 60 * 24 * 2), by: "Admin" },
        { label: "Course Access Revoked", at: addMinutes(placedAt, 60 * 24 * 2) },
      ];
    default:
      return [
        placed,
        { label: "Payment Completed", at: placedAt },
        { label: "Enrollment Created", at: placedAt },
        { label: "Course Access Granted", at: addMinutes(placedAt, 1) },
      ];
  }
};

export const buildMockOrders = (): OrderItem[] => {
  const statuses = buildStatuses();
  const rand = seeded(7);
  // Oct 18, 2026 10:24 AM, the newest order in the design
  let cursor = new Date(2026, 9, 18, 10, 24).getTime();

  return Array.from({ length: TOTAL_ORDERS }, (_, i) => {
    const student = MOCK_STUDENTS[i % MOCK_STUDENTS.length];
    const course = ORDER_COURSES[i % ORDER_COURSES.length];
    const method = DESIGN_ROWS[i]?.method ?? PAYMENT_METHODS[Math.floor(rand() * PAYMENT_METHODS.length)];
    const status = statuses[i];
    const createdAt = new Date(cursor).toISOString();
    cursor -= Math.round((20 + rand() * 40) * 60 * 60 * 1000);
    const number = String(1248 - i).padStart(6, "0");

    const isPaidAtSomePoint = status === "Paid" || status === "Refunded";
    const refundedAt = status === "Refunded" ? addMinutes(createdAt, 60 * 24 * 2) : undefined;

    return {
      id: `ord-${1248 - i}`,
      orderNumber: `#EDU-${number}`,
      student: { id: student.id, name: student.name, email: student.email, avatarUrl: student.avatarUrl },
      course,
      amount: course.price,
      paymentMethod: method,
      transactionId: isPaidAtSomePoint
        ? `${method === "Stripe" ? "pi" : method.slice(0, 3).toLowerCase()}_${(1248 - i).toString(36)}${Math.floor(rand() * 1e8).toString(36)}`
        : "",
      status,
      createdAt,
      paidAt: isPaidAtSomePoint ? createdAt : undefined,
      timeline: buildTimeline(status, createdAt),
      cancelReason: status === "Cancelled" ? "Payment cancelled by student" : undefined,
      refundReason: status === "Refunded" ? "Requested by student within the 7-day refund window" : undefined,
      refundedAt,
    };
  });
};
