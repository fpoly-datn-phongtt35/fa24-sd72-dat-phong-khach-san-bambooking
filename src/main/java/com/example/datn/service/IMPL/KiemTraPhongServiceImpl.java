package com.example.datn.service.IMPL;

import com.example.datn.dto.request.KiemTraPhongRequest;
import com.example.datn.dto.request.KiemTraVatTuRequest;
import com.example.datn.dto.response.*;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.model.*;
import com.example.datn.repository.KiemTraPhongRepository;
import com.example.datn.repository.KiemTraVatTuRepository;
import com.example.datn.repository.NhanVienRepository;
import com.example.datn.repository.VatTuLoaiPhongRepository;
import com.example.datn.repository.XepPhongRepository;
import com.example.datn.repository.VatTuRepository;
import com.example.datn.service.KiemTraPhongService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j(topic = "KIEM_TRA_PHONG_SERVICE")
@Transactional
public class KiemTraPhongServiceImpl implements KiemTraPhongService {

    private final KiemTraPhongRepository kiemTraPhongRepository;
    private final XepPhongRepository xepPhongRepository;
    private final NhanVienRepository nhanVienRepository;
    private final VatTuLoaiPhongRepository vatTuLoaiPhongRepository;
    private final VatTuRepository vatTuRepository;
    private final KiemTraVatTuRepository kiemTraVatTuRepository;

    @Override
    public KiemTraPhongResponse performRoomCheck(KiemTraPhongRequest request) {
        log.info("Bắt đầu kiểm tra phòng với ID Xếp Phòng = {}, ID Nhân Viên = {}",
                request.getIdXepPhong(), request.getIdNhanVien());

        // Lấy xếp phòng và nhân viên
        XepPhong xepPhong = xepPhongRepository.findById(request.getIdXepPhong())
                .orElseThrow(() -> new EntityNotFountException("Không tìm thấy xếp phòng với ID: " + request.getIdXepPhong()));
        NhanVien nhanVien = nhanVienRepository.findById(request.getIdNhanVien())
                .orElseThrow(() -> new EntityNotFountException("Không tìm thấy nhân viên với ID: " + request.getIdNhanVien()));

        // Tạo bản ghi kiểm tra phòng mới
        KiemTraPhong kiemTraPhong = new KiemTraPhong();
        kiemTraPhong.setXepPhong(xepPhong);
        kiemTraPhong.setNhanVien(nhanVien);
        kiemTraPhong.setThoiGianKiemTra(LocalDateTime.now());

        // Giả sử ban đầu các vật tư đều đạt tiêu chuẩn
        boolean isSufficient = true;

        Integer idLoaiPhong = xepPhong.getThongTinDatPhong().getLoaiPhong().getId();
        log.info("ID Loại Phòng: {}", idLoaiPhong);

        // Lấy danh sách vật tư tiêu chuẩn của loại phòng
        List<VatTuLoaiPhong> dsVatTuTieuChuan = vatTuLoaiPhongRepository.findByLoaiPhong_Id(idLoaiPhong);
        log.info("Danh sách vật tư của loại phòng {}: {}",
                idLoaiPhong,
                dsVatTuTieuChuan.stream()
                        .map(vt -> String.format("ID: %d, Tên: %s, Số lượng: %d",
                                vt.getVatTu().getId(), vt.getVatTu().getTenVatTu(), vt.getSoLuong()))
                        .collect(Collectors.joining(" | ")));

        // Tạo map: idVatTu -> số lượng tiêu chuẩn
        Map<Integer, Integer> soLuongVatTuTieuChuan = dsVatTuTieuChuan.stream()
                .collect(Collectors.toMap(v -> v.getVatTu().getId(), VatTuLoaiPhong::getSoLuong));

        List<KiemTraVatTuResponse> danhSachKiemTraVatTuResponses = new ArrayList<>();
        if (request.getDanhSachVatTu() != null) {
            for (KiemTraVatTuRequest ktvtr : request.getDanhSachVatTu()) {
                // Kiểm tra xem có cấu hình số lượng tiêu chuẩn cho vật tư đó hay không
                Integer soLuongTieuChuan = soLuongVatTuTieuChuan.get(ktvtr.getIdVatTu());
                String tinhTrang;
                if (soLuongTieuChuan == null) {
                    // Nếu không có cấu hình, mặc định số lượng tiêu chuẩn = 0 và đánh dấu tình trạng là "Thiếu"
                    soLuongTieuChuan = 0;
                    tinhTrang = "Thiếu";
                    isSufficient = false;
                } else {
                    int soLuongThieu = soLuongTieuChuan - ktvtr.getSoLuongThucTe();
                    if (soLuongThieu > 0) {
                        tinhTrang = "Thiếu";
                        isSufficient = false;
                    } else {
                        tinhTrang = "Đủ";
                    }
                }

                VatTu vatTu = vatTuRepository.findById(ktvtr.getIdVatTu())
                        .orElseThrow(() -> new EntityNotFountException("Không tìm thấy vật tư với ID: " + ktvtr.getIdVatTu()));

                // Tạo và lưu chi tiết kiểm tra vật tư
                KiemTraVatTu kiemTraVatTu = new KiemTraVatTu();
                kiemTraVatTu.setKiemTraPhong(kiemTraPhong);
                kiemTraVatTu.setVatTu(vatTu);
                kiemTraVatTu.setSoLuong(ktvtr.getSoLuongThucTe());
                kiemTraVatTu.setTinhTrang(tinhTrang);
                kiemTraVatTu.setGhiChu(ktvtr.getGhiChu());
                kiemTraVatTuRepository.save(kiemTraVatTu);

                // Build response cho từng vật tư kiểm tra
                KiemTraVatTuResponse vtResponse = KiemTraVatTuResponse.builder()
                        .idVatTu(vatTu.getId())
                        .tenVatTu(vatTu.getTenVatTu())
                        .soLuongThucTe(ktvtr.getSoLuongThucTe())
                        .tinhTrang(tinhTrang)
                        .donGia(vatTu.getGia())
                        .ghiChu(ktvtr.getGhiChu())
                        .build();
                danhSachKiemTraVatTuResponses.add(vtResponse);
            }
        }

        // Tổng hợp kết quả từ danh sách vật tư
        String tinhTrangVatTu = isSufficient ? "Đủ" : "Thiếu";

        // Cập nhật các cột trong bản ghi kiểm tra phòng:
        // - "tinhTrang" lưu kết quả tổng hợp của vật tư (Đủ/Thiếu)
        // - "trangThai" lưu trạng thái của quá trình kiểm tra (Đã kiểm tra)
        kiemTraPhong.setTinhTrang(tinhTrangVatTu);
        kiemTraPhong.setTrangThai("Đã kiểm tra");
        KiemTraPhong saveKTP = kiemTraPhongRepository.save(kiemTraPhong);

        // Build trả về response tổng kết
        return KiemTraPhongResponse.builder()
                .id(saveKTP.getId())
                .idXepPhong(xepPhong.getId())
                .maThongTinDatPhong(xepPhong.getThongTinDatPhong().getMaThongTinDatPhong())
                .nhanVienKiemTraPhong(nhanVien.getHo() + " " + nhanVien.getTen())
                .thoiGianKiemTra(saveKTP.getThoiGianKiemTra())
                .tinhTrangVatTu(saveKTP.getTinhTrang())
                .trangThai(saveKTP.getTrangThai())
                .danhSachVatTu(danhSachKiemTraVatTuResponses)
                .build();
    }

