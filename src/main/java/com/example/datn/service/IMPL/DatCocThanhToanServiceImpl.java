package com.example.datn.service.IMPL;

import com.example.datn.config.ConfigPayOS;
import com.example.datn.dto.request.DatCocThanhToanRequest;
import com.example.datn.dto.response.DatCocThanhToanResponse;
import com.example.datn.model.DatCocThanhToan;
import com.example.datn.model.DatPhong;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.repository.DatCocThanhToanRepository;
import com.example.datn.repository.DatPhongRepository;
import com.example.datn.repository.ThongTinDatPhongRepository;
import com.example.datn.service.DatCocThanhToanService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.HmacUtils;
import org.cloudinary.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import vn.payos.PayOS;
import vn.payos.type.*;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.*;

@Service
@Slf4j
@RequiredArgsConstructor
public class DatCocThanhToanServiceImpl implements DatCocThanhToanService {

    private final DatPhongRepository datPhongRepository;
    private final ThongTinDatPhongRepository thongTinDatPhongRepository;
    private final DatCocThanhToanRepository datCocThanhToanRepository;
    private final PayOS payOS;
    private final ConfigPayOS configPayOS;

    @Value("${payos.return-url}")
    private String returnUrl;

    @Value("${payos.cancel-url}")
    private String cancelUrl;

