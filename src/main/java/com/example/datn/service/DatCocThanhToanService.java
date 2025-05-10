package com.example.datn.service;

import com.example.datn.dto.request.DatCocThanhToanRequest;
import com.example.datn.dto.response.DatCocThanhToanResponse;

import java.util.Map;

public interface DatCocThanhToanService {
    /**
     * Tạo link thanh toán qua PayOS cho đặt cọc hoặc thanh toán trước dựa trên request.
     *
     * @param request Đối tượng chứa thông tin thanh toán (idDatPhong, tienThanhToan, loaiThanhToan)
     * @return DatCocThanhToanResponse chứa thông tin thanh toán và checkoutUrl từ PayOS
     */
    DatCocThanhToanResponse createPaymentLink(DatCocThanhToanRequest request);

    /**
     * Xử lý webhook từ PayOS để cập nhật trạng thái thanh toán.
     *
     * @param payload Dữ liệu webhook từ PayOS (Map chứa các trường như paymentLinkId, status)
     * @param signature Chữ ký của webhook để xác minh tính hợp lệ
     * @return Chuỗi thông báo kết quả xử lý (ví dụ: "Webhook processed successfully")
     */
    String processPayOSWebhook(Map<String, Object> payload, String signature);

    /**
     * Tạo URL thanh toán để sinh mã QR cho đặt cọc hoặc thanh toán trước.
     *
     * @param request Đối tượng chứa thông tin thanh toán (idDatPhong, tienThanhToan, loaiThanhToan)
     * @return DatCocThanhToanResponse chứa checkoutUrl để tạo mã QR
     */
    DatCocThanhToanResponse generateQRCodeForPayment(DatCocThanhToanRequest request);

    /**
     * (Tùy chọn) Lấy thông tin thanh toán dựa trên ID của bản ghi DatCocThanhToan.
     *
     * @param id ID của bản ghi thanh toán
     * @return DatCocThanhToanResponse chứa thông tin thanh toán
     */
    DatCocThanhToanResponse getPaymentDetails(Integer id);
}
