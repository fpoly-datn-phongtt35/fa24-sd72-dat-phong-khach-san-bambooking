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

    @Override
    public List<ThongTinHoaDon> createThongTinHoaDon(Integer idHD,List<TraPhong> listTraPhong) {
        List<ThongTinHoaDon> l = new ArrayList<>();
        HoaDon hoaDon = hoaDonRepository.findById(idHD)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hóa đơn"));
        for(TraPhong traPhong:listTraPhong){
            // Tính tiền phòng
            LocalDateTime ngayNhanPhong = traPhong.getXepPhong().getNgayNhanPhong();
            LocalDateTime ngayTraThucTe = traPhong.getNgayTraThucTe();
            Duration duration = Duration.between(ngayNhanPhong, ngayTraThucTe);

            long soNgay = duration.toDays();
            long gioCheckIn = ngayNhanPhong.getHour();
            double giaPhong = traPhong.getXepPhong().getThongTinDatPhong().getGiaDat();
            double tienPhong = 0;

            if(gioCheckIn<6){
                soNgay +=1;
                tienPhong = giaPhong* soNgay;
            }else if(gioCheckIn>=6 && gioCheckIn<=12){
                tienPhong = giaPhong * soNgay + (0.5 * giaPhong);
            }else{
                tienPhong = giaPhong * soNgay;
            }



            // Tính tiền phụ thu
            int soNguoiThucTe = traPhong.getXepPhong().getThongTinDatPhong().getSoNguoi();
            int soNguoiQuyDinh = traPhong.getXepPhong().getThongTinDatPhong().getLoaiPhong().getSoKhachToiDa();
            double donGiaPhuThu = traPhong.getXepPhong().getThongTinDatPhong().getLoaiPhong().getDonGiaPhuThu();
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
            ThongTinHoaDon thongTinHoaDon = new ThongTinHoaDon();
            thongTinHoaDon.setHoaDon(hoaDon);
            thongTinHoaDon.setTraPhong(traPhong);
            thongTinHoaDon.setTienPhong(tienPhong);
            thongTinHoaDon.setTienPhuThu(tienPhuThu);
            thongTinHoaDon.setTienDichVu(tienDichVu);
            thongTinHoaDonRepository.save(thongTinHoaDon);

            l.add(thongTinHoaDon);
        }
        return l;
    }

    @Override
    public void tongTienHoaDon() {

        List<HoaDon> hds = hoaDonRepository.findAll();
        for(HoaDon hd:hds){
            List<ThongTinHoaDon> tthds = thongTinHoaDonRepository.findByHoaDonId(hd.getId());
            Double tongTien = 0.0;
            for(ThongTinHoaDon tthd:tthds){
                tongTien+= tthd.getTienDichVu()+tthd.getTienPhong()+tthd.getTienPhuThu();
            }
            hd.setTongTien(tongTien);
            hoaDonRepository.save(hd);
        }

//        Map<Integer, Double> tongTienMap = new HashMap<>();
//
//        for (HoaDon hoaDon : hoaDonList) {
//            List<ThongTinHoaDon> thongTinHoaDonList = thongTinHoaDonRepository.findByHoaDonId(hoaDon.getId());
//
//            if (thongTinHoaDonList != null && !thongTinHoaDonList.isEmpty()) {
//                for (ThongTinHoaDon thongTin : thongTinHoaDonList) {
//                    double tongTienThongTin =
//                            (thongTin.getTienPhong() != null ? thongTin.getTienPhong() : 0.0) +
//                                    (thongTin.getTienPhuThu() != null ? thongTin.getTienPhuThu() : 0.0) +
//                                    (thongTin.getTienDichVu() != null ? thongTin.getTienDichVu() : 0.0);
//                    tongTienMap.merge(hoaDon.getId(), tongTienThongTin, Double::sum);
//                }
//            } else {
//                tongTienMap.put(hoaDon.getId(), 0.0);
//            }
//        }
//
//        for (HoaDon hoaDon : hoaDonList) {
//            double tongTien = tongTienMap.getOrDefault(hoaDon.getId(), 0.0);
//            hoaDon.setTongTien(tongTien);
//            hoaDonRepository.save(hoaDon);
//            System.out.println("Tổng tiền của hóa đơn ID " + hoaDon.getId() + " là: " + tongTien);
//        }
    }
}