    @Override
    public List<XepPhongResponse> timKiemXepPhong(String key) {
        List<XepPhong> danhSachPhong = kiemTraPhongRepository.findByKeyNotChecked(key);

        return danhSachPhong.stream()
                .map(xp -> new XepPhongResponse(
                        xp.getId(),
                        xp.getThongTinDatPhong().getDatPhong().getFullNameKhachHang(),
                        xp.getThongTinDatPhong().getDatPhong().getMaDatPhong(),
                        xp.getThongTinDatPhong().getMaThongTinDatPhong(),
                        xp.getNgayNhanPhong(),
                        xp.getNgayTraPhong(),
                        xp.getPhong().getLoaiPhong().getTenLoaiPhong(),
                        xp.getPhong().getTenPhong()
                )).collect(Collectors.toList());
    }

    @Override
    public List<NhanVienResponse> findAllNhanVien() {
        List<NhanVien> danhSachNhanVien = nhanVienRepository.findAll();
        return danhSachNhanVien.stream()
                .map(nv -> new NhanVienResponse(
                        nv.getId(),
                        nv.getHoTen(),
                        nv.getSdt(),
                        nv.getEmail()
                )).toList();
    }

    @Override
    public List<VatTuResponseByNVT> getVatTuByXepPhong(Integer idXepPhong) {
        XepPhong xepPhong = xepPhongRepository.findById(idXepPhong)
                .orElseThrow(() -> new EntityNotFountException("Không tìm thấy xếp phòng với ID: " + idXepPhong));
        Integer idLoaiPhong = xepPhong.getPhong().getLoaiPhong().getId();
        List<VatTuLoaiPhong> danhSachVatTu = vatTuLoaiPhongRepository.findByLoaiPhong_Id(idLoaiPhong);

        return danhSachVatTu.stream()
                .map(vtlp -> VatTuResponseByNVT.builder()
                        .id(vtlp.getVatTu().getId())
                        .tenVatTu(vtlp.getVatTu().getTenVatTu())
                        .donGia(vtlp.getVatTu().getGia())
                        .soLuongTieuChuan(vtlp.getSoLuong())
                        .build())
                .collect(Collectors.toList());
    }
}
