package com.bookstore.service;

import com.bookstore.dto.AdminReplyDto;
import com.bookstore.dto.ProductReviewStatsDto;
import com.bookstore.dto.RateDto;
import com.bookstore.dto.ReviewAdminSummaryDto;
import com.bookstore.dto.ReviewEligibilityDto;
import com.bookstore.dto.ReviewSummaryDto;
import com.bookstore.model.OrderDetail;
import com.bookstore.model.Product;
import com.bookstore.model.Review;
import com.bookstore.model.User;
import com.bookstore.repository.OrderDetailRepository;
import com.bookstore.repository.ProductRepository;
import com.bookstore.repository.ReviewRepository;
import com.bookstore.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ReviewService {
    private static final String DELIVERED_STATUS = "Đã giao hàng";

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private NotificationService notificationService;

    public Page<ReviewSummaryDto> getReviewsByProduct(Long productId, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return reviewRepository.findByProductIdAndStatusTrue(productId, pageable)
                .map(this::toSummaryDto);
    }

    public ProductReviewStatsDto getProductReviewStats(Long productId) {
        long totalReviews = reviewRepository.countByProductIdAndStatusTrue(productId);
        Double averageRating = reviewRepository.getAverageRatingByProductId(productId);
        return new ProductReviewStatsDto(averageRating != null ? averageRating : 0, totalReviews);
    }

    public ReviewSummaryDto createReview(String username, RateDto dto) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));
        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm!"));
        if (dto.getOrderDetailsId() == null) {
            throw new RuntimeException("Thiếu thông tin sản phẩm đã mua để đánh giá!");
        }

        OrderDetail orderDetail = orderDetailRepository.findEligibleReviewDetail(
                        dto.getOrderDetailsId(),
                        dto.getProductId(),
                        user.getId(),
                        DELIVERED_STATUS
                )
                .orElseThrow(() -> new RuntimeException("Bạn chỉ có thể đánh giá sản phẩm đã mua và đã giao thành công!"));

        if (reviewRepository.existsByOrderDetailId(orderDetail.getId())) {
            throw new RuntimeException("Sản phẩm trong đơn hàng này đã được đánh giá trước đó!");
        }

        Review review = Review.builder()
                .user(user)
                .product(product)
                .orderDetail(orderDetail)
                .rating(dto.getStars())
                .comment(dto.getContent() != null ? dto.getContent().trim() : null)
                .status(true)
                .build();

        Review savedReview = reviewRepository.save(review);
        notifyAdminsAboutNewReview(savedReview);
        return toSummaryDto(savedReview);
    }

    public List<Long> getReviewedOrderDetailIds(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        return reviewRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(Review::getOrderDetail)
                .filter(orderDetail -> orderDetail != null && orderDetail.getId() != null)
                .map(OrderDetail::getId)
                .distinct()
                .toList();
    }

    public List<ReviewEligibilityDto> getEligibleProductsForReview(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng!"));

        Set<Long> reviewedOrderDetailIds = getReviewedOrderDetailIds(username).stream()
                .collect(Collectors.toSet());

        return orderDetailRepository.findDeliveredOrderDetailsByUserId(user.getId(), DELIVERED_STATUS).stream()
                .filter(detail -> detail.getProduct() != null)
                .map(detail -> new ReviewEligibilityDto(
                        detail.getId(),
                        detail.getOrder() != null ? detail.getOrder().getId() : null,
                        detail.getProduct().getId(),
                        detail.getProduct().getTitle(),
                        detail.getProduct().getImage(),
                        detail.getQuantity(),
                        reviewedOrderDetailIds.contains(detail.getId())
                ))
                .toList();
    }

    public List<ReviewSummaryDto> getAllReviewsForAdmin() {
        return reviewRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(this::toSummaryDto)
                .toList();
    }

    public ReviewAdminSummaryDto getAdminReviewSummary() {
        long totalReviews = reviewRepository.countByStatusTrue();
        long pendingReplies = reviewRepository.countPendingAdminReplies();
        long repliedReviews = reviewRepository.countReviewedByAdmin();
        Double averageRating = reviewRepository.getAverageRatingForAllReviews();

        return new ReviewAdminSummaryDto(
                totalReviews,
                pendingReplies,
                repliedReviews,
                averageRating != null ? averageRating : 0
        );
    }

    public ReviewSummaryDto replyToReview(Long reviewId, String adminUsername, AdminReplyDto dto) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá cần phản hồi!"));
        User admin = userRepository.findByUsername(adminUsername)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản quản trị!"));

        review.setAdminReply(dto.getReply().trim());
        review.setAdminRepliedAt(LocalDateTime.now());
        review.setAdminRepliedBy(
                admin.getFullName() != null && !admin.getFullName().isBlank()
                        ? admin.getFullName()
                        : admin.getUsername()
        );

        Review savedReview = reviewRepository.save(review);
        notifyUserAboutAdminReply(savedReview);
        return toSummaryDto(savedReview);
    }

    private void notifyAdminsAboutNewReview(Review review) {
        List<User> admins = userRepository.findByRole("ADMIN");
        if (admins.isEmpty()) {
            return;
        }

        long pendingReplies = reviewRepository.countPendingAdminReplies();
        String reviewerName = review.getUser() != null
                ? (review.getUser().getFullName() != null && !review.getUser().getFullName().isBlank()
                    ? review.getUser().getFullName()
                    : review.getUser().getUsername())
                : "Khách hàng";
        String productTitle = review.getProduct() != null ? review.getProduct().getTitle() : "sản phẩm";
        String title = "Có đánh giá mới từ khách hàng";
        String message = reviewerName + " vừa đánh giá \"" + productTitle + "\". "
                + "Hiện có " + pendingReplies + " đánh giá đang chờ quản trị viên phản hồi.";

        admins.forEach(admin -> notificationService.createNotification(admin, title, message));
    }

    private void notifyUserAboutAdminReply(Review review) {
        if (review.getUser() == null || review.getProduct() == null) {
            return;
        }

        String adminName = review.getAdminRepliedBy() != null && !review.getAdminRepliedBy().isBlank()
                ? review.getAdminRepliedBy()
                : "BookStore";
        String title = "BookStore đã phản hồi đánh giá của bạn";
        String message = adminName + " vừa phản hồi bình luận của bạn về sản phẩm \""
                + review.getProduct().getTitle() + "\".";

        notificationService.createNotification(review.getUser(), title, message);
    }

    private ReviewSummaryDto toSummaryDto(Review review) {
        return new ReviewSummaryDto(
                review.getId(),
                review.getOrderDetail() != null && review.getOrderDetail().getOrder() != null
                        ? review.getOrderDetail().getOrder().getId()
                        : null,
                review.getOrderDetail() != null ? review.getOrderDetail().getId() : null,
                review.getProduct() != null ? review.getProduct().getId() : null,
                review.getProduct() != null ? review.getProduct().getTitle() : null,
                review.getProduct() != null ? review.getProduct().getImage() : null,
                review.getUser() != null ? review.getUser().getId() : null,
                review.getUser() != null ? review.getUser().getUsername() : null,
                review.getUser() != null ? review.getUser().getFullName() : null,
                review.getRating(),
                review.getComment(),
                review.getAdminReply(),
                review.getCreatedAt(),
                review.getUpdatedAt(),
                review.getAdminRepliedAt(),
                review.getAdminRepliedBy(),
                review.isStatus()
        );
    }
}
