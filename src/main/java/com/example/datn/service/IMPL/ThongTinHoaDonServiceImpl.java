package com.example.datn.service.IMPL;

import com.example.datn.dto.response.DichVuSuDungResponse;
import com.example.datn.dto.response.PhuThuResponse;
import com.example.datn.dto.response.ThongTinHoaDonResponse;
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

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

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
    VatTuLoaiPhongRepository vatTuLoaiPhongRepository;
    PhuThuRepository phuThuRepository;

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

        double tongTien = hoaDon.getTongTien() != null ? hoaDon.getTongTien() : 0.0;

        for (TraPhong traPhong : listTraPhong) {
            double tienPhong = tinhTienPhong(traPhong);
            double tienPhuThu = tinhTienPhuThu(traPhong);
            double tienDichVu = tinhTienDichVu(traPhong);

            ThongTinHoaDon thongTinHoaDon = new ThongTinHoaDon();
            thongTinHoaDon.setHoaDon(hoaDon);
            thongTinHoaDon.setTraPhong(traPhong);
            thongTinHoaDon.setTienPhong(tienPhong);
            thongTinHoaDon.setTienPhuThu(tienPhuThu);
            thongTinHoaDon.setTienDichVu(tienDichVu);
            thongTinHoaDon.setTienKhauTru(0.0);

            thongTinList.add(thongTinHoaDon);

            // Tổng tiền
            tongTien += tienPhong + tienPhuThu + tienDichVu;
        }

        // Lưu danh sách thông tin hóa đơn và cập nhật tổng tiền
        thongTinHoaDonRepository.saveAll(thongTinList);
        hoaDon.setTongTien(tongTien);
        hoaDonRepository.save(hoaDon);

        System.out.println("Tổng tiền của hóa đơn ID " + idHD + " là: " + tongTien);
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

        // Lấy tổng tiền gốc từ tất cả các thông tin hóa đơn
        Double tongTienGoc = thongTinHoaDonRepository.tinhTongTienGoc(idHoaDon);
        Double tongTienKhauTru = thongTinHoaDonRepository.tinhTongTienKhauTru(idHoaDon);

        if (tienKhauTru < 0) {
            throw new IllegalArgumentException("Tiền khấu trừ không được nhỏ hơn 0.");
        }

        if (tienKhauTru > thongTinHoaDon.getTienPhong() + thongTinHoaDon.getTienPhuThu() + thongTinHoaDon.getTienDichVu()) {
            throw new IllegalArgumentException("Tiền khấu trừ không được lớn hơn tổng tiền của thông tin hóa đơn.");
        }

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


    private double tinhTienPhong(TraPhong traPhong) {
        log.info("============= Start charging room fees =============");
        LocalDateTime ngayNhanPhong = traPhong.getXepPhong().getNgayNhanPhong();
        LocalDateTime ngayTraThucTe = traPhong.getNgayTraThucTe();
        Duration duration = Duration.between(ngayNhanPhong, ngayTraThucTe);

        long soNgay = duration.toDays() <= 0 ? 1 : duration.toDays();
        log.info("SoNgay: {}", soNgay);
        double giaPhong = traPhong.getXepPhong().getThongTinDatPhong().getGiaDat();
        double tienPhong = 0;
        tienPhong = giaPhong * soNgay;

        return tienPhong;
    }

    private double tinhTienPhuThu(TraPhong traPhong) {
        log.info("============= Start charging surcharges =============");
        List<PhuThu> danhSachPhuThu = phuThuRepository.findByXepPhong_Id(traPhong.getXepPhong().getId());
        double tienPhuThu = danhSachPhuThu.stream()
                .mapToDouble(pt -> pt.getTienPhuThu() * pt.getSoLuong())
                .sum();

        double tienBoiThuong = tinhTienBoiThuong(traPhong);
        System.out.println("Tổng tiền phụ thu của phòng " + traPhong.getXepPhong().getId() + ": " + tienPhuThu);

        return tienPhuThu + tienBoiThuong;
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



    private double tinhTienBoiThuong(TraPhong traPhong) {
        log.info("============= Start calculating compensation =============");
        List<String> tinhTrangList = List.of("Hỏng", "Thiếu");

        // Lấy danh sách vật tư bị hỏng hoặc thiếu theo phòng
        List<KiemTraVatTu> danhSachKiemTra = kiemTraVatTuRepository
                .findByKiemTraPhong_XepPhongIdAndTinhTrangIn(traPhong.getXepPhong().getId(), tinhTrangList);

        System.out.println("Danh sách vật tư hỏng/thiếu của phòng " + traPhong.getXepPhong().getId() + ":");

        double tienBoiThuong = 0;

        for (KiemTraVatTu kiemTra : danhSachKiemTra) {
            VatTu vatTu = kiemTra.getVatTu();
            int soLuongThucTe = kiemTra.getSoLuong();

            // Truy vấn số lượng tiêu chuẩn của vật tư này trong loại phòng
            VatTuLoaiPhong vatTuLoaiPhong = (VatTuLoaiPhong) vatTuLoaiPhongRepository
                    .findByLoaiPhongIdAndVatTuId(traPhong.getXepPhong().getThongTinDatPhong().getLoaiPhong().getId(), vatTu.getId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy số lượng tiêu chuẩn của vật tư: " + vatTu.getTenVatTu()));

            int soLuongTieuChuan = vatTuLoaiPhong.getSoLuong();
            int soLuongBoiThuong = soLuongTieuChuan - soLuongThucTe;

            // Nếu số lượng bồi thường > 0, mới tính phí
            if (soLuongBoiThuong > 0) {
                double giaBoiThuong = vatTu.getGia();
                double thanhTien = soLuongBoiThuong * giaBoiThuong;
                tienBoiThuong += thanhTien;

                System.out.println("Bồi thường: " + vatTu.getTenVatTu() +
                        " | Tiêu chuẩn: " + soLuongTieuChuan +
                        " | Thực tế: " + soLuongThucTe +
                        " | Thiếu: " + soLuongBoiThuong +
                        " | Đơn giá: " + giaBoiThuong +
                        " | Thành tiền: " + thanhTien);
            }
        }

        System.out.println("Tổng tiền bồi thường của phòng " + traPhong.getXepPhong().getId() + ": " + tienBoiThuong);
        return tienBoiThuong;
    }
}
