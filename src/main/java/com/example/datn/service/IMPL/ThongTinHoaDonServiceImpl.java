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

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
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

//    @Override
//    public List<ThongTinHoaDon> createThongTinHoaDon(Integer idHD,List<TraPhong> listTraPhong) {
//        List<ThongTinHoaDon> l = new ArrayList<>();
//        HoaDon hoaDon = hoaDonRepository.findById(idHD)
//                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));
//        for(TraPhong traPhong:listTraPhong){
//            // Tính tiền phòng
//            LocalDateTime ngayNhanPhong = traPhong.getXepPhong().getNgayNhanPhong();
//            LocalDateTime ngayTraThucTe = traPhong.getNgayTraThucTe();
//            Duration duration = Duration.between(ngayNhanPhong, ngayTraThucTe);
//
//            long soNgay = duration.toDays();
//            long gioCheckIn = ngayNhanPhong.getHour();
//            double giaPhong = traPhong.getXepPhong().getThongTinDatPhong().getGiaDat();
//            double tienPhong = 0;
//
//            if(gioCheckIn<6){
//                soNgay +=1;
//                tienPhong = giaPhong* soNgay;
//            }else if(gioCheckIn>=6 && gioCheckIn<=12){
//                tienPhong = giaPhong * soNgay + (0.5 * giaPhong);
//            }else{
//                tienPhong = giaPhong * soNgay;
//            }
//            System.out.println("Số ngày ở: " + soNgay);
//            System.out.println("Giá phòng: " + giaPhong);
//            System.out.println("Tiền phòng: " + tienPhong);
//
//
//
//            // Tính tiền phụ thu
//            int soNguoiThucTe = traPhong.getXepPhong().getThongTinDatPhong().getSoNguoi();
//            int soNguoiQuyDinh = traPhong.getXepPhong().getThongTinDatPhong().getLoaiPhong().getSoKhachToiDa();
//            double donGiaPhuThu = traPhong.getXepPhong().getThongTinDatPhong().getLoaiPhong().getDonGiaPhuThu();
//            int soNguoiVuotQua = soNguoiThucTe - soNguoiQuyDinh;
//            double tienPhuThu = soNguoiVuotQua > 0 ? soNguoiVuotQua * donGiaPhuThu : 0;
//            System.out.println("Tiền phụ thu: " + tienPhuThu);
//
//            // Tính tiền dịch vụ
//            List<DichVuSuDung> dichVuSuDungList = dichVuSuDungRepository.findByXepPhongId(traPhong.getXepPhong().getId());
//            double tienDichVu = dichVuSuDungList.stream()
//                    .mapToDouble(dv -> dv.getGiaSuDung() * dv.getSoLuongSuDung())
//                    .sum();
//            System.out.println("Tiền dịch vụ: " + tienDichVu);
//
//            // Cập nhật chi tiết vào thông tin hóa đơn
//            ThongTinHoaDon thongTinHoaDon = new ThongTinHoaDon();
//            thongTinHoaDon.setHoaDon(hoaDon);
//            thongTinHoaDon.setTraPhong(traPhong);
//            thongTinHoaDon.setTienPhong(tienPhong);
//            thongTinHoaDon.setTienPhuThu(tienPhuThu);
//            thongTinHoaDon.setTienDichVu(tienDichVu);
//            thongTinHoaDonRepository.save(thongTinHoaDon);
//
//            l.add(thongTinHoaDon);
//        }
////        tongTienHoaDon();
//        return l;
//    }

    @Override
    public List<ThongTinHoaDon> createThongTinHoaDon(Integer idHD, List<TraPhong> listTraPhong) {
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

    private double tinhTienPhong(TraPhong traPhong) {
        LocalDateTime ngayNhanPhong = traPhong.getXepPhong().getNgayNhanPhong();
        LocalDateTime ngayTraThucTe = traPhong.getNgayTraThucTe();
        Duration duration = Duration.between(ngayNhanPhong, ngayTraThucTe);

        long soNgay = duration.toDays();
        long gioCheckIn = ngayNhanPhong.getHour();
        double giaPhong = traPhong.getXepPhong().getThongTinDatPhong().getGiaDat();
        double tienPhong = 0;

        if (gioCheckIn < 6) {
            soNgay += 1;
            tienPhong = giaPhong * soNgay;
        } else if (gioCheckIn >= 6 && gioCheckIn <= 12) {
            tienPhong = giaPhong * soNgay + (0.5 * giaPhong);
        } else {
            tienPhong = giaPhong * soNgay;
        }

        return tienPhong;
    }

    private double tinhTienPhuThu(TraPhong traPhong) {
        int soNguoiThucTe = traPhong.getXepPhong().getThongTinDatPhong().getSoNguoi();
        int soNguoiQuyDinh = traPhong.getXepPhong().getThongTinDatPhong().getLoaiPhong().getSoKhachToiDa();
        double donGiaPhuThu = traPhong.getXepPhong().getThongTinDatPhong().getLoaiPhong().getDonGiaPhuThu();
        int soNguoiVuotQua = soNguoiThucTe - soNguoiQuyDinh;

        return soNguoiVuotQua > 0 ? soNguoiVuotQua * donGiaPhuThu : 0;
    }

    private double tinhTienDichVu(TraPhong traPhong) {
        List<DichVuSuDung> dichVuSuDungList = dichVuSuDungRepository.findByXepPhongId(traPhong.getXepPhong().getId());
        return dichVuSuDungList.stream()
                .mapToDouble(dv -> dv.getGiaSuDung() * dv.getSoLuongSuDung())
                .sum();
    }

//    @Override
//    public void tongTienHoaDon() {
//
//        List<HoaDon> hds = hoaDonRepository.findAll();
//        for(HoaDon hd:hds){
//            double tongTien = 0.0;
//            List<ThongTinHoaDon> tthds = thongTinHoaDonRepository.findByHoaDonId(hd.getId());
//            for(ThongTinHoaDon tthd:tthds){
//                tongTien+= tthd.getTienDichVu()+tthd.getTienPhong()+tthd.getTienPhuThu();
//            }
//            hd.setTongTien(tongTien);
//            hoaDonRepository.save(hd);
//            System.out.println("Tổng tiền: " + tongTien);
//        }
//
//    }
}
