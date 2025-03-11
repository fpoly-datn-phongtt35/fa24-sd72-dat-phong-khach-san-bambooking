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
import java.util.*;

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
        List<ToHopPhongPhuHop> results = new ArrayList<>();
        int n = loaiPhong.size();
        // Mảng counts lưu số lượng phòng được chọn cho từng loại (theo thứ tự trong list loaiPhong)
        int[] counts = new int[n];
        generateCombinationsRec(0, counts, loaiPhong, soKhach, results);
        return results;
    }

    private void generateCombinationsRec(int index, int[] counts, List<LoaiPhongKhaDungResponse> loaiPhong, int soKhach, List<ToHopPhongPhuHop> results) {
        // Khi đã duyệt hết các loại phòng, tính toán tổ hợp hiện tại
        if (index == loaiPhong.size()) {
            int totalCapacity = 0;
            double totalCost = 0;
            int totalRooms = 0;
            List<LoaiPhongChon> lp = new ArrayList<>();
            for (int i = 0; i < loaiPhong.size(); i++) {
                LoaiPhongKhaDungResponse room = loaiPhong.get(i);
                int count = counts[i];
                totalCapacity += count * room.getSoKhachToiDa();
                totalCost += count * room.getDonGia();
                totalRooms += count;
                // Chỉ thêm vào danh sách nếu số lượng chọn lớn hơn 0
                if (count > 0) {
                    lp.add(new LoaiPhongChon(room, count));
                }
            }
            if (totalCapacity >= soKhach) {
                ToHopPhongPhuHop comb = new ToHopPhongPhuHop(lp, totalCapacity, totalCost, totalRooms);
                results.add(comb);
            }
            return;
        }

        // Với loại phòng hiện tại, thử các giá trị từ 0 đến số phòng khả dụng
        LoaiPhongKhaDungResponse room = loaiPhong.get(index);
        for (int x = 0; x <= room.getSoPhongKhaDung(); x++) {
            counts[index] = x;
            generateCombinationsRec(index + 1, counts, loaiPhong, soKhach, results);
        }
    }

    public List<ToHopPhongPhuHop> ToHopPhuHop(List<ToHopPhongPhuHop> toHopPhongPhuHops, String key) {
        if (toHopPhongPhuHops == null || toHopPhongPhuHops.isEmpty()) {
            return toHopPhongPhuHops;
        }
        if (key == null || key.isBlank()){
            return toHopPhongPhuHops;
        }

        // Tạo bản sao của danh sách để sắp xếp (để không làm thay đổi danh sách gốc nếu cần)
        List<ToHopPhongPhuHop> sortedList = new ArrayList<>(toHopPhongPhuHops);

        if (key.equalsIgnoreCase("optimalCost")) {
            // Sắp xếp theo chi phí tối ưu (tăng dần: chi phí thấp nhất sẽ nằm đầu)
            sortedList.sort(Comparator.comparing(ToHopPhongPhuHop::getTongChiPhi));
        } else if (key.equalsIgnoreCase("leastRooms")) {
            // Sắp xếp theo số phòng ít nhất (tăng dần: số phòng ít nhất sẽ nằm đầu)
            sortedList.sort(Comparator.comparing(ToHopPhongPhuHop::getTongSoPhong));
        }
        return sortedList;
    }

    public Page<ToHopPhongPhuHop> paginateToHopWithPageable(List<ToHopPhongPhuHop> list, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), list.size());
        List<ToHopPhongPhuHop> pageContent = list.subList(start, end);
        return new PageImpl<>(pageContent, pageable, list.size());
    }

    public Page<ToHopPhongPhuHop> TESTDATPHONG(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong, Integer soNguoi, String key, Pageable pageable) {
        List<LoaiPhongKhaDungResponse> loaiPhongKhaDungResponses = getAllLPKDR(ngayNhanPhong, ngayTraPhong);
        List<ToHopPhongPhuHop> toHopPhongPhuHops = ToHopPhuHop(DanhSachToHop(loaiPhongKhaDungResponses, soNguoi), key) ;
        return paginateToHopWithPageable(toHopPhongPhuHops,pageable);
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
