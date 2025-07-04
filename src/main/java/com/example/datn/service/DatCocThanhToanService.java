package com.example.datn.service;

import com.example.datn.dto.request.DatCocThanhToanRequest;
import com.example.datn.dto.response.DatCocThanhToanResponse;
import com.example.datn.model.DatCocThanhToan;

import java.util.Map;

public interface DatCocThanhToanService {
    DatCocThanhToanResponse createPaymentLink(DatCocThanhToanRequest request);
    String processPayOSWebhook(Map<String, Object> payload, String signature);
    DatCocThanhToanResponse generateQRCodeForPayment(DatCocThanhToanRequest request);
    DatCocThanhToanResponse getPaymentDetails(Integer id);
    void successPayment(Long orderCode);
    void cancelPayment(Long orderCode);
    DatCocThanhToanResponse getPaymentStatus(Long orderCode);

    DatCocThanhToan findDatCoc(Integer iddp);
    DatCocThanhToan findDatCocByidHoaDon(Integer idHoaDon);
}
