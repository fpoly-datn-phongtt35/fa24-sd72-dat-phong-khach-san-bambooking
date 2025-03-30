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

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
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
    VatTuLoaiPhongRepository vatTuLoaiPhongRepository;
    PhuThuRepository phuThuRepository;
    ThongTinDatPhongRepository thongTinDatPhongRepository;
    private final XepPhongRepository xepPhongRepository;

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
            if (traPhong.getXepPhong() == null) {
                log.error("TraPhong ID {} không có XepPhong được gán.", traPhong.getId());
                throw new EntityNotFountException("TraPhong ID " + traPhong.getId() + " không có thông tin XepPhong.");
            }

            XepPhong xepPhong = xepPhongRepository.findById(traPhong.getXepPhong().getId())
                    .orElseThrow(() -> new EntityNotFountException("Không tìm thấy XepPhong với ID: " + traPhong.getXepPhong().getId()));
            traPhong.setXepPhong(xepPhong);

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
            tongTien += tienPhong + tienPhuThu + tienDichVu;
        }

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
                .orElseThrow(()-> new EntityNotFountException("Không tìm thấy idXepPhong: " + traPhong.getXepPhong()));

        ThongTinDatPhong ttdp = thongTinDatPhongRepository.getTTDPById(xepPhong.getId());
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

        long soNgay = ChronoUnit.DAYS.between(ngayNhanPhong, ngayTraThucTe);
        // Đảm bảo ít nhất 1 ngày nếu thời gian chênh lệch nhỏ hơn 1 ngày
        soNgay = soNgay <= 0 ? 1 : soNgay;

        log.info("Số ngày sử dụng: {}", soNgay);

        double giaPhong = ttdp.getGiaDat();
        if (giaPhong <= 0) {
            log.warn("Giá phòng không hợp lệ (giaPhong = {}) cho TraPhong ID: {}", giaPhong, traPhong.getId());
            throw new IllegalArgumentException("Giá phòng phải lớn hơn 0.");
        }

        double tienPhong = giaPhong * soNgay;
        log.info("Tiền phòng cho TraPhong ID {}: {}", traPhong.getId(), tienPhong);

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
        XepPhong xepPhong = xepPhongRepository.findById(traPhong.getXepPhong().getId())
                .orElseThrow(() -> new EntityNotFountException("Không tìm thấy xếp phòng với ID: " + traPhong.getXepPhong().getId()));

        ThongTinDatPhong thongTinDatPhong = xepPhong.getThongTinDatPhong();
        if (thongTinDatPhong == null) {
            throw new IllegalStateException("XepPhong với ID " + xepPhong.getId() + " không có ThongTinDatPhong liên kết!");
        }

        LoaiPhong loaiPhong = thongTinDatPhong.getLoaiPhong();
        if (loaiPhong == null) {
            throw new IllegalStateException("ThongTinDatPhong không có LoaiPhong liên kết!");
        }

        // Lấy danh sách vật tư tiêu chuẩn của loại phòng
        List<VatTuLoaiPhong> dsVatTuTieuChuan = vatTuLoaiPhongRepository.findByLoaiPhong_Id(loaiPhong.getId());
        if (dsVatTuTieuChuan.isEmpty()) {
            log.warn("Loại phòng với ID {} không có vật tư tiêu chuẩn!", loaiPhong.getId());
        }

        // Tạo map: idVatTu -> số lượng tiêu chuẩn
        Map<Integer, Integer> soLuongVatTuTieuChuan = dsVatTuTieuChuan.stream()
                .collect(Collectors.toMap(v -> v.getVatTu().getId(), VatTuLoaiPhong::getSoLuong));

        // Lấy danh sách vật tư bị hỏng hoặc thiếu
        List<String> tinhTrangList = List.of("Hỏng", "Thiếu");
        List<KiemTraVatTu> danhSachKiemTra = kiemTraVatTuRepository
                .findByKiemTraPhong_XepPhongIdAndTinhTrangIn(xepPhong.getId(), tinhTrangList);

        log.info("Danh sách vật tư hỏng/thiếu của phòng {}: Số lượng = {}", xepPhong.getId(), danhSachKiemTra.size());

        double tienBoiThuong = 0;

        for (KiemTraVatTu kiemTra : danhSachKiemTra) {
            VatTu vatTu = kiemTra.getVatTu();
            int soLuongThucTe = kiemTra.getSoLuong();

            // Lấy số lượng tiêu chuẩn từ map
            Integer soLuongTieuChuan = soLuongVatTuTieuChuan.get(vatTu.getId());
            if (soLuongTieuChuan == null) {
                log.warn("Không tìm thấy số lượng tiêu chuẩn của vật tư {} trong loại phòng {}", vatTu.getTenVatTu(), loaiPhong.getId());
                continue; // Bỏ qua vật tư này
            }

            int soLuongBoiThuong = soLuongTieuChuan - soLuongThucTe;

            // Nếu số lượng bồi thường > 0, mới tính phí
            if (soLuongBoiThuong > 0) {
                double giaBoiThuong = vatTu.getGia();
                double thanhTien = soLuongBoiThuong * giaBoiThuong;
                tienBoiThuong += thanhTien;

                log.info("Bồi thường: {} | Tiêu chuẩn: {} | Thực tế: {} | Thiếu: {} | Đơn giá: {} | Thành tiền: {}",
                        vatTu.getTenVatTu(), soLuongTieuChuan, soLuongThucTe, soLuongBoiThuong, giaBoiThuong, thanhTien);
            }
        }

        log.info("Tổng tiền bồi thường của phòng {}: {}", xepPhong.getId(), tienBoiThuong);
        return tienBoiThuong;
    }
}
