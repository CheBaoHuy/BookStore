package com.bookstore.repository;

import com.bookstore.model.Review;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByProductIdAndStatusTrue(Long productId, Pageable pageable);
    boolean existsByProductIdAndUserId(Long productId, Long userId);
    boolean existsByOrderDetailId(Long orderDetailId);
    List<Review> findAllByOrderByCreatedAtDesc();
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    long countByProductIdAndStatusTrue(Long productId);
    long countByStatusTrue();

    @Query("select count(r) from Review r where r.status = true and trim(coalesce(r.adminReply, '')) = ''")
    long countPendingAdminReplies();

    @Query("select count(r) from Review r where r.status = true and trim(coalesce(r.adminReply, '')) <> ''")
    long countReviewedByAdmin();

    @Query("select coalesce(avg(r.rating), 0) from Review r where r.status = true")
    Double getAverageRatingForAllReviews();

    @Query("select coalesce(avg(r.rating), 0) from Review r where r.product.id = :productId and r.status = true")
    Double getAverageRatingByProductId(@Param("productId") Long productId);
}
