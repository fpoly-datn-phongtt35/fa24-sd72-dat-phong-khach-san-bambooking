package com.example.datn.controller;

import com.example.datn.controller.response.ResponseData;
import com.example.datn.dto.request.DatCocThanhToanRequest;
import com.example.datn.dto.response.DatCocThanhToanResponse;
import com.example.datn.service.DatCocThanhToanService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/payment")
@RequiredArgsConstructor
@Slf4j(topic = "PAYMENT-CONTROLLER")
@Validated
@CrossOrigin("*")
public class DatCocThanhToanController {
    private final DatCocThanhToanService paymentService;

    @PostMapping("/payos")
    public ResponseData<DatCocThanhToanResponse> createPayment(@Valid @RequestBody DatCocThanhToanRequest request) {
        log.info("POST /payos: Creating payment link for request: {}", request);
        DatCocThanhToanResponse response = paymentService.createPaymentLink(request);
        return new ResponseData<>(HttpStatus.OK.value(), "Payment link created successfully", response);
    }

    @PostMapping("/webhook")
    public ResponseData<String> handleWebhook(@RequestBody Map<String, Object> payload) {
        log.info("POST /webhook: Received payload: {}", payload);
        try {
            // Lấy chữ ký từ payload
            String signature = (String) payload.get("signature");
            if (signature == null) {
                log.error("Missing signature in webhook payload");
                return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Missing signature in payload", null);
            }
            String result = paymentService.processPayOSWebhook(payload, signature);
            return new ResponseData<>(HttpStatus.OK.value(), "Webhook processed successfully", result);
        } catch (Exception e) {
            log.error("Error processing webhook: {}", e.getMessage(), e);
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), "Error: " + e.getMessage(), null);
        }
    }

    @PostMapping("/payos/qr")
    public ResponseData<DatCocThanhToanResponse> generateQRCode(@Valid @RequestBody DatCocThanhToanRequest request) {
        log.info("POST /payos/qr: Generating QR code for request: {}", request);
        DatCocThanhToanResponse response = paymentService.generateQRCodeForPayment(request);
        return new ResponseData<>(HttpStatus.OK.value(), "QR code generated successfully", response);
    }

    @GetMapping("/payos/{id}")
    public ResponseData<DatCocThanhToanResponse> getPaymentDetails(
            @Min(value = 1, message = "Id phải lớn hơn 0") @PathVariable int id) {
        log.info("GET /payos/{}", id);
        DatCocThanhToanResponse response = paymentService.getPaymentDetails(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Payment details retrieved successfully", response);
    }

    @GetMapping("/payos/status/{orderCode}")
    public ResponseData<DatCocThanhToanResponse> getPaymentStatus(@PathVariable Long orderCode) {
        log.info("GET /payos/status/{}", orderCode);
        DatCocThanhToanResponse response = paymentService.getPaymentStatus(orderCode);
        return new ResponseData<>(HttpStatus.OK.value(), "Payment status retrieved", response);
    }

    @GetMapping("/success")
    public ResponseData<DatCocThanhToanResponse> handlePaymentSuccess(@RequestParam("orderCode") Long orderCode) {
        log.info("GET /payment/success with orderCode: {}", orderCode);
        try {
            paymentService.successPayment(orderCode);
            DatCocThanhToanResponse response = paymentService.getPaymentStatus(orderCode);
            return new ResponseData<>(HttpStatus.OK.value(), "Thanh toán thành công", response);
        } catch (IllegalStateException e) {
            log.error("Lỗi khi xử lý thanh toán thành công: {}", e.getMessage());
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null);
        } catch (Exception e) {
            log.error("Lỗi khi xử lý thanh toán thành công: {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi khi xử lý thanh toán", null);
        }
    }

    @GetMapping("/cancel")
    public ResponseData<DatCocThanhToanResponse> handlePaymentCancel(@RequestParam("orderCode") Long orderCode) {
        log.info("GET /payment/cancel with orderCode: {}", orderCode);
        try {
            paymentService.cancelPayment(orderCode);
            DatCocThanhToanResponse response = paymentService.getPaymentStatus(orderCode);
            return new ResponseData<>(HttpStatus.OK.value(), "Thanh toán đã bị hủy", response);
        } catch (IllegalStateException e) {
            log.error("Lỗi khi xử lý hủy thanh toán: {}", e.getMessage());
            return new ResponseData<>(HttpStatus.BAD_REQUEST.value(), e.getMessage(), null);
        } catch (Exception e) {
            log.error("Lỗi khi xử lý hủy thanh toán: {}", e.getMessage());
            return new ResponseData<>(HttpStatus.INTERNAL_SERVER_ERROR.value(), "Lỗi khi xử lý hủy thanh toán", null);
        }
    }
}