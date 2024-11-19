package com.example.datn.service.IMPL;

import com.example.datn.dto.request.ThongTinHoaDonRequest;
import com.example.datn.dto.response.ThongTinHoaDonResponse;
import com.example.datn.mapper.ThongTinHoaDonMapper;
import com.example.datn.model.DichVuSuDung;
import com.example.datn.model.HoaDon;
import com.example.datn.model.ThongTinHoaDon;
import com.example.datn.model.TraPhong;
import com.example.datn.repository.DichVuSuDungRepository;
import com.example.datn.repository.HoaDonRepository;
import com.example.datn.repository.ThongTinHoaDonRepository;
import com.example.datn.repository.TraPhongRepository;
import com.example.datn.service.ThongTinHoaDonService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ThongTinHoaDonServiceImpl implements ThongTinHoaDonService {
    ThongTinHoaDonRepository thongTinHoaDonRepository;
    TraPhongRepository traPhongRepository;
    HoaDonRepository hoaDonRepository;
    DichVuSuDungRepository dichVuSuDungRepository;
    ThongTinHoaDonMapper thongTinHoaDonMapper;

    @Override
    public Page<ThongTinHoaDonResponse> getAllThongTinHoaDon(Pageable pageable) {
        return thongTinHoaDonRepository.findAll(pageable)
                .map(thongTinHoaDonMapper::toThongTinHoaDonResponse);
    }

    @Override
    public List<ThongTinHoaDonResponse> getThongTinHoaDonByHoaDonId(Integer idHoaDon) {
        List<ThongTinHoaDon> list = thongTinHoaDonRepository.findByHoaDonId(idHoaDon);
        return list.stream().map(thongTinHoaDonMapper::toThongTinHoaDonResponse)
                .toList();
    }

    @Override
    public ThongTinHoaDonResponse createThongTinHoaDon(ThongTinHoaDonRequest request) {
        TraPhong traPhong = traPhongRepository.findById(request.getIdTraPhong())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin trả phòng phù hợp"));
        HoaDon hoaDon = hoaDonRepository.findById(request.getIdHoaDon())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));

        // Tính tiền phòng
        LocalDate ngayNhanPhong = LocalDate.from(traPhong.getXepPhong().getNgayNhanPhong());
        LocalDate ngayTraThucTe = traPhong.getNgayTraThucTe();
        long soNgayO = ChronoUnit.DAYS.between(ngayNhanPhong, ngayTraThucTe);
        double giaPhong = traPhong.getXepPhong().getThongTinDatPhong().getGiaDat();
        double tienPhong = soNgayO > 0 ? soNgayO * giaPhong : giaPhong;
        System.out.println("Tiền phòng: " + tienPhong);

        // Tính tiền phụ thu
        int soNguoiThucTe = traPhong.getXepPhong().getThongTinDatPhong().getSoNguoi();
        int soNguoiQuyDinh = traPhong.getXepPhong().getThongTinDatPhong().getLoaiPhong().getSoKhachToiDa();
        double donGiaPhuThu = traPhong.getXepPhong().getThongTinDatPhong().getLoaiPhong().getDonGia();
        int soNguoiVuotQua = soNguoiThucTe - soNguoiQuyDinh;
        double tienPhuThu = soNguoiVuotQua > 0 ? soNguoiVuotQua * donGiaPhuThu : 0;
        System.out.println("Tiền phụ thu: " + tienPhuThu);

        // Tính tiền dịch vụ
        List<DichVuSuDung> dichVuSuDungList = dichVuSuDungRepository.findByXepPhongId(traPhong.getXepPhong().getId());
        double tienDichVu = dichVuSuDungList.stream()
                .mapToDouble(dv -> dv.getGiaSuDung() * dv.getSoLuongSuDung())
                .sum();
        System.out.println("Tiền dịch vụ: " + tienDichVu);

        // Cập nhật chi tiết vào thông tin hóa đơn
        ThongTinHoaDon thongTinHoaDon = thongTinHoaDonMapper.toThongTinHoaDon(request, traPhong, hoaDon);
        thongTinHoaDon.setTienPhong(tienPhong);
        thongTinHoaDon.setTienPhuThu(tienPhuThu);
        thongTinHoaDon.setTienDichVu(tienDichVu);

        thongTinHoaDon = thongTinHoaDonRepository.save(thongTinHoaDon);

        tongTienHoaDon(List.of(hoaDon));

        return thongTinHoaDonMapper.toThongTinHoaDonResponse(thongTinHoaDon);
    }

    private void tongTienHoaDon(List<HoaDon> hoaDonList) {
        Map<Integer, Double> tongTienMap = new HashMap<>();

        for (HoaDon hoaDon : hoaDonList) {
            List<ThongTinHoaDon> thongTinHoaDonList = thongTinHoaDonRepository.findByHoaDonId(hoaDon.getId());

            if (thongTinHoaDonList != null && !thongTinHoaDonList.isEmpty()) {
                for (ThongTinHoaDon thongTin : thongTinHoaDonList) {
                    double tongTienThongTin =
                            (thongTin.getTienPhong() != null ? thongTin.getTienPhong() : 0.0) +
                                    (thongTin.getTienPhuThu() != null ? thongTin.getTienPhuThu() : 0.0) +
                                    (thongTin.getTienDichVu() != null ? thongTin.getTienDichVu() : 0.0);
                    tongTienMap.merge(hoaDon.getId(), tongTienThongTin, Double::sum);
                }
            } else {
                tongTienMap.put(hoaDon.getId(), 0.0);
            }
        }

        for (HoaDon hoaDon : hoaDonList) {
            double tongTien = tongTienMap.getOrDefault(hoaDon.getId(), 0.0);
            hoaDon.setTongTien(tongTien);
            hoaDonRepository.save(hoaDon);
            System.out.println("Tổng tiền của hóa đơn ID " + hoaDon.getId() + " là: " + tongTien);
        }
    }
}
