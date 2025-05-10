package com.example.datn.service.IMPL;

import com.example.datn.dto.request.DatCocThanhToanRequest;
import com.example.datn.dto.response.DatCocThanhToanResponse;
import com.example.datn.model.DatCocThanhToan;
import com.example.datn.model.DatPhong;
import com.example.datn.repository.DatCocThanhToanRepository;
import com.example.datn.repository.DatPhongRepository;
import com.example.datn.service.DatCocThanhToanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import vn.payos.PayOS;
import vn.payos.type.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class DatCocThanhToanServiceImpl implements DatCocThanhToanService {

    private final DatPhongRepository datPhongRepository;
    private final DatCocThanhToanRepository datCocThanhToanRepository;
    private final PayOS payOS;

    @Value("${payos.return-url}")
    private String returnUrl;

    @Value("${payos.cancel-url}")
    private String cancelUrl;


    @Override
    public DatCocThanhToanResponse createPaymentLink(DatCocThanhToanRequest request) {
        log.info("Bắt đầu tạo link thanh toán cho đặt phòng ID: {}", request.getIdDatPhong());
        try {
            // Kiểm tra tồn tại của đặt phòng
            DatPhong datPhong = datPhongRepository.findById(request.getIdDatPhong())
                    .orElseThrow(() -> {
                        log.error("Đặt phòng không tồn tại với ID: {}", request.getIdDatPhong());
                        return new RuntimeException("Đặt phòng không tồn tại với ID: " + request.getIdDatPhong());
                    });

            Double tienThanhToan = tinhTienThanhToan(datPhong, request.getLoaiThanhToan());

            // Tạo bản ghi thanh toán
            DatCocThanhToan datCocThanhToan = DatCocThanhToan.builder()
                    .datPhong(datPhong)
                    .ngayThanhToan(LocalDateTime.now())
                    .tienThanhToan(tienThanhToan)
                    .phuongThucThanhToan(true) // PayOS
                    .loaiThanhToan(request.getLoaiThanhToan())
                    .trangThai(false) // Pending
                    .build();

            // Tạo dữ liệu thanh toán cho PayOS
            List<ItemData> items = new ArrayList<>();
            items.add(ItemData.builder()
                    .name(request.getLoaiThanhToan() + " cho đặt phòng " + datPhong.getMaDatPhong())
                    .quantity(1)
                    .price(request.getTienThanhToan().intValue())
                    .build());

            PaymentData paymentData = PaymentData.builder()
                    .orderCode(Long.valueOf(datPhong.getId()))
                    .amount(request.getTienThanhToan().intValue())
                    .description(request.getLoaiThanhToan() + " cho đặt phòng " + datPhong.getMaDatPhong())
                    .items(items)
                    .returnUrl(returnUrl)
                    .cancelUrl(cancelUrl)
                    .build();

            log.debug("Gửi yêu cầu tạo link thanh toán cho PayOS với mã đặt phòng: {}", datPhong.getMaDatPhong());
            CheckoutResponseData paymentLinkData = payOS.createPaymentLink(paymentData);

            // Lưu paymentLinkId
            datCocThanhToan.setPaymentLinkId(paymentLinkData.getPaymentLinkId());
            datCocThanhToan = datCocThanhToanRepository.save(datCocThanhToan);

            // Chuẩn bị response
            DatCocThanhToanResponse response = new DatCocThanhToanResponse(
                    datCocThanhToan.getId(),
                    datCocThanhToan.getDatPhong().getId(),
                    datCocThanhToan.getNgayThanhToan(),
                    datCocThanhToan.getTienThanhToan(),
                    datCocThanhToan.getPhuongThucThanhToan(),
                    datCocThanhToan.getPaymentLinkId(),
                    datCocThanhToan.getLoaiThanhToan(),
                    datCocThanhToan.getTrangThai(),
                    paymentLinkData.getCheckoutUrl()
            );

            log.info("Tạo link thanh toán thành công, checkoutUrl: {}", paymentLinkData.getCheckoutUrl());
            return response;
        } catch (Exception e) {
            log.error("Lỗi khi tạo link thanh toán: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi khi tạo link thanh toán: " + e.getMessage());
        }
    }

    @Override
    public String processPayOSWebhook(Map<String, Object> payload, String signature) {
        log.info("Bắt đầu xử lý webhook từ PayOS");
        try {
            // Xác minh chữ ký
            Webhook webhookData = Webhook.builder()
                    .code((String) payload.get("code"))
                    .desc((String) payload.get("desc"))
                    .data(WebhookData.builder()
                            .orderCode(Long.valueOf(String.valueOf(payload.get("orderCode"))))
                            .amount((int) ((Number) payload.get("amount")).longValue())
                            .description((String) payload.get("description"))
                            .accountNumber((String) payload.get("accountNumber"))
                            .reference((String) payload.get("reference"))
                            .transactionDateTime((String) payload.get("transactionDateTime"))
                            .paymentLinkId(String.valueOf(payload.get("paymentLinkId")))
                            .code((String) payload.get("code"))
                            .desc((String) payload.get("desc"))
                            .build())
                    .signature(signature)
                    .build();

            // Sửa lỗi: payOS.verifyPaymentWebhookData trả về WebhookData, cần kiểm tra trường status
            WebhookData verifiedData = payOS.verifyPaymentWebhookData(webhookData);
            if (verifiedData == null || !"PAID".equals(verifiedData.getCode())) {
                log.warn("Chữ ký webhook không hợp lệ hoặc thanh toán chưa hoàn tất, payload: {}", payload);
                throw new RuntimeException("Chữ ký webhook không hợp lệ hoặc thanh toán chưa hoàn tất");
            }

            // Lấy thông tin từ payload
            String paymentLinkId = String.valueOf(payload.get("paymentLinkId"));
            String status = (String) payload.get("code");

            // Tìm bản ghi thanh toán
            DatCocThanhToan datCocThanhToan = datCocThanhToanRepository.findByPaymentLinkId(paymentLinkId)
                    .orElseThrow(() -> {
                        log.error("Không tìm thấy bản ghi thanh toán với paymentLinkId: {}", paymentLinkId);
                        return new RuntimeException("Không tìm thấy bản ghi thanh toán với paymentLinkId: " + paymentLinkId);
                    });

            // Cập nhật trạng thái
            if ("PAID".equals(status)) {
                datCocThanhToan.setTrangThai(true); // Success
                log.info("Thanh toán thành công cho paymentLinkId: {}", paymentLinkId);
            } else {
                datCocThanhToan.setTrangThai(false); // Failed hoặc Pending
                log.warn("Thanh toán thất bại hoặc pending cho paymentLinkId: {}", paymentLinkId);
            }

            // Cập nhật trạng thái đặt phòng
            DatPhong datPhong = datCocThanhToan.getDatPhong();
            if (datCocThanhToan.getTrangThai()) {
                datPhong.setTrangThaiThanhToan("Đã xác nhận");
                log.info("Cập nhật trạng thái đặt phòng thành 'Đã xác nhận' cho ID: {}", datPhong.getId());
            }

            datCocThanhToanRepository.save(datCocThanhToan);
            datPhongRepository.save(datPhong);

            log.info("Xử lý webhook thành công cho paymentLinkId: {}", paymentLinkId);
            return "Webhook processed successfully";
        } catch (Exception e) {
            log.error("Lỗi khi xử lý webhook: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi khi xử lý webhook: " + e.getMessage());
        }
    }

    @Override
    public DatCocThanhToanResponse generateQRCodeForPayment(DatCocThanhToanRequest request) {
        log.info("Bắt đầu tạo QR code cho thanh toán, đặt phòng ID: {}", request.getIdDatPhong());
        try {
            // Tái sử dụng logic từ createPaymentLink
            DatCocThanhToanResponse response = createPaymentLink(request);
            log.info("Tạo QR code thành công, checkoutUrl: {}", response.getCheckoutUrl());
            return response;
        } catch (Exception e) {
            log.error("Lỗi khi tạo QR code: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi khi tạo QR code: " + e.getMessage());
        }
    }

    @Override
    public DatCocThanhToanResponse getPaymentDetails(Integer id) {
        log.info("Lấy thông tin thanh toán cho ID: {}", id);
        try {
            DatCocThanhToan datCocThanhToan = datCocThanhToanRepository.findById(id)
                    .orElseThrow(() -> {
                        log.error("Không tìm thấy bản ghi thanh toán với ID: {}", id);
                        return new RuntimeException("Không tìm thấy bản ghi thanh toán với ID: " + id);
                    });

            DatCocThanhToanResponse response = new DatCocThanhToanResponse(
                    datCocThanhToan.getId(),
                    datCocThanhToan.getDatPhong().getId(),
                    datCocThanhToan.getNgayThanhToan(),
                    datCocThanhToan.getTienThanhToan(),
                    datCocThanhToan.getPhuongThucThanhToan(),
                    datCocThanhToan.getPaymentLinkId(),
                    datCocThanhToan.getLoaiThanhToan(),
                    datCocThanhToan.getTrangThai(),
                    null // checkoutUrl không cần thiết khi lấy chi tiết
            );

            log.info("Lấy thông tin thanh toán thành công cho ID: {}", id);
            return response;
        } catch (Exception e) {
            log.error("Lỗi khi lấy thông tin thanh toán: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi khi lấy thông tin thanh toán: " + e.getMessage());
        }
    }

    private Double tinhTienThanhToan(DatPhong datPhong, String loaiThanhToan) {

        Double tongTien = datPhong.getTongTien();

        if ("Đặt cọc".equals(loaiThanhToan)) {
            return tongTien * 0.3;
        } else if ("Thanh toán trước".equals(loaiThanhToan)) {
            return tongTien;
        } else {
            throw new IllegalArgumentException("Loại thanh toán không hợp lệ: " + loaiThanhToan);
        }
    }

}