package com.bookstore.repository;

import com.bookstore.model.Order;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Order> findByOrderStatusId(Long statusId);

    @EntityGraph(attributePaths = {
            "orderStatus",
            "orderDetails",
            "orderDetails.product",
            "orderDetails.product.category"
    })
    @Query("""
            select distinct o
            from Order o
            left join o.orderDetails od
            where o.orderStatus.id = :statusId
              and o.createdAt >= :startDateTime
              and o.createdAt < :endDateTime
            order by o.createdAt asc
            """)
    List<Order> findRevenueOrdersInRange(
            @Param("statusId") Long statusId,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime
    );
}
