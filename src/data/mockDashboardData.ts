import { DashboardData } from "@/types/dashboard";

export const MOCK_DASHBOARD_DATA: DashboardData = {
  stats: [
    {
      id: "total-students",
      label: "Total Students",
      value: "2,580",
      change: "12%",
      isPositive: true,
      comparedTo: "vs last month",
      iconName: "users",
      colorScheme: "orange",
      sparklineData: [20, 35, 25, 45, 30, 55, 65],
    },
    {
      id: "active-instructors",
      label: "Active Instructors",
      value: "124",
      change: "8%",
      isPositive: true,
      comparedTo: "vs last month",
      iconName: "user",
      colorScheme: "blue",
      sparklineData: [15, 20, 30, 25, 40, 35, 50],
    },
    {
      id: "published-courses",
      label: "Published Courses",
      value: "86",
      change: "20%",
      isPositive: true,
      comparedTo: "vs last month",
      iconName: "book-open",
      colorScheme: "green",
      sparklineData: [10, 22, 18, 32, 28, 48, 55],
    },
    {
      id: "total-revenue",
      label: "Total Revenue",
      value: "$24,580",
      change: "18%",
      isPositive: true,
      comparedTo: "vs last month",
      iconName: "database",
      colorScheme: "purple",
      sparklineData: [25, 30, 28, 42, 38, 52, 60],
    },
  ],

  revenueData: [
    { date: "Sep 20", revenue: 1400, formattedRevenue: "$1,400" },
    { date: "Sep 25", revenue: 2600, formattedRevenue: "$2,600" },
    { date: "Sep 30", revenue: 2100, formattedRevenue: "$2,100" },
    { date: "Oct 05", revenue: 3800, formattedRevenue: "$3,800" },
    { date: "Oct 10", revenue: 5420, formattedRevenue: "$5,420" },
    { date: "Oct 15", revenue: 4700, formattedRevenue: "$4,700" },
    { date: "Oct 20", revenue: 7600, formattedRevenue: "$7,600" },
  ],

  studentGrowthData: [
    { date: "Sep 20", newStudents: 220, activeStudents: 580 },
    { date: "Sep 25", newStudents: 380, activeStudents: 750 },
    { date: "Sep 30", newStudents: 310, activeStudents: 690 },
    { date: "Oct 05", newStudents: 440, activeStudents: 860 },
    { date: "Oct 10", newStudents: 540, activeStudents: 980 },
    { date: "Oct 15", newStudents: 620, activeStudents: 1090 },
    { date: "Oct 20", newStudents: 730, activeStudents: 1220 },
  ],

  courseEnrollments: [
    {
      courseName: "Complete Web Development",
      shortName: "Complete\nWeb Development",
      enrollments: 175,
    },
    {
      courseName: "UI/UX Design Mastery",
      shortName: "UI/UX\nDesign Mastery",
      enrollments: 142,
    },
    {
      courseName: "Digital Marketing",
      shortName: "Digital\nMarketing",
      enrollments: 98,
    },
    {
      courseName: "Graphic Design Basics",
      shortName: "Graphic\nDesign Basics",
      enrollments: 82,
    },
    {
      courseName: "AI for Beginners",
      shortName: "AI for\nBeginners",
      enrollments: 68,
    },
  ],

  courseCompletion: {
    completionRate: 68,
    categories: [
      {
        label: "Completed",
        count: 1200,
        percentage: 68,
        color: "#10B981", // vibrant emerald green
      },
      {
        label: "In Progress",
        count: 420,
        percentage: 24,
        color: "#FF5B00", // brand orange
      },
      {
        label: "Not Started",
        count: 140,
        percentage: 8,
        color: "#94A3B8", // slate-400
      },
    ],
  },

  recentOrders: [
    {
      id: "ord-1",
      orderNumber: "#ORD-1001",
      student: {
        name: "Fahim Rahman",
        avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80",
      },
      course: "Web Development",
      amount: 49.0,
      status: "Completed",
      date: "Oct 20, 2026",
    },
    {
      id: "ord-2",
      orderNumber: "#ORD-1000",
      student: {
        name: "Nusrat Jahan",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80",
      },
      course: "UI/UX Design",
      amount: 39.0,
      status: "Completed",
      date: "Oct 19, 2026",
    },
    {
      id: "ord-3",
      orderNumber: "#ORD-0999",
      student: {
        name: "Tanvir Ahmed",
        avatarUrl: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80",
      },
      course: "Digital Marketing",
      amount: 59.0,
      status: "Pending",
      date: "Oct 19, 2026",
    },
    {
      id: "ord-4",
      orderNumber: "#ORD-0998",
      student: {
        name: "Sadia Islam",
        avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
      },
      course: "Graphic Design",
      amount: 29.0,
      status: "Failed",
      date: "Oct 18, 2026",
    },
  ],

  recentEnrollments: [
    {
      id: "enr-1",
      student: {
        name: "Aminul Islam",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
      },
      course: "Web Development",
      progress: 25,
      enrolledAt: "Oct 20, 2026",
    },
    {
      id: "enr-2",
      student: {
        name: "Tania Akter",
        avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
      },
      course: "UI/UX Design",
      progress: 60,
      enrolledAt: "Oct 20, 2026",
    },
    {
      id: "enr-3",
      student: {
        name: "Rafiq Ahmed",
        avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80",
      },
      course: "Digital Marketing",
      progress: 10,
      enrolledAt: "Oct 19, 2026",
    },
    {
      id: "enr-4",
      student: {
        name: "Mim Chowdhury",
        avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80",
      },
      course: "Graphic Design",
      progress: 80,
      enrolledAt: "Oct 19, 2026",
    },
  ],
};
