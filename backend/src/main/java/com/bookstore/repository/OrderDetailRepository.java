package com.bookstore.repository;

import com.bookstore.model.OrderDetail;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findByOrderId(Long orderId);

    @Query("""
            select od from OrderDetail od
            where od.id = :orderDetailId
              and od.product.id = :productId
              and od.order.user.id = :userId
              and od.order.orderStatus.status = :deliveredStatus
            """)
    Optional<OrderDetail> findEligibleReviewDetail(
            @Param("orderDetailId") Long orderDetailId,
            @Param("productId") Long productId,
            @Param("userId") Long userId,
            @Param("deliveredStatus") String deliveredStatus
    );

    @Query("""
            select od from OrderDetail od
            where od.order.user.id = :userId
              and od.order.orderStatus.status = :deliveredStatus
            order by od.order.createdAt desc, od.id desc
            """)
    List<OrderDetail> findDeliveredOrderDetailsByUserId(
            @Param("userId") Long userId,
            @Param("deliveredStatus") String deliveredStatus
    );
}