    @Override
    @Transactional
    public DatCocThanhToanResponse createPaymentLink(DatCocThanhToanRequest request) {
        log.info("Bắt đầu tạo link thanh toán cho đặt phòng ID: {}", request.getIdDatPhong());
        try {
            DatPhong datPhong = datPhongRepository.findById(request.getIdDatPhong())
                    .orElseThrow(() -> {
                        log.error("Đặt phòng không tồn tại với ID: {}", request.getIdDatPhong());
                        return new RuntimeException("Đặt phòng không tồn tại với ID: " + request.getIdDatPhong());
                    });

            long paymentCount = datCocThanhToanRepository.countByDatPhongId(request.getIdDatPhong());
            if (paymentCount >= 3) {
                log.error("Đã vượt quá số lần tạo thanh toán cho đặt phòng có ID : {}", request.getIdDatPhong());
                throw new IllegalStateException("Bạn đã tạo quá nhiều thanh toán cho đặt phòng này. Vui lòng liên hệ hỗ trợ.");
            }

            Optional<DatCocThanhToan> existingPayment = datCocThanhToanRepository.findByDatPhongIdAndTrangThai(request.getIdDatPhong(), "PENDING");
            if (existingPayment.isPresent()) {
                log.error("Đã tồn tại đặt cọc thanh toán có trạng thái là PENDING cho đặt phòng có ID: {}", request.getIdDatPhong());
                throw new IllegalStateException("Vui lòng hủy hoặc hoàn tất thanh toán hiện tại trước khi tạo thanh toán mới!");
            }

            Double tongTien = datPhong.getTongTien();
            Double tienThanhToan = tinhTienThanhToan(datPhong, request.getLoaiThanhToan());

            DatCocThanhToan datCocThanhToan = DatCocThanhToan.builder()
                    .datPhong(datPhong)
                    .ngayThanhToan(LocalDateTime.now())
                    .tienThanhToan(tienThanhToan)
                    .phuongThucThanhToan(true) // PayOS
                    .loaiThanhToan(request.getLoaiThanhToan())
                    .trangThai("PENDING")
                    .build();

            Long orderCodePayment = generateOrderCodePayment(datPhong.getId());
            datCocThanhToan.setOrderCodePayment(orderCodePayment);
            String returnUrlWithOrder = returnUrl + "?orderCode=" + URLEncoder.encode(String.valueOf(orderCodePayment), StandardCharsets.UTF_8);
            String cancelUrlWithOrder = cancelUrl + "?orderCode=" + URLEncoder.encode(String.valueOf(orderCodePayment), StandardCharsets.UTF_8);

            //Chia tien
            List<ThongTinDatPhong> listThongTinDatPhong = thongTinDatPhongRepository.findByDatPhong_Id(datPhong.getId());
            if (!listThongTinDatPhong.isEmpty()) {
                double tongGiaPhong = listThongTinDatPhong.stream().mapToDouble(ThongTinDatPhong::getGiaDat).sum();
                for (ThongTinDatPhong ttdp: listThongTinDatPhong) {
                    double tyLe = ttdp.getGiaDat()/tongGiaPhong;
                    double tienPhanBo = tienThanhToan * tyLe;
                    if (ttdp.getTienDaThanhToan() == null) ttdp.setTienDaThanhToan(0.0);
                    ttdp.setTienDaThanhToan(tienPhanBo);
                    thongTinDatPhongRepository.save(ttdp);
                }
            }

            List<ItemData> items = new ArrayList<>();
            items.add(ItemData.builder()
                    .name(request.getLoaiThanhToan() + " cho đặt phòng " + datPhong.getMaDatPhong())
                    .quantity(1)
                    .price(tienThanhToan.intValue())
                    .build());

            PaymentData paymentData = PaymentData.builder()
                    .orderCode(orderCodePayment)
                    .amount(tienThanhToan.intValue())
                    .description(request.getLoaiThanhToan() + "-" + datPhong.getMaDatPhong())
                    .items(items)
                    .returnUrl(returnUrlWithOrder)
                    .cancelUrl(cancelUrlWithOrder)
                    .build();

            log.debug("Gửi yêu cầu tạo link thanh toán cho PayOS với mã đặt phòng: {}", datPhong.getMaDatPhong());
            CheckoutResponseData paymentLinkData = payOS.createPaymentLink(paymentData);

            datCocThanhToan.setPaymentLinkId(paymentLinkData.getPaymentLinkId());
            datCocThanhToan = datCocThanhToanRepository.save(datCocThanhToan);

            DatCocThanhToanResponse response = DatCocThanhToanResponse.builder()
                    .id(datCocThanhToan.getId())
                    .idDatPhong(datCocThanhToan.getDatPhong().getId())
                    .ngayThanhToan(datCocThanhToan.getNgayThanhToan())
                    .tienThanhToan(datCocThanhToan.getTienThanhToan())
                    .phuongThucThanhToan(datCocThanhToan.getPhuongThucThanhToan())
                    .paymentLinkId(datCocThanhToan.getPaymentLinkId())
                    .loaiThanhToan(datCocThanhToan.getLoaiThanhToan())
                    .trangThai(datCocThanhToan.getTrangThai())
                    .orderCodePayment(datCocThanhToan.getOrderCodePayment())
                    .checkoutUrl(paymentLinkData.getCheckoutUrl())
                    .build();

            log.info("Tạo link thanh toán thành công, checkoutUrl: {}", paymentLinkData.getCheckoutUrl());
            return response;
        } catch (Exception e) {
            log.error("Lỗi khi tạo link thanh toán: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi khi tạo link thanh toán: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public String processPayOSWebhook(Map<String, Object> payload, String signature) {
        log.info("Webhook received at /api/v1/payment/webhook, payload: {}, signature: {}", payload, signature);
        try {
            // Kiểm tra payload và các trường bắt buộc
            if (payload == null || !payload.containsKey("data") || !payload.containsKey("code")) {
                log.error("Webhook payload không hợp lệ hoặc thiếu trường bắt buộc: {}", payload);
                throw new IllegalArgumentException("Webhook payload không hợp lệ hoặc thiếu trường bắt buộc");
            }

            Map<String, Object> data = (Map<String, Object>) payload.get("data");
            if (data == null || !data.containsKey("orderCode") || !data.containsKey("code") || !data.containsKey("paymentLinkId")) {
                log.error("Webhook data thiếu các trường bắt buộc: orderCode, code, paymentLinkId, data: {}", data);
                throw new IllegalArgumentException("Webhook data thiếu các trường bắt buộc: orderCode, code, paymentLinkId");
            }

            // Log thông tin quan trọng
            log.info("Webhook data: orderCode={}, paymentLinkId={}, code={}",
                    data.get("orderCode"), data.get("paymentLinkId"), data.get("code"));

            // Sắp xếp và tạo chuỗi giao dịch
            Map<String, Object> sortedData = new TreeMap<>(data);
            String transaction = new JSONObject(sortedData).toString();
            log.info("Sorted transaction string (JSON): {}", transaction);

            // Xác thực chữ ký
            if (!isValidData(transaction, signature)) {
                log.error("Chữ ký không hợp lệ. Transaction: {}, Signature: {}", transaction, signature);
                throw new IllegalArgumentException("Chữ ký không hợp lệ");
            }

            // Lấy orderCode và tìm bản ghi thanh toán
            Long orderCode = Long.valueOf(String.valueOf(data.get("orderCode")));
            DatCocThanhToan datCocThanhToan = datCocThanhToanRepository.findByOrderCodePayment(orderCode)
                    .orElseThrow(() -> {
                        log.error("Không tìm thấy bản ghi thanh toán với orderCodePayment: {}", orderCode);
                        return new RuntimeException("Không tìm thấy bản ghi thanh toán với orderCodePayment: " + orderCode);
                    });

            // Xử lý trạng thái
            String newStatus;
            if (payload.containsKey("cancel") && Boolean.parseBoolean(String.valueOf(payload.get("cancel")))) {
                newStatus = "CANCELLED";
                log.info("Webhook báo hủy thanh toán, orderCodePayment: {}, trạng thái mới: {}", orderCode, newStatus);
            } else {
                String payosStatus = (String) data.get("code");
                switch (payosStatus) {
                    case "00":
                    case "PAID":
                        newStatus = "PAID";
                        break;
                    case "FAILED":
                        newStatus = "FAILED";
                        break;
                    default:
                        newStatus = "PENDING";
                        log.warn("Trạng thái không xác định từ PayOS: {}, giữ PENDING", payosStatus);
                        break;
                }
            }

            // Cập nhật trạng thái nếu cần
            if (!newStatus.equals(datCocThanhToan.getTrangThai())) {
                datCocThanhToan.setTrangThai(newStatus);
                datCocThanhToanRepository.save(datCocThanhToan);
                log.info("Cập nhật trạng thái thành công cho orderCodePayment: {}, trạng thái mới: {}", orderCode, newStatus);

                // Nếu trạng thái là PAID, cập nhật trạng thái DatPhong thành "Đã xác nhận"
                if ("PAID".equals(newStatus)) {
                    DatPhong datPhong = datCocThanhToan.getDatPhong();
                    if (datPhong != null && !"Đã xác nhận".equals(datPhong.getTrangThai())) {
                        datPhong.setTrangThai("Đã xác nhận");
                        datPhongRepository.save(datPhong);
                        log.info("Cập nhật trạng thái DatPhong thành 'Đã xác nhận' cho datPhongId: {}", datPhong.getId());
                    } else if (datPhong == null) {
                        log.error("Không tìm thấy DatPhong liên quan đến orderCodePayment: {}", orderCode);
                        throw new RuntimeException("Không tìm thấy DatPhong liên quan đến orderCodePayment: " + orderCode);
                    } else {
                        log.info("Trạng thái DatPhong đã là 'Đã xác nhận' cho datPhongId: {}", datPhong.getId());
                    }

                    String trangThaiThanhToan = "Đặt cọc".equals(datCocThanhToan.getLoaiThanhToan()) ? "Đã đặt cọc" : "Đã thanh toán trước";
                    List<ThongTinDatPhong> thongTinDatPhongList = thongTinDatPhongRepository.findByDatPhong_Id(datPhong.getId());
                    for (ThongTinDatPhong thongTinDatPhong : thongTinDatPhongList) {
                        if (thongTinDatPhong.getTrangThaiThanhToan() == null) {
                            thongTinDatPhong.setTrangThaiThanhToan("Chưa thanh toán");
                        }
                        if (!"Hoàn tất".equals(thongTinDatPhong.getTrangThaiThanhToan())) {
                            thongTinDatPhong.setTrangThaiThanhToan(trangThaiThanhToan);
                        }
                    }
                    if (!thongTinDatPhongList.isEmpty()) {
                        thongTinDatPhongRepository.saveAll(thongTinDatPhongList);
                        log.info("Cập nhật trạng thái thanh toán thành '{}' cho datPhongId: {}", trangThaiThanhToan, datPhong.getId());
                    } else {
                        log.warn("Không tìm thấy bản ghi ThongTinDatPhong nào cho datPhongId: {}", datPhong.getId());
                    }
                }
            } else {
                log.info("Trạng thái không thay đổi cho orderCodePayment: {}, trạng thái hiện tại: {}", orderCode, newStatus);
            }

            return "Webhook processed successfully";
        } catch (Exception e) {
            log.error("Lỗi khi xử lý webhook: {}, payload: {}, signature: {}", e.getMessage(), payload, signature, e);
            throw new RuntimeException("Lỗi khi xử lý webhook: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public DatCocThanhToanResponse generateQRCodeForPayment(DatCocThanhToanRequest request) {
        log.info("Bắt đầu tạo QR code cho thanh toán, đặt phòng ID: {}", request.getIdDatPhong());
        try {
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

            DatCocThanhToanResponse response = DatCocThanhToanResponse.builder()
                    .id(datCocThanhToan.getId())
                    .idDatPhong(datCocThanhToan.getDatPhong().getId())
                    .ngayThanhToan(datCocThanhToan.getNgayThanhToan())
                    .tienThanhToan(datCocThanhToan.getTienThanhToan())
                    .phuongThucThanhToan(datCocThanhToan.getPhuongThucThanhToan())
                    .paymentLinkId(datCocThanhToan.getPaymentLinkId())
                    .loaiThanhToan(datCocThanhToan.getLoaiThanhToan())
                    .trangThai(datCocThanhToan.getTrangThai())
                    .orderCodePayment(datCocThanhToan.getOrderCodePayment())
                    .build();

            log.info("Lấy thông tin thanh toán thành công cho ID: {}", id);
            return response;
        } catch (Exception e) {
            log.error("Lỗi khi lấy thông tin thanh toán: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi khi lấy thông tin thanh toán: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public void successPayment(Long orderCode) {
        log.info("Thanh toán thành công cho orderCodePayment: {}", orderCode);
        DatCocThanhToan datCocThanhToan = datCocThanhToanRepository.findByOrderCodePayment(orderCode)
                .orElseThrow(() -> {
                    log.error("Không tìm thấy bản ghi thanh toán với orderCodePayment: {}", orderCode);
                    return new RuntimeException("Không tìm thấy bản ghi thanh toán với orderCodePayment: " + orderCode);
                });
        if ("PAID".equals(datCocThanhToan.getTrangThai())) {
            log.info("Trạng thái của thanh toán đã là PAID, không cần cập nhật");
            return;
        }
        if ("CANCELLED".equals(datCocThanhToan.getTrangThai()) || "FAILED".equals(datCocThanhToan.getTrangThai())) {
            log.error("Không thể cập nhật trạng thái thành PAID vì trạng thái hiện tại là: {}", datCocThanhToan.getTrangThai());
            throw new IllegalStateException("Thanh toán đã bị hủy hoặc thất bại, không thể cập nhật thành PAID");
        }
        datCocThanhToan.setTrangThai("PAID");
        datCocThanhToanRepository.save(datCocThanhToan);
        log.info("Cập nhật trạng thái thành PAID cho orderCodePayment: {}", orderCode);

        DatPhong confirmDatPhong = datCocThanhToan.getDatPhong();
        if (confirmDatPhong != null && !"Đã xác nhận".equals(confirmDatPhong.getTrangThai())) {
            confirmDatPhong.setTrangThai("Đã xác nhận");
            datPhongRepository.save(confirmDatPhong);
            log.info("Cập nhật trạng thái DatPhong thành 'Đã xác nhận' cho datPhongId: {}", confirmDatPhong.getId());
        } else if (confirmDatPhong == null) {
            log.error("Không tìm thấy DatPhong liên quan đến orderCodePayment: {}", orderCode);
            throw new RuntimeException("Không tìm thấy DatPhong liên quan đến orderCodePayment: " + orderCode);
        } else {
            log.info("Trạng thái DatPhong đã là 'Đã xác nhận' cho datPhongId: {}", confirmDatPhong.getId());
        }
    }

    @Override
    @Transactional
    public void cancelPayment(Long orderCode) {
        log.info("Hủy thanh toán cho orderCodePayment: {}", orderCode);
        DatCocThanhToan datCocThanhToan = datCocThanhToanRepository.findByOrderCodePayment(orderCode)
                .orElseThrow(() -> {
                    log.error("Không tìm thấy bản ghi thanh toán với orderCodePayment: {}", orderCode);
                    return new RuntimeException("Không tìm thấy bản ghi thanh toán với orderCodePayment: " + orderCode);
                });
        if ("CANCELLED".equals(datCocThanhToan.getTrangThai())) {
            log.info("Trạng thái của thanh toán đã là CANCELLED, không cần cập nhật");
            return;
        }
        if ("PAID".equals(datCocThanhToan.getTrangThai())) {
            log.error("Không thể hủy thanh toán vì trạng thái hiện tại là PAID");
            throw new IllegalStateException("Thanh toán đã hoàn tất, không thể hủy");
        }

        Long orderCodePayment = datCocThanhToan.getOrderCodePayment();
        if (orderCodePayment != null) {
            try {
                payOS.cancelPaymentLink(orderCodePayment, "Yêu cầu hủy bởi người đặt phòng!");
                log.info("Đã gửi yêu cầu hủy link thanh toán tới PayOS cho orderCodePayment: {}", orderCodePayment);
            } catch (Exception e) {
                log.error("Lỗi khi hủy link thanh toán trên PayOS: {}", e.getMessage(), e);
                throw new RuntimeException("Lỗi khi hủy link thanh toán trên PayOS: " + e.getMessage());
            }
        } else {
            log.warn("Không tìm thấy orderCodePayment để hủy trên PayOS cho orderCodePayment: {}", orderCode);
        }

        datCocThanhToan.setTrangThai("CANCELLED");
        datCocThanhToanRepository.save(datCocThanhToan);
        log.info("Hủy thanh toán thành công cho orderCodePayment: {}", orderCode);
    }

    @Override
    public DatCocThanhToanResponse getPaymentStatus(Long orderCode) {
        log.info("Lấy trạng thái thanh toán cho orderCodePayment: {}", orderCode);
        try {
            DatCocThanhToan datCocThanhToan = datCocThanhToanRepository.findByOrderCodePayment(orderCode)
                    .orElseThrow(() -> {
                        log.error("Không tìm thấy bản ghi thanh toán với orderCodePayment: {}", orderCode);
                        return new RuntimeException("Không tìm thấy bản ghi thanh toán với orderCodePayment: " + orderCode);
                    });

            DatCocThanhToanResponse response = DatCocThanhToanResponse.builder()
                    .id(datCocThanhToan.getId())
                    .idDatPhong(datCocThanhToan.getDatPhong().getId())
                    .ngayThanhToan(datCocThanhToan.getNgayThanhToan())
                    .tienThanhToan(datCocThanhToan.getTienThanhToan())
                    .phuongThucThanhToan(datCocThanhToan.getPhuongThucThanhToan())
                    .paymentLinkId(datCocThanhToan.getPaymentLinkId())
                    .loaiThanhToan(datCocThanhToan.getLoaiThanhToan())
                    .trangThai(datCocThanhToan.getTrangThai())
                    .orderCodePayment(datCocThanhToan.getOrderCodePayment())
                    .build();

            log.info("Lấy trạng thái thanh toán thành công cho orderCodePayment: {}", orderCode);
            return response;
        } catch (Exception e) {
            log.error("Lỗi khi lấy trạng thái thanh toán: {}", e.getMessage(), e);
            throw new RuntimeException("Lỗi khi lấy trạng thái thanh toán: " + e.getMessage());
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

    private Long generateOrderCodePayment(Integer idDatPhong) {
        try {
            String combined = idDatPhong + "" + System.currentTimeMillis();
            return Long.valueOf(combined);
        } catch (NumberFormatException e) {
            log.error("Lỗi khi tạo orderCodePayment: giá trị vượt quá giới hạn Long, idDatPhong: {}", idDatPhong);
            throw new RuntimeException("Không thể tạo orderCodePayment: giá trị vượt quá giới hạn", e);
        }
    }

    private boolean isValidData(String transaction, String transactionSignature) {
        try {
            log.info("Raw transaction string: {}", transaction);
            JSONObject jsonObject = new JSONObject(transaction);

            Iterator<String> keys = jsonObject.keys();
            List<String> keyList = new ArrayList<>();
            while (keys.hasNext()) {
                keyList.add((String) keys.next());
            }
            Collections.sort(keyList);

            StringBuilder transactionStr = new StringBuilder();
            for (int i = 0; i < keyList.size(); i++) {
                String key = keyList.get(i);
                Object value = jsonObject.get(key);
                String stringValue;
                if (value == null) {
                    stringValue = "";
                } else if (value instanceof Number) {
                    stringValue = String.valueOf(value);
                } else {
                    stringValue = value.toString();
                }
                transactionStr.append(key).append("=").append(stringValue);
                if (i < keyList.size() - 1) {
                    transactionStr.append("&");
                }
            }

            log.info("Generated transaction string: {}", transactionStr.toString());
            String computedSignature = new HmacUtils("HmacSHA256", configPayOS.getChecksumKey()).hmacHex(transactionStr.toString());
            log.info("Computed signature: {}", computedSignature);
            log.info("Expected signature: {}", transactionSignature);

            boolean isValid = computedSignature.equals(transactionSignature);
            log.info("Signature validation result: {}", isValid);
            return isValid;
        } catch (Exception e) {
            log.error("Lỗi khi xác thực chữ ký: {}", e.getMessage(), e);
            return false;
        }
    }
}