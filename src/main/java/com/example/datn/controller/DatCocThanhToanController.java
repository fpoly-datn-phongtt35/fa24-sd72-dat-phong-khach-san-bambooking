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
public class DatCocThanhToanController {
    private final DatCocThanhToanService paymentService;

    @PostMapping("/payos")
    public ResponseData<DatCocThanhToanResponse> createPayment(@Valid @RequestBody DatCocThanhToanRequest request) {
        log.info("POST/payos: idDatPhong {}, tienThanhToan {}, loaiThanhToan {}",
                request.getIdDatPhong(), request.getTienThanhToan(), request.getLoaiThanhToan());
        DatCocThanhToanResponse response = paymentService.createPaymentLink(request);
        return new ResponseData<>(HttpStatus.OK.value(), "Payment link created successfully", response);
    }

    @PostMapping("/webhook")
    public ResponseData<String> handleWebhook(@RequestBody Map<String, Object> payload,
                                              @RequestHeader("x-payos-signature") String signature) {
        log.info("POST/webhook: processing PayOS webhook");
        String result = paymentService.processPayOSWebhook(payload, signature);
        return new ResponseData<>(HttpStatus.OK.value(), "Webhook processed", result);
    }

    @PostMapping("/payos/qr")
    public ResponseData<DatCocThanhToanResponse> generateQRCode(@Valid @RequestBody DatCocThanhToanRequest request) {
        log.info("POST/payos/qr: idDatPhong {}, tienThanhToan {}, loaiThanhToan {}",
                request.getIdDatPhong(), request.getTienThanhToan(), request.getLoaiThanhToan());
        DatCocThanhToanResponse response = paymentService.generateQRCodeForPayment(request);
        return new ResponseData<>(HttpStatus.OK.value(), "QR code generated successfully", response);
    }

    @GetMapping("/payos/{id}")
    public ResponseData<DatCocThanhToanResponse> getPaymentDetails(
            @Min(value = 1, message = "Id phải lớn hơn 0") @PathVariable int id) {
        log.info("GET/payos/{}", id);
        DatCocThanhToanResponse response = paymentService.getPaymentDetails(id);
        return new ResponseData<>(HttpStatus.OK.value(), "Payment details retrieved successfully", response);
    }
}
