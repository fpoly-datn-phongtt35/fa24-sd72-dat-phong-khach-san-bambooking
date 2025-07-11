package com.example.datn.service.IMPL;

import com.example.datn.dto.response.*;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.mapper.ThongTinHoaDonMapper;
import com.example.datn.model.*;
import com.example.datn.repository.*;
import com.example.datn.service.ThongTinHoaDonService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class ThongTinHoaDonServiceImpl implements ThongTinHoaDonService {
    ThongTinHoaDonRepository thongTinHoaDonRepository;
    HoaDonRepository hoaDonRepository;
    DichVuSuDungRepository dichVuSuDungRepository;
    ThongTinHoaDonMapper thongTinHoaDonMapper;
    KiemTraVatTuRepository kiemTraVatTuRepository;
    PhuThuRepository phuThuRepository;
    ThongTinDatPhongRepository thongTinDatPhongRepository;
    XepPhongRepository xepPhongRepository;
    DatCocThanhToanRepository datCocThanhToanRepository;

    @Override
    public Page<ThongTinHoaDonResponse> getAllThongTinHoaDon(Pageable pageable) {
        log.info("============ Generate all thongTinHoaDon ============");
        return thongTinHoaDonRepository.findAll(pageable)
                .map(thongTinHoaDonMapper::toThongTinHoaDonResponse);
    }

    @Override
    public List<ThongTinHoaDonResponse> getThongTinHoaDonByHoaDonId(Integer idHoaDon) {
        log.info("============ Get a thongTinHoaDon ============");
        List<ThongTinHoaDon> list = thongTinHoaDonRepository.findByHoaDonId(idHoaDon);
        return list.stream().map(thongTinHoaDonMapper::toThongTinHoaDonResponse)
                .toList();
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public List<ThongTinHoaDon> createThongTinHoaDon(Integer idHD, List<TraPhong> listTraPhong) {
        log.info("============ Create invoice ============");
        List<ThongTinHoaDon> thongTinList = new ArrayList<>();
        HoaDon hoaDon = hoaDonRepository.findById(idHD)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));

        DatPhong datPhong = hoaDon.getDatPhong();
        if (datPhong == null) {
            log.error("Hóa đơn ID {} không liên kết với DatPhong.", idHD);
            throw new EntityNotFountException("Hóa đơn không liên kết với đặt phòng!");
        }

        double tongTienHoaDon = 0.0;

        for (TraPhong traPhong : listTraPhong) {
            if (traPhong.getXepPhong() == null) {
                log.error("TraPhong ID {} không có XepPhong được gán.", traPhong.getId());
                throw new EntityNotFountException("TraPhong ID " + traPhong.getId() + " không có thông tin XepPhong.");
            }

            XepPhong xepPhong = xepPhongRepository.findById(traPhong.getXepPhong().getId())
                    .orElseThrow(() -> new EntityNotFountException("Không tìm thấy XepPhong với ID: " + traPhong.getXepPhong().getId()));
            traPhong.setXepPhong(xepPhong);

            // Tính tiền phòng, phụ thu, và dịch vụ
            double tienPhong = tinhTienPhong(traPhong);
            double tienPhuThu = tinhTienPhuThu(traPhong);
            double tienDichVu = tinhTienDichVu(traPhong);

            // Lấy thông tin đặt phòng liên quan
            ThongTinDatPhong ttdp = thongTinDatPhongRepository.findById(xepPhong.getThongTinDatPhong().getId())
                    .orElseThrow(() -> {
                        log.error("Không tìm thấy ThongTinDatPhong cho XepPhong ID {}.", xepPhong.getId());
                        return new EntityNotFountException("ThongTinDatPhong không tồn tại cho XepPhong ID " + xepPhong.getId());
                    });

            // Lấy tiền đã thanh toán và trạng thái từ ThongTinDatPhong
            double tienDaThanhToan = ttdp.getTienDaThanhToan() != null ? ttdp.getTienDaThanhToan() : 0.0;
            String trangThaiThanhToan = ttdp.getTrangThaiThanhToan();
            double tienConLai;

            // Xử lý logic thanh toán
            if ("Đã đặt cọc".equals(trangThaiThanhToan) || "Đã thanh toán trước".equals(trangThaiThanhToan)) {
                tienConLai = tienPhong - tienDaThanhToan;
                log.info("Phòng (XepPhong ID: {}) có trạng thái '{}', tiền đã thanh toán: {}, tiền còn lại: {}",
                        xepPhong.getId(), trangThaiThanhToan, tienDaThanhToan, tienConLai);
            } else {
                // Trường hợp chưa thanh toán
                tienConLai = tienPhong;
                log.info("Phòng (XepPhong ID: {}) chưa thanh toán, tiền cần thanh toán: {}", xepPhong.getId(), tienConLai);
            }

            if (tienConLai < 0) {
                log.warn("Tiền còn lại âm cho TraPhong ID {}, đặt thành 0.", traPhong.getId());
                tienConLai = 0.0;
            }

            // Tạo ThongTinHoaDon
            ThongTinHoaDon thongTinHoaDon = new ThongTinHoaDon();
            thongTinHoaDon.setHoaDon(hoaDon);
            thongTinHoaDon.setTraPhong(traPhong);
            thongTinHoaDon.setTienPhong(tienConLai);
            thongTinHoaDon.setTienPhuThu(tienPhuThu);
            thongTinHoaDon.setTienDichVu(tienDichVu);
            thongTinHoaDon.setTienKhauTru(0.0);

            thongTinList.add(thongTinHoaDon);
            tongTienHoaDon += tienConLai;
        }

        if (tongTienHoaDon < 0) {
            log.warn("Tổng tiền hóa đơn ID {} âm ({}) sau khi tính toán.", idHD, tongTienHoaDon);
            tongTienHoaDon = 0.0;
        }

        hoaDon.setTongTien(tongTienHoaDon);
        hoaDonRepository.save(hoaDon);

        thongTinHoaDonRepository.saveAll(thongTinList);
        log.info("Tổng tiền của hóa đơn ID {} là: {}", idHD, tongTienHoaDon);
        return thongTinList;
    }

    @Override
    public List<DichVuSuDungResponse> getDichVuSuDung(Integer idHoaDon) {
        return hoaDonRepository.findDichVuSuDungByIdHoaDon(idHoaDon);
    }

    @Transactional(rollbackFor = Exception.class)
    @Override
    public void capNhatTienKhauTru(Integer idHoaDon, Integer idThongTinHoaDon, Double tienKhauTru) {
        log.info("===== Bắt đầu cập nhật tiền khấu trừ =====");
        HoaDon hoaDon = hoaDonRepository.findById(idHoaDon)
                .orElseThrow(() -> new EntityNotFountException("Không tìm thấy hóa đơn với ID: " + idHoaDon));

        ThongTinHoaDon thongTinHoaDon = thongTinHoaDonRepository.findById(idThongTinHoaDon)
                .orElseThrow(() -> new EntityNotFountException("Không tìm thấy thông tin hóa đơn với ID: " + idThongTinHoaDon));

        if (tienKhauTru < 0) {
            throw new IllegalArgumentException("Tiền khấu trừ không được nhỏ hơn 0.");
        }

        if (tienKhauTru > thongTinHoaDon.getTienPhong() + thongTinHoaDon.getTienPhuThu() + thongTinHoaDon.getTienDichVu()) {
            throw new IllegalArgumentException("Tiền khấu trừ không được lớn hơn tổng tiền của thông tin hóa đơn.");
        }

        // Lấy tổng tiền gốc từ tất cả các thông tin hóa đơn
        Double tongTienGoc = thongTinHoaDonRepository.tinhTongTienGoc(idHoaDon);
        log.info("Tong tien goc : {}", tongTienGoc);
        Double tongTienKhauTru = thongTinHoaDonRepository.tinhTongTienKhauTru(idHoaDon);
        log.info("Tong tien khau tru : {}", tongTienKhauTru);

        // Cập nhật tiền khấu trừ
        thongTinHoaDon.setTienKhauTru(tienKhauTru);
        thongTinHoaDonRepository.save(thongTinHoaDon);

        // Cập nhật tổng tiền của hóa đơn
        hoaDon.setTongTien(tongTienGoc - tongTienKhauTru);
        hoaDonRepository.save(hoaDon);

        log.info("Cập nhật thành công. Tổng tiền mới của hóa đơn ID {}: {}", idHoaDon, hoaDon.getTongTien());
    }

    @Override
    public List<PhuThuResponse> getPhuThu(Integer idHoaDon) {
        return hoaDonRepository.findPhuThuByIdHoaDon(idHoaDon);
    }

    @Override
    public List<KiemTraVatTuResponseList> getListVatTuHongOrThieuByHoaDon(Integer idHoaDon) {

        if (idHoaDon == null) {
            throw new IllegalArgumentException("idHoaDon is null");
        }

        List<String> tinhTrang = List.of("Thiếu", "Hỏng");

        List<Object[]> result = kiemTraVatTuRepository.findByIdHoaDonAndTinhTrangIn(idHoaDon, tinhTrang);

        return result.stream()
                .map(row -> new KiemTraVatTuResponseList(
                        (String) row[0], // ten_phong
                        (String) row[1], // ten_vat_tu
                        ((Number) row[2]).doubleValue(), // gia
                        ((Number) row[3]).intValue(), // so_luong_thieu
                        row[4] != null ? ((Number) row[4]).doubleValue() : null // tien_khau_tru
                ))
                .collect(Collectors.toList());
    }

    private double tinhTienPhong(TraPhong traPhong) {
        log.info("============= Start charging room fees =============");

        // Kiểm tra null cho TraPhong và các trường liên quan
        if (traPhong == null || traPhong.getXepPhong() == null) {
            log.error("TraPhong hoặc XepPhong là null.");
            throw new IllegalArgumentException("TraPhong hoặc XepPhong không được null.");
        }

        XepPhong xepPhong = xepPhongRepository.findById(traPhong.getXepPhong().getId())
                .orElseThrow(() -> new EntityNotFountException("Không tìm thấy idXepPhong: " + traPhong.getXepPhong()));

        ThongTinDatPhong ttdp = xepPhong.getThongTinDatPhong();
        if (ttdp == null) {
            log.error("ThongTinDatPhong là null cho XepPhong ID: {}", xepPhong.getId());
            throw new IllegalArgumentException("ThongTinDatPhong không được null.");
        }

        LocalDateTime ngayNhanPhong = xepPhong.getNgayNhanPhong();
        LocalDateTime ngayTraThucTe = traPhong.getNgayTraThucTe();

        if (ngayNhanPhong == null || ngayTraThucTe == null) {
            log.error("Ngày nhận phòng hoặc ngày trả thực tế là null cho TraPhong ID: {}", traPhong.getId());
            throw new IllegalArgumentException("Ngày nhận phòng và ngày trả thực tế không được null.");
        }

        LocalDate ngayNhan = ngayNhanPhong.toLocalDate();
        LocalDate ngayTra = ngayTraThucTe.toLocalDate();

        long soDemO = ChronoUnit.DAYS.between(ngayNhan, ngayTra);
        // Đảm bảo ít nhất 1 ngày nếu thời gian chênh lệch nhỏ hơn 1 ngày
        soDemO = soDemO <= 0 ? 1 : soDemO;

        log.info("Số ngày sử dụng: {}", soDemO);

        double giaPhong = ttdp.getGiaDat();
        if (giaPhong <= 0) {
            log.warn("Giá phòng không hợp lệ (giaPhong = {}) cho TraPhong ID: {}", giaPhong, traPhong.getId());
            throw new IllegalArgumentException("Giá phòng phải lớn hơn 0.");
        }

        double tienPhong = giaPhong * soDemO;
        log.info("Tiền phòng cho TraPhong ID {}: {}", traPhong.getId(), tienPhong);

        return tienPhong;
    }


    private double tinhTienPhuThu(TraPhong traPhong) {
        log.info("============= Start charging surcharges =============");
        List<PhuThu> danhSachPhuThu = phuThuRepository.findByXepPhong_Id(traPhong.getXepPhong().getId());

        double tienPhuThu = danhSachPhuThu.stream()
                .mapToDouble(pt -> pt.getTienPhuThu() * pt.getSoLuong())
                .sum();
        log.info("id xep phong{}", traPhong.getXepPhong().getId());
        log.info("Tổng tiền phụ thu của phòng {}: {}", traPhong.getXepPhong().getId(), tienPhuThu);

        return tienPhuThu ;
    }

    private double tinhTienDichVu(TraPhong traPhong) {
        log.info("============= Start charging for services =============");

        // Lấy danh sách dịch vụ sử dụng (bao gồm cả dịch vụ miễn phí)
        List<DichVuSuDung> dichVuSuDungList = dichVuSuDungRepository.findByXepPhongId(traPhong.getXepPhong().getId());

        // Tính tổng tiền dịch vụ, xử lý trường hợp null
        double tongTienDichVu = dichVuSuDungList.stream()
                .mapToDouble(dv -> {
                    double giaSuDung = (dv.getGiaSuDung() != null) ? dv.getGiaSuDung() : 0.0;
                    int soLuongSuDung = (dv.getSoLuongSuDung() != null) ? dv.getSoLuongSuDung() : 0;
                    return giaSuDung * soLuongSuDung;
                })
                .sum();

        // Lọc danh sách dịch vụ miễn phí (giá = 0 hoặc null)
        List<DichVuSuDung> dichVuMienPhi = dichVuSuDungList.stream()
                .filter(dv -> (dv.getGiaSuDung() == null || dv.getGiaSuDung() == 0))
                .toList();

        log.info("Danh sách dịch vụ miễn phí đã sử dụng: {}", dichVuMienPhi);
        log.info("Tổng tiền dịch vụ có phí: {}", tongTienDichVu);

        return tongTienDichVu;
    }
}
