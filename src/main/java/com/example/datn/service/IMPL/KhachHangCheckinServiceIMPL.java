package com.example.datn.service.IMPL;

import com.example.datn.dto.request.KhachHangCheckinRequest;
import com.example.datn.model.KhachHang;
import com.example.datn.model.KhachHangCheckin;
import com.example.datn.model.ThongTinDatPhong;
import com.example.datn.model.XepPhong;
import com.example.datn.repository.KhachHangCheckinRepository;
import com.example.datn.repository.KhachHangRepository;
import com.example.datn.repository.ThongTinDatPhongRepository;
import com.example.datn.service.KhachHangCheckinService;
import com.example.datn.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

@Service
public class KhachHangCheckinServiceIMPL implements KhachHangCheckinService {

    @Autowired
    KhachHangCheckinRepository repository;

    @Autowired
    KhachHangRepository khachHangRepository;
    @Autowired
    ThongTinDatPhongRepository thongTinDatPhongRepository;

    @Override
    public KhachHangCheckin add(KhachHangCheckinRequest request) {
        KhachHangCheckin checkin = new KhachHangCheckin();
        checkin.setKhachHang(request.getKhachHang());
        checkin.setThongTinDatPhong(request.getThongTinDatPhong());
        checkin.setTrangThai(request.getTrangThai());
        return repository.save(checkin);
    }

    @Override
    public KhachHangCheckin update(KhachHangCheckinRequest request) {
        KhachHangCheckin checkin = repository.findById(request.getId()).get();
        checkin.setKhachHang(request.getKhachHang());
        checkin.setThongTinDatPhong(request.getThongTinDatPhong());
        checkin.setTrangThai(request.getTrangThai());
        return repository.save(checkin);
    }

    @Override
    public List<KhachHangCheckin> findsByMaTTDP(String maThongTinDatPhong) {
        return repository.findsByMaTTDP(maThongTinDatPhong);
    }

    @Override
    public Boolean xoa(Integer id) {
        if (id != null) {
            repository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

    @Override
    public List<Object[]> findKhachHangCheckin(String keyword) {
        return repository.findKhachHangCheckin(keyword);
    }

    @Override
    public List<KhachHangCheckin> findByTrangThaiTTDP() {
        List<String> trangthai = Arrays.asList("Đang ở", "Đã xếp", "Đã kiểm tra phòng");
        return repository.findByTrangThaiTTDP(trangthai);
    }

    @Override
    public List<KhachHangCheckin> findByThongTinDatPhongId(int idThongTin) {
        return repository.findByThongTinDatPhong_Id(idThongTin);
    }

    @Override
    public boolean qrCheckIn(Integer idTTDP, String cmnd, String hoTen, LocalDate ngaySinh, String gioiTinh, String diaChi) {
        KhachHang khachHang = khachHangRepository.getKHbyCMND(cmnd);
        ThongTinDatPhong thongTinDatPhong = thongTinDatPhongRepository.getTTDPById(idTTDP);
        if (khachHang == null) {
            KhachHang khachHangNew = new KhachHang();
            khachHangNew.setCmnd(cmnd);
            khachHangNew.setGioiTinh(gioiTinh);
            khachHangNew.setDiaChi(diaChi);
            String[] parts = hoTen.trim().split("\\s+");
            khachHangNew.setTen(parts[parts.length - 1]);
            String ho = String.join(" ", Arrays.copyOfRange(parts, 0, parts.length - 1));
            khachHangNew.setHo(ho.isEmpty() ? "" : ho);
            khachHangNew.setTrangThai(true);
            khachHangRepository.save(khachHangNew);

            KhachHangCheckin khachHangCheckin = new KhachHangCheckin();
            khachHangCheckin.setKhachHang(khachHangNew);
            khachHangCheckin.setThongTinDatPhong(thongTinDatPhong);
            khachHangCheckin.setTrangThai(true);
            repository.save(khachHangCheckin);
            return true;

        }else{
            List<String> trangthai = Arrays.asList("Đang ở","Đã kiểm tra phòng");
            KhachHangCheckin khachHangCheckin = repository.findByCMNDandTrangThai(cmnd,trangthai);
            if(khachHangCheckin == null){
                KhachHangCheckin checkin = new KhachHangCheckin();
                checkin.setKhachHang(khachHang);
                checkin.setThongTinDatPhong(thongTinDatPhong);
                checkin.setTrangThai(true);
                 repository.save(checkin);
                return true;
            }
        }


        return false;
    }

}
