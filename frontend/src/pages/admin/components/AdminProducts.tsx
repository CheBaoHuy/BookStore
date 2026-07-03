import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { Product } from "../../../models";
import { AdminPagination } from "./AdminPagination";

interface AdminProductsProps {
    products: Product[];
    onEditProduct: (prod: Product) => void;
    onDeleteProduct: (id: number) => void;
    onOpenAddProduct: () => void;
    formatCurrency: (val: number | undefined | null) => string;
}

export const AdminProducts: React.FC<AdminProductsProps> = ({
    products,
    onEditProduct,
    onDeleteProduct,
    onOpenAddProduct,
    formatCurrency
}) => {
    const [pCurrentPage, setPCurrentPage] = useState<number>(1);
    const PRODUCTS_PER_PAGE = 8;

    const totalProductPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);
    const validPCurrentPage = Math.min(pCurrentPage, Math.max(1, totalProductPages));
    const paginatedProducts = products.slice((validPCurrentPage - 1) * PRODUCTS_PER_PAGE, validPCurrentPage * PRODUCTS_PER_PAGE);

    return (
        <div className="admin-tab-content">
            <div className="tab-header-row">
                <h2 className="tab-title">Quản lý Sản phẩm</h2>
                <button className="btn-add-new" onClick={onOpenAddProduct}>
                    <FaPlus /> Thêm sản phẩm
                </button>
            </div>

            <div className="table-card">
                <div className="table-responsive">
                    <table className="table admin-table align-middle">
                        <thead>
                            <tr>
                                <th>Bìa sách</th>
                                <th>Tên sách</th>
                                <th>Tác giả / NXB</th>
                                <th>Số lượng</th>
                                <th>Giá bán</th>
                                <th className="text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProducts.map(p => (
                                <tr key={p.id}>
                                    <td style={{ width: "80px" }}>
                                        <img
                                            src={p.image || ""}
                                            alt={p.title}
                                            className="admin-product-thumb"
                                        />
                                    </td>
                                    <td style={{ maxWidth: "250px" }}>
                                        <div className="fw-bold text-truncate" title={p.title}>{p.title}</div>
                                        <span className="badge bg-secondary" style={{ fontSize: "11px" }}>
                                            {p.category ? p.category.name : "Không phân loại"}
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ fontSize: "14px", color: "#475569" }}>{p.author}</div>
                                        <div style={{ fontSize: "12px", color: "#94a3b8" }}>{p.publisher} ({p.publishYear})</div>
                                    </td>
                                    <td className="fw-semibold">{p.quantity} cuốn</td>
                                    <td>
                                        <div className="text-danger fw-bold">{formatCurrency(p.currentPrice)}</div>
                                        {p.oldPrice && (
                                            <div className="text-decoration-line-through text-muted" style={{ fontSize: "12px" }}>
                                                {formatCurrency(p.oldPrice)}
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        <div className="action-buttons-cell">
                                            <button className="btn-action-edit" title="Sửa" onClick={() => onEditProduct(p)}>
                                                <FaEdit />
                                            </button>
                                            <button className="btn-action-delete" title="Xóa" onClick={() => onDeleteProduct(p.id)}>
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
                currentPage={validPCurrentPage}
                totalPages={totalProductPages}
                onPageChange={setPCurrentPage}
            />
        </div>
    );
};
