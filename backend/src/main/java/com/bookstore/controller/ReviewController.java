package com.bookstore.controller;

import com.bookstore.dto.AdminReplyDto;
import com.bookstore.dto.ProductReviewStatsDto;
import com.bookstore.dto.RateDto;
import com.bookstore.dto.ReviewAdminSummaryDto;
import com.bookstore.dto.ReviewEligibilityDto;
import com.bookstore.dto.ReviewSummaryDto;
import com.bookstore.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    /** GET /api/products/{productId}/reviews?page=0&size=10 */
    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<Page<ReviewSummaryDto>> getReviewsByProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId, page, size));
    }

    @GetMapping("/products/{productId}/reviews/stats")
    public ResponseEntity<ProductReviewStatsDto> getReviewStats(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getProductReviewStats(productId));
    }

    /** POST /api/reviews - Thêm đánh giá */
    @PostMapping("/reviews")
    public ResponseEntity<?> createReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody RateDto dto) {
        try {
            ReviewSummaryDto review = reviewService.createReview(userDetails.getUsername(), dto);
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/reviews/my-reviewed-order-details")
    public ResponseEntity<List<Long>> getMyReviewedOrderDetails(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reviewService.getReviewedOrderDetailIds(userDetails.getUsername()));
    }

    @GetMapping("/reviews/my-eligible-products")
    public ResponseEntity<List<ReviewEligibilityDto>> getMyEligibleProducts(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(reviewService.getEligibleProductsForReview(userDetails.getUsername()));
    }

    @GetMapping("/admin/reviews")
    public ResponseEntity<List<ReviewSummaryDto>> getAllReviewsForAdmin() {
        return ResponseEntity.ok(reviewService.getAllReviewsForAdmin());
    }

    @GetMapping("/admin/reviews/summary")
    public ResponseEntity<ReviewAdminSummaryDto> getAdminReviewSummary() {
        return ResponseEntity.ok(reviewService.getAdminReviewSummary());
    }

    @PutMapping("/admin/reviews/{reviewId}/reply")
    public ResponseEntity<?> replyToReview(
            @PathVariable Long reviewId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody AdminReplyDto dto) {
        try {
            ReviewSummaryDto review = reviewService.replyToReview(reviewId, userDetails.getUsername(), dto);
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
