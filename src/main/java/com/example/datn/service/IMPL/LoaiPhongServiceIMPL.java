package com.example.datn.service.IMPL;

import com.example.datn.dto.request.DichVuDikemRequest;
import com.example.datn.dto.request.LoaiPhongRequest;
import com.example.datn.dto.response.LoaiPhongKhaDungResponse;
import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.model.DichVuDiKem;
import com.example.datn.model.LoaiPhong;
import com.example.datn.repository.DichVuDiKemRepository;
import com.example.datn.repository.LoaiPhongRepository;
import com.example.datn.service.LoaiPhongService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LoaiPhongServiceIMPL implements LoaiPhongService {

    @Autowired
    LoaiPhongRepository loaiPhongRepository;
    @Autowired
    DichVuDiKemRepository dichVuDiKemRepository;

    @Override
    public List<LoaiPhong> getAllLoaiPhong() {
        return loaiPhongRepository.findAll();
    }

    public List<LoaiPhong> getAll() {
        return loaiPhongRepository.findAll();
    }

    @Override
    public Page<LoaiPhongResponse> getPage(Pageable pageable) {

        return loaiPhongRepository.LoaiPhong(pageable);
    }


    @Override
    public LoaiPhong add(LoaiPhongRequest loaiPhongRequest) {
        LoaiPhong loaiPhong = new LoaiPhong();
        loaiPhong.setTenLoaiPhong(loaiPhongRequest.getTenLoaiPhong());
        loaiPhong.setDienTich(loaiPhongRequest.getDienTich());
        loaiPhong.setSoKhachToiDa(loaiPhongRequest.getSoKhachToiDa());
        loaiPhong.setDonGiaPhuThu(loaiPhongRequest.getDonGiaPhuThu());
        loaiPhong.setMoTa(loaiPhongRequest.getMoTa());
        loaiPhong.setDonGia(loaiPhongRequest.getDonGia());
        return loaiPhongRepository.save(loaiPhong);
    }

    @Override
    public LoaiPhong detail(Integer id) {

        return loaiPhongRepository.findById(id).get();
    }

    @Override
    public void delete(Integer id) {
        loaiPhongRepository.deleteById(id);
    }

    @Override
    public LoaiPhong update(LoaiPhongRequest loaiPhongRequest) {
        Optional<LoaiPhong> loaiPhong = loaiPhongRepository.findById(loaiPhongRequest.getId());
        loaiPhong.get().setId(loaiPhongRequest.getId());
        loaiPhong.get().setTenLoaiPhong(loaiPhongRequest.getTenLoaiPhong());
        loaiPhong.get().setDienTich(loaiPhongRequest.getDienTich());
        loaiPhong.get().setSoKhachToiDa(loaiPhongRequest.getSoKhachToiDa());
        loaiPhong.get().setDonGia(loaiPhongRequest.getDonGia());
        loaiPhong.get().setMoTa(loaiPhongRequest.getMoTa());
        loaiPhong.get().setDonGiaPhuThu(loaiPhongRequest.getDonGiaPhuThu());
        return loaiPhongRepository.save(loaiPhong.get());
    }

    @Override
    public Page<LoaiPhong> filter(String tenLoaiPhong,
                                  Integer dienTichMin,
                                  Integer dienTichMax,
                                  Integer soKhach,
                                  Double donGiaMin,
                                  Double donGiaMax,
                                  Double donGiaPhuThuMin,
                                  Double donGiaPhuThuMax,
                                  Pageable pageable) {
        return loaiPhongRepository.filter(tenLoaiPhong, dienTichMin, dienTichMax, soKhach, donGiaMin,
                donGiaMax, donGiaPhuThuMin, donGiaPhuThuMax, pageable);
    }

    @Override
    public Page<LoaiPhongKhaDungResponse> LoaiPhongKhaDung(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong,
                                                           Integer soNguoi, Pageable pageable) {

            Pageable pageable1 = PageRequest.of(pageable.getPageNumber(),3);
            return loaiPhongRepository.LoaiPhongKhaDung(ngayNhanPhong,ngayTraPhong,soNguoi,pageable1);

    }

// Đảm bảo pageable có kích thước trang là 5
//        Pageable fixedPageable = PageRequest.of(pageable.getPageNumber(), 2);
//
//        // Sử dụng query với Pageable để lấy danh sách loại phòng và tổng số phòng với phân trang
//        Page<LoaiPhongKhaDungResponse> loaiPhongPage = loaiPhongRepository.findLoaiPhongWithTongSoPhong(soNguoi, fixedPageable);
//
//        // Query để lấy số phòng trống cho từng loại phòng trong khoảng thời gian
//        List<Object[]> soPhongTrongData = loaiPhongRepository.findSoPhongTrong(ngayNhanPhong, ngayTraPhong);
//
//        // Tạo Map từ `soPhongTrongData` để ánh xạ theo `loaiPhongId`
//        Map<Long, Long> soPhongTrongMap = soPhongTrongData.stream()
//                .collect(Collectors.toMap(
//                        data -> ((Number) data[0]).longValue(), // Ép kiểu về Long cho `loaiPhongId`
//                        data -> ((Number) data[1]).longValue()  // Ép kiểu về Long cho `soPhongTrong`
//                ));
//
//        // Gán số phòng trống vào danh sách `LoaiPhongKhaDungResponse` trong page
//        loaiPhongPage.forEach(loaiPhong -> {
//            Long phongTrong = soPhongTrongMap.getOrDefault(loaiPhong.getId().longValue(), 0L); // Ép kiểu loaiPhong.getId() thành Long
//            loaiPhong.setSoPhongKhaDung(phongTrong);
//        });
//
//        // Lọc chỉ các loại phòng có `soPhongKhaDung` lớn hơn 0
//        List<LoaiPhongKhaDungResponse> filteredList = loaiPhongPage.getContent().stream()
//                .filter(loaiPhong -> loaiPhong.getSoPhongKhaDung() > 0)
//                .collect(Collectors.toList());
//
//// Tổng số phần tử sau khi lọc
//        int totalElements = filteredList.size();
//
//// Kiểm tra nếu danh sách đã lọc không rỗng và có đủ phần tử để phân trang
//        if (totalElements > 0) {
//            // Xác định vị trí bắt đầu và kết thúc trong danh sách đã lọc
//            int start = (int) fixedPageable.getOffset();
//            int end = Math.min((start + fixedPageable.getPageSize()), totalElements);
//
//            // Phân trang lại dựa trên danh sách đã lọc
//            List<LoaiPhongKhaDungResponse> pagedList = filteredList.subList(start, end);
//
//            // Trả về PageImpl mới với danh sách đã lọc và tổng số phần tử đã tính
//            return new PageImpl<>(pagedList, fixedPageable, totalElements);
//        } else {
//            // Nếu danh sách rỗng, trả về trang rỗng
//            return Page.empty(fixedPageable);
//        }

    @Override
    public LoaiPhong findByID(Integer idLoaiPhong) {
        return loaiPhongRepository.findById(idLoaiPhong)
                .orElseThrow(() -> new EntityNotFoundException("LoaiPhong with ID " + idLoaiPhong + " not found"));
    }


    public DichVuDiKem addDichVuDiKem(DichVuDikemRequest dichVuDikemRequest) {
        DichVuDiKem dichVuDiKem = new DichVuDiKem();
        dichVuDiKem.setDichVu(dichVuDikemRequest.getDichVu());
        dichVuDiKem.setLoaiPhong(dichVuDikemRequest.getLoaiPhong());
        dichVuDiKem.setTrangThai(dichVuDikemRequest.getTrangThai());
        return dichVuDiKemRepository.save(dichVuDiKem);
    }


}
