import { MOCK_STUDENTS } from "@/data/mockStudentData";
import {
  CommerceNote,
  OrderCourse,
  OrderItem,
  OrderStatus,
  OrderStudent,
  OrderTimelineStep,
  PaymentMethod,
} from "@/types/order";

const thumb = (id: string) => `https://images.unsplash.com/photo-${id}?w=160&auto=format&fit=crop&q=80`;

export const ORDER_COURSES: OrderCourse[] = [
  { id: "c-103", title: "JavaScript Essentials", subtitle: "From Zero to Hero", thumbnailUrl: thumb("1579468118864-ddb57b98d286"), instructor: "Fahim Rahman", price: 29 },
  { id: "c-201", title: "UI/UX Design Basics", subtitle: "Design thinking & Figma", thumbnailUrl: thumb("1542744094-3a31f272c490"), instructor: "Sadia Islam", price: 39 },
  { id: "c-104", title: "React for Beginners", subtitle: "Build modern web apps", thumbnailUrl: thumb("1517694712202-14dd9538aa97"), instructor: "Fahim Rahman", price: 49 },
  { id: "c-101", title: "Full Stack Web Development", subtitle: "MERN from scratch", thumbnailUrl: thumb("1587620962725-abab7fe55159"), instructor: "Fahim Rahman", price: 59 },
  { id: "c-301", title: "Digital Marketing Mastery", subtitle: "SEO, ads & analytics", thumbnailUrl: thumb("1460925895917-afdab827c52f"), instructor: "Nafis Ahmed", price: 39 },
  { id: "c-501", title: "Python for Data Science", subtitle: "Pandas, NumPy & plots", thumbnailUrl: thumb("1526374965328-7f61d4dc18c5"), instructor: "Rafiul Karim", price: 59 },
  { id: "c-102", title: "HTML & CSS Basics", subtitle: "Build your first website", thumbnailUrl: thumb("1507238691740-187a5b1d37b8"), instructor: "Tanvir Hossain", price: 29 },
  { id: "c-601", title: "WordPress for Beginners", subtitle: "Launch a site in a day", thumbnailUrl: thumb("1455390582262-044cdead277a"), instructor: "Meherun Nesa", price: 29 },
  { id: "c-602", title: "Shopify Store Setup", subtitle: "Start selling online", thumbnailUrl: thumb("1512941937669-90a1b58e7e9c"), instructor: "Imran Hossain", price: 49 },
  { id: "c-701", title: "Graphic Design Masterclass", subtitle: "Illustrator & Photoshop", thumbnailUrl: thumb("1513956589380-bad6acb9b9d4"), instructor: "Tahia Akter", price: 49 },
];

/** "Full Stack Web Development" is sold as a 2-course bundle (with React). */
const BUNDLES: Record<string, string[]> = { "c-101": ["c-101", "c-104"] };
const BUNDLE_PRICE: Record<string, number> = { "c-101": 99 };

export const PAYMENT_METHODS: PaymentMethod[] = ["Stripe", "PayPal", "SSLCommerz", "bKash", "Nagad"];

const TOTAL_ORDERS = 248;
const STATUS_COUNTS: Record<OrderStatus, number> = { Paid: 222, Pending: 12, Failed: 6, Cancelled: 4, Refunded: 4 };

// The first rows match the reference design
const DESIGN_ROWS: { status: OrderStatus; method: PaymentMethod }[] = [
  { status: "Paid", method: "Stripe" },
  { status: "Paid", method: "PayPal" },
  { status: "Pending", method: "Stripe" },
  { status: "Paid", method: "bKash" },
  { status: "Failed", method: "Stripe" },
  { status: "Paid", method: "PayPal" },
  { status: "Paid", method: "bKash" },
  { status: "Pending", method: "Stripe" },
  { status: "Paid", method: "PayPal" },
  { status: "Cancelled", method: "Stripe" },
];

const REFERRALS = ["Google Ads", "Facebook", "Organic Search", "Referral", "Direct"];
const DEVICES = ["Web (Chrome, Windows)", "Web (Safari, macOS)", "Mobile (Chrome, Android)", "Mobile (Safari, iOS)"];
const COUPONS: Record<string, number> = { WELCOME10: 0.1, EDU20: 0.2 };

export const CURRENT_ADMIN = {
  name: "Admin",
  avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80",
};

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

export const addMinutes = (iso: string, minutes: number) =>
  new Date(new Date(iso).getTime() + minutes * 60000).toISOString();

