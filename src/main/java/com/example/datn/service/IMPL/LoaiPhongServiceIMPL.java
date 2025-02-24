package com.example.datn.service.IMPL;

import com.example.datn.dto.request.DichVuDikemRequest;
import com.example.datn.dto.request.LoaiPhongRequest;
import com.example.datn.dto.response.ChiaPhongResponse;
import com.example.datn.dto.response.LoaiPhongKhaDungResponse;
import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.dto.response.SearchResultResponse;
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
import java.util.*;
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
        loaiPhong.setMaLoaiPhong(loaiPhongRequest.getMaLoaiPhong());
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
        loaiPhong.get().setMaLoaiPhong(loaiPhongRequest.getMaLoaiPhong());
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
                                                           Integer soNguoi, Integer soPhong, Pageable pageable) {

            Pageable pg = PageRequest.of(pageable.getPageNumber(),3);
            Page<LoaiPhongKhaDungResponse> pageLPKD = loaiPhongRepository.LoaiPhongKhaDung(ngayNhanPhong,ngayTraPhong,soNguoi,soPhong,pg);
            return loaiPhongRepository.LoaiPhongKhaDung(ngayNhanPhong,ngayTraPhong,soNguoi,soPhong,pg);

    }

    @Override
    public Page<LoaiPhongKhaDungResponse> searchLoaiPhong(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong, Integer soNguoi, Integer soPhong, Pageable pageable) {
        if (soNguoi == null || soNguoi <= 0 || soPhong == null || soPhong <= 0) {
            throw new IllegalArgumentException("Số người và số phòng phải lớn hơn 0.");
        }

        try {
            return loaiPhongRepository.findLoaiPhongKhaDung(ngayNhanPhong, ngayTraPhong, soNguoi, pageable);
        } catch (Exception e) {
            throw new RuntimeException("Đã xảy ra lỗi khi tìm kiếm loại phòng khả dụng.", e);
        }
    }

    public List<LoaiPhongResponse> getAllLPR(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong, Integer soKhach, Integer soPhong){
        return loaiPhongRepository.findLoaiPhongResponse(ngayNhanPhong,ngayTraPhong,soPhong);
    }

    public Page<SearchResultResponse> searchAvailableRooms2(LocalDateTime checkIn,
                                                            LocalDateTime checkOut,
                                                            Integer soNguoi,
                                                            Integer soPhong,
                                                            Pageable pageable) {
        // Lấy tất cả các loại phòng đáp ứng điều kiện cơ bản
        List<LoaiPhongResponse> roomTypes = loaiPhongRepository.findLoaiPhongResponse(checkIn, checkOut, soPhong);
        List<SearchResultResponse> resultList = new ArrayList<>();

        for (LoaiPhongResponse roomType : roomTypes) {
            // Lấy số phòng khả dụng thực tế cho loại phòng đó
            Integer availableRooms = loaiPhongRepository.getAvailableRoomCount(roomType.getId(), checkIn, checkOut);
            availableRooms = (availableRooms == null) ? 0 : availableRooms;

            // Kiểm tra điều kiện: số phòng khả dụng phải >= soPhong và tổng sức chứa (soKhachToiDa * soPhong) >= soNguoi
            boolean isContainable = (availableRooms >= soPhong) && ((roomType.getSoKhachToiDa() * soPhong) >= soNguoi);

            // Tạo đối tượng ChiaPhongResponse
            ChiaPhongResponse cp = new ChiaPhongResponse();
            cp.setSoPhongCan(soPhong);
            cp.setTongGiaTien(soPhong * roomType.getDonGia());
            cp.setIsContainable(isContainable);

            // Tạo đối tượng SearchResultResponse
            SearchResultResponse sr = new SearchResultResponse();
            sr.setLoaiPhongResponse(roomType);
            sr.setDanhSachCachChia(cp);
            resultList.add(sr);
        }

        // Áp dụng phân trang trực tiếp trên danh sách kết quả
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), resultList.size());
        List<SearchResultResponse> subList = resultList.subList(start, end);
        return new PageImpl<>(subList, pageable, resultList.size());
    }


    public boolean isRoomTypeAvailable(LoaiPhong roomType, LocalDateTime checkIn, LocalDateTime checkOut) {
        Integer availableCount = loaiPhongRepository.getAvailableRoomCount(roomType.getId(), checkIn, checkOut);
        return availableCount != null && availableCount >= 1;
    }
    public List<List<LoaiPhongKhaDungResponse>> searchAvailableRooms(LocalDateTime checkIn, LocalDateTime checkOut, int totalPeople, int totalRooms) {
        // Lấy tất cả các loại phòng từ repository
        List<LoaiPhong> allRoomTypes = loaiPhongRepository.findAll();

        // Lọc ra các loại phòng khả dụng theo ngày
        List<LoaiPhong> availableRoomTypes = new ArrayList<>();
        for (LoaiPhong roomType : allRoomTypes) {
            if (isRoomTypeAvailable(roomType, checkIn, checkOut)) {
                availableRoomTypes.add(roomType);
            }
        }
        List<LoaiPhongKhaDungResponse> listLPKHR = loaiPhongRepository.findAllLPKDR(checkIn,checkOut,totalPeople,totalRooms);

        // Sinh ra các kết hợp các phòng khả dụng thỏa mãn số lượng khách yêu cầu
        List<List<LoaiPhongKhaDungResponse>> results = new ArrayList<>();
        generateCombinations(listLPKHR, 0, totalRooms, new ArrayList<>(), results, totalPeople);
        return results;
    }
    private void generateCombinations(List<LoaiPhongKhaDungResponse> roomTypes, int start, int roomsToSelect, List<LoaiPhongKhaDungResponse> current, List<List<LoaiPhongKhaDungResponse>> results, int totalPeople) {
        if (roomsToSelect == 0) {
            if (isValidCombination(current, totalPeople)) {
                results.add(new ArrayList<>(current));
            }
            return;
        }
        for (int i = start; i < roomTypes.size(); i++) {
            current.add(roomTypes.get(i));
            // Cho phép chọn lại cùng 1 loại phòng => không tăng i khi gọi đệ quy
            generateCombinations(roomTypes, i, roomsToSelect - 1, current, results, totalPeople);
            current.remove(current.size() - 1);
        }
    }

    private boolean isValidCombination(List<LoaiPhongKhaDungResponse> combination, int totalPeople) {
        int numberOfRooms = combination.size();
        if (totalPeople < numberOfRooms) {
            return false; // không đủ người để mỗi phòng có ít nhất 1 khách
        }
        int extraNeeded = totalPeople - numberOfRooms;
        int extraCapacity = 0;
        for (LoaiPhongKhaDungResponse lp : combination) {
            extraCapacity += (lp.getSoKhachToiDa() - 1);
        }
        return extraNeeded <= extraCapacity;
    }

    @Override
    public LoaiPhongKhaDungResponse LoaiPhongKhaDungByLoaiPhong(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong
            ,Integer idLoaiPhong) {
        return loaiPhongRepository.LoaiPhongKhaDung1(ngayNhanPhong,ngayTraPhong,idLoaiPhong);
    }


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
