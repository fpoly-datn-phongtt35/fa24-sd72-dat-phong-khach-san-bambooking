package com.example.datn.service.IMPL;

import com.example.datn.dto.request.KiemTraPhongRequest;
import com.example.datn.dto.request.KiemTraVatTuRequest;
import com.example.datn.dto.response.*;
import com.example.datn.exception.EntityNotFountException;
import com.example.datn.model.*;
import com.example.datn.repository.*;
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
    private final PhongRepository phongRepository;
    private final ThongTinDatPhongRepository thongTinDatPhongRepository;

    @Transactional(rollbackFor = Exception.class)
    @Override
    public KiemTraPhongResponse performRoomCheck(KiemTraPhongRequest request) {
        log.info("Bắt đầu kiểm tra phòng với ID Xếp Phòng = {}, ID Nhân Viên = {}",
                request.getIdXepPhong(), request.getIdNhanVien());

        XepPhong xepPhong = xepPhongRepository.findById(request.getIdXepPhong())
                .orElseThrow(() -> new EntityNotFountException("Không tìm thấy xếp phòng với ID: " + request.getIdXepPhong()));
        NhanVien nhanVien = nhanVienRepository.findById(request.getIdNhanVien())
                .orElseThrow(() -> new EntityNotFountException("Không tìm thấy nhân viên với ID: " + request.getIdNhanVien()));

        // Kiểm tra xem có tồn tại lần kiểm tra phòng nào chưa
        KiemTraPhong kiemTraPhong = kiemTraPhongRepository.findByXepPhong(xepPhong)
                .orElseGet(() -> {
                    KiemTraPhong newKiemTraPhong = new KiemTraPhong();
                    newKiemTraPhong.setXepPhong(xepPhong);
                    newKiemTraPhong.setNhanVien(nhanVien);
                    newKiemTraPhong.setThoiGianKiemTra(LocalDateTime.now());
                    return newKiemTraPhong;
                });

        // Nếu là bản ghi cũ, cập nhật thông tin
        kiemTraPhong.setNhanVien(nhanVien);
        kiemTraPhong.setThoiGianKiemTra(LocalDateTime.now());

        // Giả sử ban đầu các vật tư đều đạt tiêu chuẩn
        boolean isSufficient = true;

        //Check ThongTinDatPhong
        ThongTinDatPhong thongTinDatPhong = xepPhong.getThongTinDatPhong();
        if (thongTinDatPhong == null) {
            throw new IllegalArgumentException("XepPhong với ID " + request.getIdXepPhong() + "không có ThongTinDatPhong liên kết!");
        }

        Integer idLoaiPhong = thongTinDatPhong.getLoaiPhong().getId();
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

        // Lưu KiemTraPhong trước để đảm bảo nó không phải là transient instance
        kiemTraPhong.setTinhTrang(isSufficient ? "Đủ" : "Thiếu");
        kiemTraPhong.setTrangThai("Đã kiểm tra");
        KiemTraPhong savedKiemTraPhong = kiemTraPhongRepository.save(kiemTraPhong);

        List<KiemTraVatTuResponse> danhSachKiemTraVatTuResponses = new ArrayList<>();
        if (request.getDanhSachVatTu() != null) {
            // Lấy danh sách KiemTraVatTu hiện có của KiemTraPhong này
            List<KiemTraVatTu> existingKiemTraVatTuList = kiemTraVatTuRepository.findByKiemTraPhong(savedKiemTraPhong);

            // Tạo map để tra cứu nhanh KiemTraVatTu theo idVatTu
            Map<Integer, KiemTraVatTu> existingKiemTraVatTuMap = existingKiemTraVatTuList.stream()
                    .collect(Collectors.toMap(ktvt -> ktvt.getVatTu().getId(), ktvt -> ktvt));

            for (KiemTraVatTuRequest ktvtr : request.getDanhSachVatTu()) {
                if (ktvtr.getSoLuongThucTe() < 0) {
                    throw new IllegalArgumentException("Số lượng nhập phải lớn hơn 0: " + ktvtr.getSoLuongThucTe());
                }

                Integer soLuongTieuChuan = soLuongVatTuTieuChuan.get(ktvtr.getIdVatTu());
                String tinhTrang;

                VatTu vatTu = vatTuRepository.findById(ktvtr.getIdVatTu())
                        .orElseThrow(() -> new EntityNotFountException("Không tìm thấy vật tư với ID: " + ktvtr.getIdVatTu()));

                if (soLuongTieuChuan == null) {
                    soLuongTieuChuan = 0;
                    tinhTrang = "Thiếu";
                    isSufficient = false;
                } else {

                    if (ktvtr.getSoLuongThucTe() > soLuongTieuChuan) {
                        throw new IllegalArgumentException(
                                String.format("Số lượng thực tế (%d) không được lớn hơn số lượng tiêu chuẩn (%d) cho vật tư %s.",
                                        ktvtr.getSoLuongThucTe(), soLuongTieuChuan, vatTu.getTenVatTu())
                        );
                    }

                    int soLuongThieu = soLuongTieuChuan - ktvtr.getSoLuongThucTe();
                    if (soLuongThieu > 0) {
                        tinhTrang = "Thiếu";
                        isSufficient = false;
                    } else {
                        tinhTrang = "Đủ";
                    }
                }

                KiemTraVatTu kiemTraVatTu = existingKiemTraVatTuMap.getOrDefault(ktvtr.getIdVatTu(), new KiemTraVatTu());
                kiemTraVatTu.setKiemTraPhong(savedKiemTraPhong);
                kiemTraVatTu.setVatTu(vatTu);
                kiemTraVatTu.setSoLuong(ktvtr.getSoLuongThucTe());
                kiemTraVatTu.setTinhTrang(tinhTrang);
                kiemTraVatTu.setGhiChu(ktvtr.getGhiChu());
                kiemTraVatTuRepository.save(kiemTraVatTu);

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

        // Tổng hợp kết quả từ danh sách vật tư và cập nhật lại KiemTraPhong nếu cần
        String tinhTrangVatTu = isSufficient ? "Đủ" : "Thiếu";
        savedKiemTraPhong.setTinhTrang(tinhTrangVatTu);
        savedKiemTraPhong.setTrangThai("Đã kiểm tra");
        KiemTraPhong finalSavedKTP = kiemTraPhongRepository.save(savedKiemTraPhong);

        // Cập nhật tình trạng phòng
        Phong phong = xepPhong.getPhong();
        phong.setTinhTrang("available");
        phongRepository.save(phong);

        thongTinDatPhong.setTrangThai("Đã kiểm tra phòng");
        thongTinDatPhongRepository.save(thongTinDatPhong);

        // Build trả về response tổng kết
        return KiemTraPhongResponse.builder()
                .id(finalSavedKTP.getId())
                .idXepPhong(xepPhong.getId())
                .maThongTinDatPhong(xepPhong.getThongTinDatPhong().getMaThongTinDatPhong())
                .nhanVienKiemTraPhong(nhanVien.getHo() + " " + nhanVien.getTen())
                .thoiGianKiemTra(finalSavedKTP.getThoiGianKiemTra())
                .tinhTrangVatTu(finalSavedKTP.getTinhTrang())
                .trangThai(finalSavedKTP.getTrangThai())
                .danhSachVatTu(danhSachKiemTraVatTuResponses)
                .build();
    }

    @Override
    public List<XepPhongResponse> timKiemXepPhong(String key) {
        log.info("Find xepPhong by key");
        List<String> trangThaiThongTinDatPhong = new ArrayList<>();
        trangThaiThongTinDatPhong.add("Đang ở");
        trangThaiThongTinDatPhong.add("Đã kiểm tra phòng");
        List<XepPhong> danhSachPhong = kiemTraPhongRepository.findByKeyNotChecked(key, trangThaiThongTinDatPhong);

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