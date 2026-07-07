package com.bookstore.service;

import com.bookstore.dto.AdminReplyDto;
import com.bookstore.dto.CreateReviewReplyDto;
import com.bookstore.dto.ProductReviewStatsDto;
import com.bookstore.dto.RateDto;
import com.bookstore.dto.ReviewAdminSummaryDto;
import com.bookstore.dto.ReviewEligibilityDto;
import com.bookstore.dto.ReviewReplyDto;
import com.bookstore.dto.ReviewSummaryDto;
import com.bookstore.model.OrderDetail;
import com.bookstore.model.Product;
import com.bookstore.model.Review;
import com.bookstore.model.ReviewReply;
import com.bookstore.model.User;
import com.bookstore.repository.OrderDetailRepository;
import com.bookstore.repository.ProductRepository;
import com.bookstore.repository.ReviewReplyRepository;
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
    private ReviewReplyRepository reviewReplyRepository;

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
        List<Review> reviews = reviewRepository.findAllByOrderByCreatedAtDesc().stream()
                .filter(Review::isStatus)
                .toList();
        long totalReviews = reviews.size();
        long pendingReplies = reviews.stream()
                .filter(this::needsAdminReply)
                .count();
        long repliedReviews = reviews.stream()
                .filter(review -> !needsAdminReply(review))
                .count();
        Double averageRating = reviewRepository.getAverageRatingForAllReviews();

        return new ReviewAdminSummaryDto(
                totalReviews,
                pendingReplies,
                repliedReviews,
                averageRating != null ? averageRating : 0
        );
    }

    public ReviewSummaryDto replyToReview(Long reviewId, String adminUsername, AdminReplyDto dto) {
        return addReply(reviewId, adminUsername, new CreateReviewReplyDto(dto.getReply()));
    }

    public ReviewSummaryDto addReply(Long reviewId, String username, CreateReviewReplyDto dto) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đánh giá cần phản hồi!"));
        User actor = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tài khoản đang phản hồi!"));

        boolean isAdmin = "ADMIN".equalsIgnoreCase(actor.getRole());
        boolean isReviewOwner = review.getUser() != null && review.getUser().getId().equals(actor.getId());
        if (!isAdmin && !isReviewOwner) {
            throw new RuntimeException("Bạn không có quyền phản hồi bình luận này!");
        }

        ReviewReply reviewReply = ReviewReply.builder()
                .review(review)
                .user(actor)
                .authorRole(isAdmin ? "ADMIN" : "USER")
                .message(dto.message().trim())
                .build();
        reviewReplyRepository.save(reviewReply);

        if (isAdmin) {
            review.setAdminReply(dto.message().trim());
            review.setAdminRepliedAt(LocalDateTime.now());
            review.setAdminRepliedBy(getDisplayName(actor));
        }

        Review savedReview = reviewRepository.save(review);
        if (isAdmin) {
            notifyUserAboutAdminReply(savedReview, dto.message().trim());
        } else {
            notifyAdminsAboutUserReply(savedReview, actor, dto.message().trim());
        }
        return toSummaryDto(savedReview);
    }

    private void notifyAdminsAboutNewReview(Review review) {
        List<User> admins = userRepository.findByRole("ADMIN");
        if (admins.isEmpty()) {
            return;
        }

        long pendingReplies = getAdminReviewSummary().pendingReplies();
        String reviewerName = review.getUser() != null ? getDisplayName(review.getUser()) : "Khách hàng";
        String productTitle = review.getProduct() != null ? review.getProduct().getTitle() : "sản phẩm";
        String title = "Có đánh giá mới từ khách hàng";
        String message = reviewerName + " vừa đánh giá \"" + productTitle + "\". "
                + "Hiện có " + pendingReplies + " đánh giá đang chờ quản trị viên phản hồi.";
        String targetUrl = review.getProduct() != null
                ? "/product/" + review.getProduct().getId() + "?tab=reviews"
                : "/admin?tab=reviews";

        admins.forEach(admin -> notificationService.createNotification(admin, title, message, targetUrl));
    }

    private void notifyUserAboutAdminReply(Review review, String replyMessage) {
        if (review.getUser() == null || review.getProduct() == null) {
            return;
        }

        String adminName = review.getAdminRepliedBy() != null && !review.getAdminRepliedBy().isBlank()
                ? review.getAdminRepliedBy()
                : "BookStore";
        String title = "BookStore đã phản hồi đánh giá của bạn";
        String message = adminName + " vừa phản hồi bình luận của bạn về sản phẩm \""
                + review.getProduct().getTitle() + "\": " + shortenMessage(replyMessage);
        String targetUrl = "/product/" + review.getProduct().getId() + "?tab=reviews";

        notificationService.createNotification(review.getUser(), title, message, targetUrl);
    }

    private void notifyAdminsAboutUserReply(Review review, User actor, String replyMessage) {
        if (review.getProduct() == null) {
            return;
        }

        List<User> admins = userRepository.findByRole("ADMIN");
        if (admins.isEmpty()) {
            return;
        }

        String title = "Khách hàng vừa phản hồi lại bình luận";
        String message = getDisplayName(actor) + " vừa phản hồi trong phần đánh giá của sản phẩm \""
                + review.getProduct().getTitle() + "\": " + shortenMessage(replyMessage);
        String targetUrl = "/product/" + review.getProduct().getId() + "?tab=reviews";
        admins.forEach(admin -> notificationService.createNotification(admin, title, message, targetUrl));
    }

    private boolean needsAdminReply(Review review) {
        List<ReviewReply> replies = reviewReplyRepository.findByReviewIdOrderByCreatedAtAsc(review.getId());
        if (replies.isEmpty()) {
            return review.getComment() != null && !review.getComment().isBlank();
        }

        ReviewReply latestReply = replies.get(replies.size() - 1);
        return !"ADMIN".equalsIgnoreCase(latestReply.getAuthorRole());
    }

    private String getDisplayName(User user) {
        return user.getFullName() != null && !user.getFullName().isBlank()
                ? user.getFullName()
                : user.getUsername();
    }

    private String shortenMessage(String message) {
        String cleaned = message == null ? "" : message.trim();
        if (cleaned.length() <= 100) {
            return cleaned;
        }
        return cleaned.substring(0, 97) + "...";
    }

    private List<ReviewReplyDto> getReplyDtos(Long reviewId) {
        return reviewReplyRepository.findByReviewIdOrderByCreatedAtAsc(reviewId).stream()
                .map(reply -> new ReviewReplyDto(
                        reply.getId(),
                        reply.getUser() != null ? reply.getUser().getId() : null,
                        reply.getUser() != null ? getDisplayName(reply.getUser()) : "Người dùng",
                        reply.getAuthorRole(),
                        reply.getMessage(),
                        reply.getCreatedAt(),
                        reply.getUpdatedAt()
                ))
                .toList();
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
                getReplyDtos(review.getId()),
                review.getCreatedAt(),
                review.getUpdatedAt(),
                review.getAdminRepliedAt(),
                review.getAdminRepliedBy(),
                review.isStatus()
        );
    }
}
