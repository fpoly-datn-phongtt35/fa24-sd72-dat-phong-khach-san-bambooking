package com.example.datn.repository;

import com.example.datn.model.DatCocThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DatCocThanhToanRepository extends JpaRepository<DatCocThanhToan, Integer> {
    Optional<DatCocThanhToan> findByDatPhong_Id(Integer idDatPhong);
    Optional<DatCocThanhToan> findByPaymentLinkId(String paymentLinkId);
    Optional<DatCocThanhToan> findByOrderCodePayment(Long orderCodePayment);
}
