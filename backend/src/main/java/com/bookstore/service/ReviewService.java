package com.bookstore.service;

import com.bookstore.dto.RateDto;
import com.bookstore.model.Product;
import com.bookstore.model.Review;
import com.bookstore.model.User;
import com.bookstore.repository.ProductRepository;
import com.bookstore.repository.ReviewRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    public Page<Review> getReviewsByProduct(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return reviewRepository.findByProductIdAndStatusTrue(productId, pageable);
    }

    public Review createReview(RateDto dto) {
        User user = userRepository.findById(dto.getUserId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm!"));

        Review review = Review.builder()
                .user(user)
                .product(product)
                .rating(dto.getStars())
                .comment(dto.getContent())
                .status(true)
                .build();

        return reviewRepository.save(review);
    }
}
