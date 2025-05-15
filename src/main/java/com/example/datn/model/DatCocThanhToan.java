package com.example.datn.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "dat_coc_thanh_toan")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class DatCocThanhToan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "id_dat_phong")
    private DatPhong datPhong;
    @Column(name = "ngay_thanh_toan")
    private LocalDateTime ngayThanhToan;
    @Column(name = "tien_thanh_toan")
    private Double tienThanhToan;
    @Column(name = "phuong_thuc_thanh_toan")
    private Boolean phuongThucThanhToan; // 0: Tiền mặt, 1: PayOS
    @Column(name = "payment_link_id")
    private String paymentLinkId;
    @Column(name = "loai_thanh_toan")
    private String loaiThanhToan; // 'Đặt cọc' or 'Thanh toán trước'
    @Column(name = "trang_thai")
    private String trangThai;
    @Column(name = "order_code_payment")
    private Long orderCodePayment;
}
