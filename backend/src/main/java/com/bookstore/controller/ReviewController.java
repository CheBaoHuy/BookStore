package com.bookstore.controller;

import com.bookstore.dto.RateDto;
import com.bookstore.model.Review;
import com.bookstore.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    /** GET /api/products/{productId}/reviews?page=0&size=10 */
    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<Page<Review>> getReviewsByProduct(
            @PathVariable Long productId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(reviewService.getReviewsByProduct(productId, page, size));
    }

    /** POST /api/reviews - Thêm đánh giá */
    @PostMapping("/reviews")
    public ResponseEntity<?> createReview(@Valid @RequestBody RateDto dto) {
        try {
            Review review = reviewService.createReview(dto);
            return ResponseEntity.ok(review);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
