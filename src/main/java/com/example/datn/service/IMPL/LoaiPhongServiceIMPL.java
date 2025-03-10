package com.example.datn.service.IMPL;

import com.example.datn.dto.request.DichVuDikemRequest;
import com.example.datn.dto.request.LoaiPhongRequest;
import com.example.datn.dto.response.ChiaPhongResponse;
import com.example.datn.dto.response.LoaiPhongKhaDungResponse;
import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.dto.response.SearchResultResponse;
import com.example.datn.dto.response.datphong.LoaiPhongChon;
import com.example.datn.dto.response.datphong.ToHopPhongPhuHop;
import com.example.datn.model.DichVuDiKem;
import com.example.datn.model.LoaiPhong;
import com.example.datn.repository.DichVuDiKemRepository;
import com.example.datn.repository.LoaiPhongRepository;
import com.example.datn.service.LoaiPhongService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

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
    public Page<LoaiPhong> filter(String tenLoaiPhong, Integer dienTichMin, Integer dienTichMax, Integer soKhach, Double donGiaMin, Double donGiaMax, Double donGiaPhuThuMin, Double donGiaPhuThuMax, Pageable pageable) {
        return loaiPhongRepository.filter(tenLoaiPhong, dienTichMin, dienTichMax, soKhach, donGiaMin, donGiaMax, donGiaPhuThuMin, donGiaPhuThuMax, pageable);
    }

    @Override
    public LoaiPhongKhaDungResponse LoaiPhongKhaDungByLoaiPhong(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong, Integer idLoaiPhong) {
        return loaiPhongRepository.LoaiPhongKhaDung1(ngayNhanPhong, ngayTraPhong, idLoaiPhong);
    }

    @Override
    public LoaiPhong findByID(Integer idLoaiPhong) {
        return loaiPhongRepository.findById(idLoaiPhong).orElseThrow(() -> new EntityNotFoundException("LoaiPhong with ID " + idLoaiPhong + " not found"));
    }

    public DichVuDiKem addDichVuDiKem(DichVuDikemRequest dichVuDikemRequest) {
        DichVuDiKem dichVuDiKem = new DichVuDiKem();
        dichVuDiKem.setDichVu(dichVuDikemRequest.getDichVu());
        dichVuDiKem.setLoaiPhong(dichVuDikemRequest.getLoaiPhong());
        dichVuDiKem.setTrangThai(dichVuDikemRequest.getTrangThai());
        return dichVuDiKemRepository.save(dichVuDiKem);
    }


    //    Tuan Dat
    public boolean KiemTraDon(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong, Integer soNguoi) {
        if (ngayNhanPhong != null && ngayTraPhong != null && soNguoi != null) {
            System.out.println(soNguoi);
            List<LoaiPhongResponse> loaiPhongResponseList = loaiPhongRepository.findLoaiPhongResponseTest(ngayNhanPhong, ngayTraPhong);
            Integer totalCap = 0;
            for (LoaiPhongResponse lp : loaiPhongResponseList) {
                totalCap += loaiPhongRepository.demSoPhongKhaDung(lp.getId(), ngayNhanPhong, ngayTraPhong);
            }
            System.out.println(totalCap);
            return totalCap >= soNguoi;
        }
        return false;
    }

    public boolean KiemTraDa(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong, Integer soNguoi) {
        if (ngayNhanPhong != null && ngayTraPhong != null && soNguoi != null) {
            System.out.println(soNguoi);
            List<LoaiPhongResponse> loaiPhongResponseList = loaiPhongRepository.findLoaiPhongResponseTest(ngayNhanPhong, ngayTraPhong);
            Integer totalCaps = 0;
            for (LoaiPhongResponse lp : loaiPhongResponseList) {
                totalCaps += loaiPhongRepository.demSoPhongKhaDung(lp.getId(), ngayNhanPhong, ngayTraPhong) * lp.getSoKhachToiDa();
            }
            System.out.println(totalCaps);
            return totalCaps >= soNguoi;
        }
        return false;
    }

    public List<LoaiPhongResponse> getAllLPR(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong) {
        return loaiPhongRepository.findLoaiPhongResponseTest(ngayNhanPhong, ngayTraPhong);
    }

    public List<LoaiPhongKhaDungResponse> getAllLPKDR(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong) {
        return loaiPhongRepository.findLoaiPhongKhaDungResponseList(ngayNhanPhong, ngayTraPhong);
    }


    public List<ToHopPhongPhuHop> DanhSachToHop(List<LoaiPhongKhaDungResponse> loaiPhong, int soKhach) {
        // Integer Programming
        List<ToHopPhongPhuHop> results = new ArrayList<>();
        LoaiPhongKhaDungResponse room1 = loaiPhong.get(0);
        LoaiPhongKhaDungResponse room2 = loaiPhong.get(1);
        LoaiPhongKhaDungResponse room3 = loaiPhong.get(2);

        // Duyệt tất cả các khả năng chọn phòng (giả sử số phòng khả dụng là số lượng phòng tối đa có thể chọn)
        for (int x1 = 0; x1 <= room1.getSoPhongKhaDung(); x1++) {
            for (int x2 = 0; x2 <= room2.getSoPhongKhaDung(); x2++) {
                for (int x3 = 0; x3 <= room3.getSoPhongKhaDung(); x3++) {
                    int totalCapacity = x1 * room1.getSoKhachToiDa()
                            + x2 * room2.getSoKhachToiDa()
                            + x3 * room3.getSoKhachToiDa();
                    if (totalCapacity >= soKhach) {
                        double totalCost = x1 * room1.getDonGia()
                                + x2 * room2.getDonGia()
                                + x3 * room3.getDonGia();
                        int totalRooms = x1 + x2 + x3;

                        // Tạo danh sách tổ hợp với số lượng phòng đã chọn cho mỗi loại
                        List<LoaiPhongChon> lp = new ArrayList<>();
                        lp.add(new LoaiPhongChon(room1, x1));
                        lp.add(new LoaiPhongChon(room2, x2));
                        lp.add(new LoaiPhongChon(room3, x3));

                        ToHopPhongPhuHop comb = new ToHopPhongPhuHop(lp, totalCapacity, totalCost, totalRooms);
                        results.add(comb);
                    }
                }
            }
        }
        return results;
    }

    public ToHopPhongPhuHop ToHopPhuHop(List<ToHopPhongPhuHop> toHopPhongPhuHops, String key) {
        if (toHopPhongPhuHops.isEmpty()) return null;
        ToHopPhongPhuHop temp = toHopPhongPhuHops.get(0);
        if (key.equalsIgnoreCase("optimalCost")) {
            for (ToHopPhongPhuHop thpph : toHopPhongPhuHops) {
                if (thpph.getTongChiPhi() < temp.getTongChiPhi()) {
                    temp = thpph;
                }
            }
        } else if (key.equalsIgnoreCase("leastRooms")) {
            for (ToHopPhongPhuHop thpph : toHopPhongPhuHops) {
                if (thpph.getTongSoPhong() < thpph.getTongSoPhong()) {
                    temp = thpph;
                }
            }
        }
        return temp;
    }

    public List<ToHopPhongPhuHop> TESTDATPHONG(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong, Integer soKhach) {
        List<LoaiPhongKhaDungResponse> loaiPhongKhaDungResponses = getAllLPKDR(ngayNhanPhong, ngayTraPhong);
        List<ToHopPhongPhuHop> toHopPhongPhuHops = DanhSachToHop(loaiPhongKhaDungResponses, soKhach);
        return toHopPhongPhuHops;
    }

    public Page<SearchResultResponse> searchAvailableRooms(LocalDateTime checkIn, LocalDateTime checkOut, Integer soNguoi, Integer soPhong, Pageable pageable) {
        // Lấy tất cả các loại phòng đáp ứng điều kiện cơ bản
        List<LoaiPhongResponse> roomTypes = loaiPhongRepository.findLoaiPhongResponse(checkIn, checkOut, soPhong);
        List<SearchResultResponse> resultList = new ArrayList<>();

        for (LoaiPhongResponse roomType : roomTypes) {
            // Lấy số phòng khả dụng thực tế cho loại phòng đó
            Integer availableRooms = loaiPhongRepository.getAvailableRoomCount(roomType.getId(), checkIn, checkOut);
            availableRooms = (availableRooms == null) ? 0 : availableRooms;

            // Lấy số phòng khả dụng
            Integer soPhongKhaDung = loaiPhongRepository.demSoPhongKhaDung(roomType.getId(), checkIn, checkOut);
            // Kiểm tra điều kiện: số phòng khả dụng phải >= soPhong và tổng sức chứa (soKhachToiDa * soPhong) >= soNguoi
            boolean isContainable = (availableRooms >= soPhong) && ((roomType.getSoKhachToiDa() * soPhong) >= soNguoi);

            // Tạo đối tượng ChiaPhongResponse
            ChiaPhongResponse cp = new ChiaPhongResponse();
            cp.setSoPhongKhaDung(soPhongKhaDung);
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

    //    Chua dung den
    public boolean isRoomTypeAvailable(LoaiPhong roomType, LocalDateTime checkIn, LocalDateTime checkOut) {
        Integer availableCount = loaiPhongRepository.getAvailableRoomCount(roomType.getId(), checkIn, checkOut);
        return availableCount != null && availableCount >= 1;
    }

    public List<List<LoaiPhongKhaDungResponse>> searchAvailableRooms2(LocalDateTime checkIn, LocalDateTime checkOut, int totalPeople, int totalRooms) {
        // Lấy tất cả các loại phòng từ repository
        List<LoaiPhong> allRoomTypes = loaiPhongRepository.findAll();

        // Lọc ra các loại phòng khả dụng theo ngày
        List<LoaiPhong> availableRoomTypes = new ArrayList<>();
        for (LoaiPhong roomType : allRoomTypes) {
            if (isRoomTypeAvailable(roomType, checkIn, checkOut)) {
                availableRoomTypes.add(roomType);
            }
        }
        List<LoaiPhongKhaDungResponse> listLPKHR = loaiPhongRepository.findAllLPKDR(checkIn, checkOut, totalPeople, totalRooms);

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
}
