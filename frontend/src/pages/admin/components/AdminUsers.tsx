import React, { useState } from "react";
import { FaUsers, FaUserShield, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { User } from "../../../models";
import { AdminPagination } from "./AdminPagination";

interface AdminUsersProps {
    users: User[];
    adminUserId: number;
    onToggleUserStatus: (userId: number, currentStatus: boolean) => Promise<void>;
    onToggleUserRole: (userId: number, currentRole: string) => Promise<void>;
    onDeleteUser: (userId: number) => Promise<void>;
}

export const AdminUsers: React.FC<AdminUsersProps> = ({
    users,
    adminUserId,
    onToggleUserStatus,
    onToggleUserRole,
    onDeleteUser
}) => {
    const [uCurrentPage, setUCurrentPage] = useState<number>(1);
    const USERS_PER_PAGE = 8;

    const totalUserPages = Math.ceil(users.length / USERS_PER_PAGE);
    const validUCurrentPage = Math.min(uCurrentPage, Math.max(1, totalUserPages));
    const paginatedUsers = users.slice((validUCurrentPage - 1) * USERS_PER_PAGE, validUCurrentPage * USERS_PER_PAGE);

    return (
        <div className="admin-tab-content">
            <h2 className="tab-title">Quản lý Người dùng</h2>

            <div className="table-card">
                <div className="table-responsive">
                    <table className="table admin-table align-middle">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tài khoản</th>
                                <th>Thông tin liên hệ</th>
                                <th>Quyền hạn</th>
                                <th>Trạng thái</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map(u => (
                                <tr key={u.id}>
                                    <td className="fw-bold">#{u.id}</td>
                                    <td>
                                        <div className="d-flex align-items-center gap-2">
                                            {u.avatar ? (
                                                <img src={u.avatar} alt="Avatar" className="user-table-avatar" />
                                            ) : (
                                                <div className="user-table-avatar-fallback"><FaUsers /></div>
                                            )}
                                            <div className="fw-bold">{u.username}</div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="fw-semibold" style={{ fontSize: "14px" }}>{u.fullName}</div>
                                        <div style={{ fontSize: "12px", color: "#64748b" }}>{u.email} | {u.phone}</div>
                                    </td>
                                    <td>
                                        <span className={`badge ${u.role === "ADMIN" ? "bg-primary" : "bg-info"}`} style={{ fontSize: "12px" }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td>
                                        {u.status ? (
                                            <span className="badge bg-success-subtle text-success border border-success-subtle px-2 py-1">Đang hoạt động</span>
                                        ) : (
                                            <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-2 py-1">Đã bị khóa</span>
                                        )}
                                    </td>
                                    <td>
                                        <div className="action-buttons-cell">
                                            <button
                                                className={`btn-action-status ${u.status ? "lock" : "unlock"}`}
                                                title={u.status ? "Khóa tài khoản" : "Mở khóa tài khoản"}
                                                onClick={() => onToggleUserStatus(u.id, u.status)}
                                            >
                                                {u.status ? <FaTimes /> : <FaCheck />}
                                            </button>
                                            <button
                                                className="btn-action-role"
                                                title="Thay đổi quyền"
                                                onClick={() => onToggleUserRole(u.id, u.role)}
                                            >
                                                <FaUserShield />
                                            </button>
                                            <button
                                                className="btn-action-delete"
                                                title="Xóa tài khoản"
                                                onClick={() => onDeleteUser(u.id)}
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <AdminPagination
                currentPage={validUCurrentPage}
                totalPages={totalUserPages}
                onPageChange={setUCurrentPage}
            />
        </div>
    );
};
