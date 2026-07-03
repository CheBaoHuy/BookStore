import React from "react";

interface AdminPaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const AdminPagination: React.FC<AdminPaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    const pageNumbers: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
        pageNumbers.push(1);
        let start = Math.max(2, currentPage - 1);
        let end = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage <= 2) {
            end = 4;
        } else if (currentPage >= totalPages - 1) {
            start = totalPages - 3;
        }

        if (start > 2) {
            pageNumbers.push("...");
        }

        for (let i = start; i <= end; i++) {
            pageNumbers.push(i);
        }

        if (end < totalPages - 1) {
            pageNumbers.push("...");
        }

        pageNumbers.push(totalPages);
    }

    return (
        <div className="admin-pagination d-flex justify-content-center align-items-center gap-2 mt-4">
            <button
                className="pagination-btn prev-btn"
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                title="Trang trước"
            >
                &lsaquo; Trước
            </button>
            {pageNumbers.map((p, idx) => {
                if (p === "...") {
                    return <span key={`dots-${idx}`} className="pagination-dots px-2">...</span>;
                }
                return (
                    <button
                        key={`page-${p}`}
                        className={`pagination-btn page-num ${currentPage === p ? 'active' : ''}`}
                        onClick={() => onPageChange(p as number)}
                    >
                        {p}
                    </button>
                );
            })}
            <button
                className="pagination-btn next-btn"
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                title="Trang sau"
            >
                Sau &rsaquo;
            </button>
        </div>
    );
};
