"use client";

import React, { useState, useMemo } from "react";
import { Search, Edit3, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Datatable, Column } from "@/components/ui/Datatable";
import { ToneBadge } from "@/components/ui/ToneBadge";
import { Avatar } from "@/components/ui/Avatar";
import { PillTabs } from "@/components/ui/PillTabs";
import { EditUserModal } from "./EditUserModal";
import { AdminUserItem } from "@/lib/types";
import { toast } from "sonner";

const INITIAL_USERS: AdminUserItem[] = [
  { id: "u-1", name: "Sabbir Hossain", email: "sabbir@gmail.com", role: "STUDENT", status: "ACTIVE", phone: "01711223344", createdAt: "2026-10-14" },
  { id: "u-2", name: "Dr. Farhana Yasmin", email: "farhana@university.edu", role: "TEACHER", status: "ACTIVE", phone: "01811556677", createdAt: "2026-10-12" },
  { id: "u-3", name: "Imam Hossain", email: "imam@lms-ai.com", role: "ADMIN", status: "ACTIVE", phone: "01911889900", createdAt: "2026-10-01" },
  { id: "u-4", name: "Kamrul Hasan", email: "kamrul@hotmail.com", role: "STUDENT", status: "BLOCKED", phone: "01611002233", createdAt: "2026-10-08" },
  { id: "u-5", name: "Mst. Sharmin Akter", email: "sharmin@gmail.com", role: "STUDENT", status: "PENDING", phone: "01511443322", createdAt: "2026-10-18" },
  { id: "u-6", name: "Engr. Mahmudul Huq", email: "mahmud@dev.org", role: "TEACHER", status: "ACTIVE", phone: "01755667788", createdAt: "2026-10-05" },
];

export function UsersTableClient() {
  const [users, setUsers] = useState<AdminUserItem[]>(INITIAL_USERS);
  const [selectedRole, setSelectedRole] = useState("ALL");
  const [search, setSearch] = useState("");
  const [editingUser, setEditingUser] = useState<AdminUserItem | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchRole = selectedRole === "ALL" || u.role === selectedRole;
      const matchSearch =
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.phone && u.phone.includes(search));
      return matchRole && matchSearch;
    });
  }, [users, selectedRole, search]);

  const handleToggleStatus = (u: AdminUserItem) => {
    const nextStatus = u.status === "ACTIVE" ? "BLOCKED" : "ACTIVE";
    setUsers((prev) => prev.map((item) => (item.id === u.id ? { ...item, status: nextStatus } : item)));
    toast.info(`User status toggled to ${nextStatus}`);
  };

  const columns: Column<AdminUserItem>[] = [
    {
      header: "User Details",
      cell: (u) => (
        <div className="flex items-center gap-3">
          <Avatar name={u.name} size="md" />
          <div className="flex flex-col">
            <span className="body-sm-medium text-primary-500 font-semibold">{u.name}</span>
            <span className="body-xsm-regular subtext-500">{u.email}</span>
          </div>
        </div>
      ),
    },
    {
      header: "Role",
      cell: (u) => (
        <ToneBadge tone={u.role === "ADMIN" ? "navy" : u.role === "TEACHER" ? "primary" : "ice"}>
          {u.role}
        </ToneBadge>
      ),
    },
    {
      header: "Status",
      cell: (u) => (
        <ToneBadge tone={u.status === "ACTIVE" ? "success" : u.status === "BLOCKED" ? "danger" : "warning"}>
          {u.status}
        </ToneBadge>
      ),
    },
    {
      header: "Phone",
      accessorKey: "phone",
      cell: (u) => <span className="body-sm-regular text-primary-500">{u.phone || "—"}</span>,
    },
    {
      header: "Joined",
      accessorKey: "createdAt",
      cell: (u) => <span className="body-xsm-regular subtext-500">{u.createdAt}</span>,
    },
    {
      header: "Actions",
      cell: (u) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingUser(u)}
            className="p-1.5 rounded-[6px] hover:bg-[#F3F4F6] text-[#1C4D8D] transition-colors cursor-pointer"
            title="Edit User"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleToggleStatus(u)}
            className="p-1.5 rounded-[6px] hover:bg-[#F3F4F6] transition-colors cursor-pointer"
            title={u.status === "ACTIVE" ? "Block User" : "Activate User"}
          >
            {u.status === "ACTIVE" ? (
              <ShieldAlert className="w-4 h-4 text-rose-500" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-[12px] border border-[#EDEDED] bg-white p-5 space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PillTabs
          activeTab={selectedRole}
          onChange={setSelectedRole}
          tabs={[
            { id: "ALL", label: "All Users", count: users.length },
            { id: "STUDENT", label: "Students", count: users.filter((u) => u.role === "STUDENT").length },
            { id: "TEACHER", label: "Instructors", count: users.filter((u) => u.role === "TEACHER").length },
            { id: "ADMIN", label: "Admins", count: users.filter((u) => u.role === "ADMIN").length },
          ]}
        />

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-primary-300 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-[40px] pl-10 pr-3.5 rounded-[8px] border border-[#EDEDED] body-sm-regular text-primary-500 bg-white placeholder:text-[#969696] focus:outline-none focus:border-[#1C4D8D]"
          />
        </div>
      </div>

      <Datatable columns={columns} data={filteredUsers} />

      <EditUserModal
        isOpen={!!editingUser}
        user={editingUser}
        onClose={() => setEditingUser(null)}
        onSave={(updated) => {
          setUsers((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        }}
      />
    </div>
  );
}
