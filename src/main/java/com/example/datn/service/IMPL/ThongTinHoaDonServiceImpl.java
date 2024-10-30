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
import java.util.List;

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
    public ThongTinHoaDonResponse createThongTinHoaDon(ThongTinHoaDonRequest request) {
        TraPhong traPhong = traPhongRepository.findById(request.getIdTraPhong())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông tin trả phòng phù hợp"));
        HoaDon hoaDon = hoaDonRepository.findById(request.getIdHoaDon())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));

        //Tính tiền phòng
        LocalDate ngayNhanPhong = LocalDate.from(traPhong.getXepPhong().getNgayNhanPhong());
        LocalDate ngayTraThucTe = traPhong.getNgayTraThucTe();
        long soNgayO = ChronoUnit.DAYS.between(ngayNhanPhong, ngayTraThucTe);
        double giaPhong = traPhong.getXepPhong().getThongTinDatPhong().getGiaDat();
        double tienPhong = soNgayO * giaPhong;
        System.out.println("Ngay nhan phong: " + ngayNhanPhong);
        System.out.println("Ngay tra phong: " + ngayTraThucTe);
        System.out.println("So ngay o: " + soNgayO);
        System.out.println("Gia phong: " + giaPhong);
        System.out.println("Tien phong: " + tienPhong);

        //Tính tiền phụ thu
        int soNguoiThucTe = traPhong.getXepPhong().getThongTinDatPhong().getSoNguoi();
        int soNguoiQuyDinh = traPhong.getXepPhong().getThongTinDatPhong().getLoaiPhong().getSoKhachToiDa();
        double donGiaPhuThu = traPhong.getXepPhong().getThongTinDatPhong().getLoaiPhong().getDonGia();
        int soNguoiVuotQua = soNguoiThucTe - soNguoiQuyDinh;
        double tienPhuThu = soNguoiVuotQua > 0 ? soNguoiVuotQua * donGiaPhuThu : 0;
        System.out.println("So nguoi o thuc te: " + soNguoiThucTe);
        System.out.println("So nguoi o theo quy dinh: " + soNguoiQuyDinh);
        System.out.println("So nguoi o vuot qua: " + soNguoiVuotQua);
        System.out.println("Tien phu thu: " + tienPhuThu);

        //Tính tiền dịch vụ
        List<DichVuSuDung> dichVuSuDungList = dichVuSuDungRepository.findByXepPhongId(traPhong.getXepPhong().getId());
        double tienDichVu = dichVuSuDungList.stream()
                .mapToDouble(dv -> dv.getGiaSuDung() * dv.getSoLuongSuDung())
                .sum();
        System.out.println("Tien dich vu: " + tienDichVu);

        //Cập nhật chi tiết vào thông tin hóa đơn
        ThongTinHoaDon thongTinHoaDon = thongTinHoaDonMapper.toThongTinHoaDon(request, traPhong, hoaDon);
        thongTinHoaDon.setTienPhong(tienPhong);
        thongTinHoaDon.setTienPhuThu(tienPhuThu);
        thongTinHoaDon.setTienDichVu(tienDichVu);

        //Lưu tổng tiền vào hóa đơn
        tinhTongTien(hoaDon, tienPhong, tienDichVu, tienPhuThu);

        return thongTinHoaDonMapper.toThongTinHoaDonResponse(thongTinHoaDonRepository.save(thongTinHoaDon));
    }

    private void tinhTongTien(HoaDon hoaDon, double tienPhong, double tienDichVu, double tienPhuThu){
        double tongTien = tienPhong + tienDichVu + tienPhuThu;
        hoaDon.setTongTien(tongTien);
        System.out.println("Tong tien: " + tongTien);
        hoaDonRepository.save(hoaDon);
    }
}