/** Seed timeline for each status (gateway-driven, no manual admin steps). */
export const buildTimeline = (status: OrderStatus, placedAt: string): OrderTimelineStep[] => {
  const placed: OrderTimelineStep = { label: "Order Placed", at: placedAt };
  const paidSteps: OrderTimelineStep[] = [
    { label: "Payment Completed", at: addMinutes(placedAt, 1) },
    { label: "Enrollment Created", at: addMinutes(placedAt, 2) },
    { label: "Course Access Granted", at: addMinutes(placedAt, 2) },
  ];
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
        ...paidSteps,
        { label: "Refund Issued", at: addMinutes(placedAt, 60 * 24 * 2), by: "Admin" },
        { label: "Course Access Revoked", at: addMinutes(placedAt, 60 * 24 * 2) },
      ];
    default:
      return [placed, ...paidSteps];
  }
};

export const maskedAccount = (method: PaymentMethod, seed: number) => {
  const last4 = String(1000 + ((seed * 37) % 9000));
  switch (method) {
    case "Stripe":
      return `Visa **** ${last4}`;
    case "SSLCommerz":
      return `Mastercard **** ${last4}`;
    case "PayPal":
      return `PayPal ****${last4.slice(-2)}@gmail.com`;
    default:
      return `${method} 017** ***${last4.slice(-3)}`;
  }
};

export const toOrderStudent = (index: number): OrderStudent => {
  const s = MOCK_STUDENTS[index % MOCK_STUDENTS.length];
  return {
    id: s.id,
    code: `#STD-${String(245 - (index % MOCK_STUDENTS.length)).padStart(6, "0")}`,
    name: s.name,
    email: s.email,
    phone: s.phone,
    avatarUrl: s.avatarUrl,
    joinedAt: s.joinDate,
    totalCourses: s.enrolledCoursesCount,
  };
};

export const orderReference = (createdAt: string, number: number) => {
  const d = new Date(createdAt);
  return `EDU${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}${number}`;
};

export const buildMockOrders = (): OrderItem[] => {
  const statuses = buildStatuses();
  const rand = seeded(7);
  // Oct 20, 2026 10:30 AM, the newest order in the design
  let cursor = new Date(2026, 9, 20, 10, 30).getTime();

  return Array.from({ length: TOTAL_ORDERS }, (_, i) => {
    const number = 1248 - i;
    const primary = ORDER_COURSES[i % ORDER_COURSES.length];
    const bundleIds = BUNDLES[primary.id];
    const courses = bundleIds ? bundleIds.map((id) => ORDER_COURSES.find((c) => c.id === id)!) : [primary];
    const method = DESIGN_ROWS[i]?.method ?? PAYMENT_METHODS[Math.floor(rand() * PAYMENT_METHODS.length)];
    const status = statuses[i];
    const createdAt = new Date(cursor).toISOString();
    cursor -= Math.round((8 + rand() * 30) * 60 * 60 * 1000);

    const subtotal = BUNDLE_PRICE[primary.id] ?? courses.reduce((sum, c) => sum + c.price, 0);
    const couponCode = i >= 10 && i % 9 === 0 ? (i % 2 ? "WELCOME10" : "EDU20") : undefined;
    const discount = couponCode ? Math.round(subtotal * COUPONS[couponCode]) : 0;
    const isPaidAtSomePoint = status === "Paid" || status === "Refunded";

    const firstNote = (prefix: string, content: string): CommerceNote[] =>
      i === 0 ? [{ id: `${prefix}-${number}-1`, author: CURRENT_ADMIN, content, createdAt: addMinutes(createdAt, 30) }] : [];

    return {
      id: `ord-${number}`,
      orderNumber: `#ORD-${String(number).padStart(6, "0")}`,
      reference: orderReference(createdAt, number),
      student: toOrderStudent(i),
      courses,
      isBundle: courses.length > 1,
      subtotal,
      discount,
      tax: 0,
      amount: subtotal - discount,
      currency: "USD",
      couponCode,
      paymentMethod: method,
      paymentAccount: maskedAccount(method, number),
      transactionId: isPaidAtSomePoint
        ? `${method === "Stripe" ? "pi" : method.slice(0, 3).toLowerCase()}_${number.toString(36)}${Math.floor(rand() * 1e8).toString(36)}`
        : "",
      status,
      createdAt,
      paidAt: isPaidAtSomePoint ? addMinutes(createdAt, 1) : undefined,
      receiptSentAt: isPaidAtSomePoint ? addMinutes(createdAt, 2) : undefined,
      timeline: buildTimeline(status, createdAt),
      cancelReason: status === "Cancelled" ? "Payment cancelled by student" : undefined,
      refundReason: status === "Refunded" ? "Requested by student within the 7-day refund window" : undefined,
      refundedAt: status === "Refunded" ? addMinutes(createdAt, 60 * 24 * 2) : undefined,
      ipAddress: `103.${24 + (number % 30)}.${(number * 7) % 255}.${(number * 13) % 255}`,
      device: DEVICES[number % DEVICES.length],
      referralSource: REFERRALS[number % REFERRALS.length],
      adminNotes: firstNote("n", "Student requested a certificate after course completion."),
      paymentNotes: firstNote("pn", "Payment verified. Student access granted."),
    };
  });
};
