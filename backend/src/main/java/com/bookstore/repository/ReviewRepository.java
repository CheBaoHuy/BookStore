package com.bookstore.repository;

import com.bookstore.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByProductIdAndStatusTrue(Long productId, Pageable pageable);
    boolean existsByProductIdAndUserId(Long productId, Long userId);
}
