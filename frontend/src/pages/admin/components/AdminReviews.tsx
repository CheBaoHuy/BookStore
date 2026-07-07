import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { FaPaperPlane, FaRegCommentDots, FaStar } from "react-icons/fa";
import { Review } from "../../../models";

interface AdminReviewsProps {
    onNotify: (success: string, error?: string) => void;
    onReviewChanged?: () => void;
}

export function AdminReviews({ onNotify, onReviewChanged }: AdminReviewsProps) {
    const token = sessionStorage.getItem("token") || localStorage.getItem("token");
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [replyDrafts, setReplyDrafts] = useState<Record<number, string>>({});
    const [submittingId, setSubmittingId] = useState<number | null>(null);

    useEffect(() => {
        fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const response = await axios.get<Review[]>("http://localhost:8080/api/admin/reviews", {
                headers: token ? { Authorization: `Bearer ${token}` } : undefined
            });
            setReviews(response.data || []);
            onReviewChanged?.();
        } catch (error) {
            console.error("Error fetching admin reviews:", error);
            setReviews([]);
            onNotify("", "Không thể tải danh sách đánh giá.");
        } finally {
            setLoading(false);
        }
    };

    const filteredReviews = useMemo(() => {
        const keyword = searchTerm.trim().toLowerCase();
        if (!keyword) {
            return reviews;
        }

        return reviews.filter((review) =>
            review.productTitle?.toLowerCase().includes(keyword) ||
            review.fullName?.toLowerCase().includes(keyword) ||
            review.username?.toLowerCase().includes(keyword) ||
            review.comment?.toLowerCase().includes(keyword)
        );
    }, [reviews, searchTerm]);

    const renderStars = (rating: number) =>
        Array.from({ length: 5 }, (_, index) => (
            <FaStar key={index} className={index < rating ? "active" : ""} />
        ));

    const formatDate = (value?: string | null) => {
        if (!value) {
            return "";
        }

        return new Date(value).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    const handleReplySubmit = async (reviewId: number) => {
        const reply = (replyDrafts[reviewId] || "").trim();
        if (!reply) {
            onNotify("", "Vui lòng nhập nội dung phản hồi trước khi gửi.");
            return;
        }

        try {
            setSubmittingId(reviewId);
            const response = await axios.post(
                `http://localhost:8080/api/reviews/${reviewId}/replies`,
                { message: reply },
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : undefined
                }
            );

            setReviews((prev) => prev.map((item) => item.id === reviewId ? response.data : item));
            setReplyDrafts((prev) => ({ ...prev, [reviewId]: "" }));
            onReviewChanged?.();
            onNotify("Phản hồi bình luận thành công!");
        } catch (error) {
            console.error("Error replying review:", error);
            onNotify("", "Không thể gửi phản hồi cho bình luận này.");
        } finally {
            setSubmittingId(null);
        }
    };

    return (
        <div className="admin-reviews-page">
            <div className="tab-header-row">
                <div>
                    <h2 className="tab-title">Quản lý đánh giá & bình luận</h2>
                    <p className="admin-reviews-subtitle">
                        Theo dõi phản hồi của khách hàng đã mua hàng và chủ động tương tác bằng phản hồi từ quản trị viên.
                    </p>
                </div>
            </div>

            <div className="admin-reviews-toolbar">
                <div className="admin-reviews-search">
                    <input
                        type="text"
                        placeholder="Tìm theo sản phẩm, người dùng hoặc nội dung bình luận..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="table-card admin-reviews-empty">
                    <p>Đang tải danh sách đánh giá...</p>
                </div>
            ) : filteredReviews.length === 0 ? (
                <div className="table-card admin-reviews-empty">
                    <FaRegCommentDots />
                    <h4>Chưa có bình luận phù hợp</h4>
                    <p>Các đánh giá mới từ khách hàng sẽ xuất hiện tại đây để quản trị viên phản hồi.</p>
                </div>
            ) : (
                <div className="admin-reviews-list">
                    {filteredReviews.map((review) => (
                        <article className="admin-review-card" key={review.id}>
                            <div className="admin-review-card-top">
                                <div>
                                    <span className="admin-review-product">{review.productTitle}</span>
                                    <h4>{review.fullName || review.username || "Khách hàng BookStore"}</h4>
                                    <p className="admin-review-meta">
                                        Đăng lúc {formatDate(review.createdAt)}
                                    </p>
                                </div>
                                <div className="admin-review-stars">
                                    {renderStars(review.rating)}
                                </div>
                            </div>

                            <div className="admin-review-comment">
                                {review.comment?.trim() || "Khách hàng chưa để lại nội dung bình luận chi tiết."}
                            </div>

                            {!!review.replies?.length && (
                                <div className="admin-review-replied-box">
                                    <strong>Trao đổi hiện tại</strong>
                                    {review.replies.map((reply) => (
                                        <div key={reply.id} className="admin-review-thread-item">
                                            <p>
                                                <strong>{reply.authorRole === "ADMIN" ? "BookStore" : reply.authorName}:</strong> {reply.message}
                                            </p>
                                            <span>{formatDate(reply.createdAt)}</span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="admin-review-reply-editor">
                                <textarea
                                    rows={4}
                                    placeholder="Nhập phản hồi của quản trị viên để tăng tương tác với khách hàng..."
                                    value={replyDrafts[review.id] ?? ""}
                                    onChange={(e) =>
                                        setReplyDrafts((prev) => ({ ...prev, [review.id]: e.target.value }))
                                    }
                                />
                                <button
                                    className="btn-submit-review-reply"
                                    onClick={() => handleReplySubmit(review.id)}
                                    disabled={submittingId === review.id}
                                >
                                    <FaPaperPlane />
                                    {submittingId === review.id ? "Đang gửi..." : "Gửi phản hồi"}
                                </button>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
