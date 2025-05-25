package com.example.datn.service.IMPL;

import com.example.datn.dto.request.DichVuDikemRequest;
import com.example.datn.dto.request.LoaiPhongRequest;
import com.example.datn.dto.response.LoaiPhongKhaDungResponse;
import com.example.datn.dto.response.LoaiPhongResponse;
import com.example.datn.dto.response.datphong.LoaiPhongChon;
import com.example.datn.dto.response.datphong.ToHopPhongPhuHop;
import com.example.datn.model.DichVuDiKem;
import com.example.datn.model.HinhAnh;
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
import java.time.temporal.ChronoUnit;
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
        loaiPhong.setSoKhachTieuChuan(loaiPhongRequest.getSoKhachTieuChuan());
        loaiPhong.setSoKhachToiDa(loaiPhongRequest.getSoKhachToiDa());
        loaiPhong.setTreEmTieuChuan(loaiPhongRequest.getTreEmTieuChuan());
        loaiPhong.setTreEmToiDa(loaiPhongRequest.getTreEmToiDa());
        loaiPhong.setMoTa(loaiPhongRequest.getMoTa());
        loaiPhong.setDonGia(loaiPhongRequest.getDonGia());
        loaiPhong.setPhuThuNguoiLon(loaiPhongRequest.getPhuThuNguoiLon());
        loaiPhong.setPhuThuTreEm(loaiPhongRequest.getPhuThuTreEm());
        loaiPhong.setTrangThai(loaiPhongRequest.getTrangThai());
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
        LoaiPhong loaiPhong = loaiPhongRepository.findById(loaiPhongRequest.getId()).get();
        loaiPhong.setId(loaiPhongRequest.getId());
        loaiPhong.setTenLoaiPhong(loaiPhongRequest.getTenLoaiPhong());
        loaiPhong.setMaLoaiPhong(loaiPhongRequest.getMaLoaiPhong());
        loaiPhong.setDienTich(loaiPhongRequest.getDienTich());
        loaiPhong.setSoKhachTieuChuan(loaiPhongRequest.getSoKhachTieuChuan());
        loaiPhong.setSoKhachToiDa(loaiPhongRequest.getSoKhachToiDa());
        loaiPhong.setTreEmTieuChuan(loaiPhongRequest.getTreEmTieuChuan());
        loaiPhong.setTreEmToiDa(loaiPhongRequest.getTreEmToiDa());
        loaiPhong.setMoTa(loaiPhongRequest.getMoTa());
        loaiPhong.setDonGia(loaiPhongRequest.getDonGia());
        loaiPhong.setPhuThuNguoiLon(loaiPhongRequest.getPhuThuNguoiLon());
        loaiPhong.setPhuThuTreEm(loaiPhongRequest.getPhuThuTreEm());
        loaiPhong.setTrangThai(loaiPhongRequest.getTrangThai());
        return loaiPhongRepository.save(loaiPhong);
    }

    @Override
    public Page<LoaiPhong> filter( String tenLoaiPhong, Integer dienTichMin, Integer dienTichMax, Integer soKhachTieuChuan,
                                   Integer soKhachToiDa, Integer treEmTieuChuan, Integer treEmToiDa, Double donGiaMin,
                                   Double donGiaMax, Double phuThuNguoiLonMin, Double phuThuNguoiLonMax, Double phuThuTreEmMin,
                                   Double phuThuTreEmMax, Boolean trangThai, Pageable pageable) {
        return loaiPhongRepository.filter(tenLoaiPhong, dienTichMin, dienTichMax, soKhachTieuChuan,soKhachToiDa,treEmTieuChuan,
                treEmToiDa,donGiaMin, donGiaMax,phuThuNguoiLonMin,phuThuNguoiLonMax,phuThuTreEmMin,phuThuTreEmMax,trangThai, pageable);
    }

//    @Override
//    public LoaiPhongKhaDungResponse LoaiPhongKhaDungByLoaiPhong(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong, Integer idLoaiPhong) {
//        List<String> trangThaiTTDP = Arrays.asList("Đã xếp","Chưa xếp","Đang ở");
//        return loaiPhongRepository.LoaiPhongKhaDung1(ngayNhanPhong, ngayTraPhong, idLoaiPhong,trangThaiTTDP);
//    }

    @Override
    public LoaiPhong findByID(Integer idLoaiPhong) {
        return loaiPhongRepository.findById(idLoaiPhong).orElseThrow(() -> new EntityNotFoundException("LoaiPhong with ID " + idLoaiPhong + " not found"));
    }

    public List<LoaiPhongResponse> getAllLPR(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong) {
        List<String> trangThaiTTDP = Arrays.asList("Đang đặt phòng","Đã xếp","Chưa xếp","Đang ở");
        List<String> trangThaiXP = Arrays.asList("Đã xếp","Đang ở");
        return loaiPhongRepository.findLoaiPhongResponseTest(ngayNhanPhong, ngayTraPhong,trangThaiTTDP,trangThaiXP);
    }

    public List<LoaiPhongKhaDungResponse> getAllLPKDR(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong) {
        if (ngayNhanPhong == null || ngayTraPhong == null) {
            throw new IllegalArgumentException("Ngày nhận phòng và trả phòng không được null");
        }

        List<String> trangThaiTTDP = Arrays.asList("Đang đặt phòng", "Chưa xếp");
        List<String> trangThaiXP = Arrays.asList("Đã xếp", "Đang ở");

        return loaiPhongRepository.findLoaiPhongKhaDungByTinhTrangResponseList(
                ngayNhanPhong,
                ngayTraPhong,
                trangThaiXP,
                trangThaiTTDP
        );
    }

    public List<LoaiPhongKhaDungResponse> getLoaiPhongKhaDungResponseList(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong,
                                                                          Integer soNguoi,Integer treEm, Integer soPhong, Integer idLoaiPhong) {
        List<String> trangThaiTTDP = Arrays.asList("Đang đặt phòng","Chưa xếp");
        List<String> trangThaiXP = Arrays.asList("Đã xếp","Đang ở");
//        List<String> tinhTrangPhong = Arrays.asList("Trống","Cần kiểm tra");

        return loaiPhongRepository.findLPKDRList(ngayNhanPhong, ngayTraPhong,trangThaiXP,trangThaiTTDP,soNguoi,treEm,soPhong,idLoaiPhong);
    }

    public List<ToHopPhongPhuHop> DanhSachToHop(
            List<LoaiPhongKhaDungResponse> loaiPhong,
            int soKhach,
            int treEm,
            LocalDateTime ngayNhanPhong,
            LocalDateTime ngayTraPhong) {
        List<ToHopPhongPhuHop> results = new ArrayList<>();
        int n = loaiPhong.size();
        int[] counts = new int[n];
        generateCombinationsRec(0, counts, loaiPhong, soKhach, treEm, results, ngayNhanPhong, ngayTraPhong);
        return results;
    }

    private void generateCombinationsRec(
            int index,
            int[] counts,
            List<LoaiPhongKhaDungResponse> loaiPhong,
            int soKhach,
            int treEm,
            List<ToHopPhongPhuHop> results,
            LocalDateTime ngayNhanPhong,
            LocalDateTime ngayTraPhong) {
        // Khi đã duyệt hết các loại phòng, tính toán tổ hợp hiện tại
        if (index == loaiPhong.size()) {
            int totalCapacity = 0;
            int totalChildCapacity = 0;
            double totalCost = 0;
            int totalRooms = 0;
            List<LoaiPhongChon> lp = new ArrayList<>();
            // Tính số ngày lưu trú
            long soNgayLuuTru = ChronoUnit.DAYS.between(ngayNhanPhong, ngayTraPhong);
            if (soNgayLuuTru <= 0) {
                soNgayLuuTru = 1;
            }
            for (int i = 0; i < loaiPhong.size(); i++) {
                LoaiPhongKhaDungResponse room = loaiPhong.get(i);
                int count = counts[i];
                totalCapacity += count * room.getSoKhachToiDa();
                totalChildCapacity += count * room.getTreEmToiDa(); // Tính sức chứa trẻ em
                totalCost += count * room.getDonGia() * soNgayLuuTru;
                totalRooms += count;
                // Chỉ thêm vào danh sách nếu số lượng chọn lớn hơn 0
                if (count > 0) {
                    lp.add(new LoaiPhongChon(room, count));
                }
            }
            // Kiểm tra cả sức chứa người lớn và trẻ em
            if (totalCapacity >= soKhach && totalChildCapacity >= treEm) {
                ToHopPhongPhuHop comb = new ToHopPhongPhuHop(lp, totalCapacity, totalCost, totalRooms);
                results.add(comb);
            }
            return;
        }

        // Với loại phòng hiện tại, thử các giá trị từ 0 đến số phòng khả dụng
        LoaiPhongKhaDungResponse room = loaiPhong.get(index);
        for (int x = 0; x <= room.getSoPhongKhaDung(); x++) {
            counts[index] = x;
            generateCombinationsRec(index + 1, counts, loaiPhong, soKhach, treEm, results, ngayNhanPhong, ngayTraPhong);
        }
    }

    public List<ToHopPhongPhuHop> toHopPhuHop(List<ToHopPhongPhuHop> toHopPhongPhuHops, String key, Double tongChiPhiMin,
                                              Double tongChiPhiMax, Integer tongSoPhongMin, Integer tongSoPhongMax,
                                              Integer tongSucChuaMin, Integer tongSucChuaMax, List<LoaiPhongChon> loaiPhongChons) {
        if (toHopPhongPhuHops == null || toHopPhongPhuHops.isEmpty()) {
            return toHopPhongPhuHops;
        }

        // Tạo bản sao của danh sách
        List<ToHopPhongPhuHop> filteredList = new ArrayList<>(toHopPhongPhuHops);

        // Lọc một lần với tất cả các điều kiện
        filteredList = filteredList.stream()
                .filter(p -> (tongChiPhiMin == null || p.getTongChiPhi() >= tongChiPhiMin) &&
                        (tongChiPhiMax == null || p.getTongChiPhi() <= tongChiPhiMax) &&
                        (tongSoPhongMin == null || p.getTongSoPhong() >= tongSoPhongMin) &&
                        (tongSoPhongMax == null || p.getTongSoPhong() <= tongSoPhongMax) &&
                        (tongSucChuaMin == null || p.getTongSucChua() >= tongSucChuaMin) &&
                        (tongSucChuaMax == null || p.getTongSucChua() <= tongSucChuaMax) &&
                        // Kiểm tra danh sách loaiPhongChons
                        (loaiPhongChons == null || loaiPhongChons.isEmpty() ||
                                loaiPhongChons.stream().allMatch(lpc ->
                                        p.getPhongs().stream()
                                                .filter(phong -> phong.getLoaiPhong().getTenLoaiPhong()
                                                        .equalsIgnoreCase(lpc.getLoaiPhong().getTenLoaiPhong()))
                                                .mapToInt(LoaiPhongChon::getSoLuongChon)
                                                .sum() >= (lpc.getSoLuongChon() == null ? 0 : lpc.getSoLuongChon()))))
                .collect(Collectors.toList());

        if (key == null || key.isBlank()) {
            filteredList.sort(Comparator.comparing(ToHopPhongPhuHop::getTongChiPhi));
        } else if (key.equalsIgnoreCase("leastRooms")) {
            filteredList.sort(Comparator.comparing(ToHopPhongPhuHop::getTongSoPhong));
        }
        return filteredList;
    }

    public Page<ToHopPhongPhuHop> paginateToHopWithPageable(List<ToHopPhongPhuHop> list, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), list.size());
        List<ToHopPhongPhuHop> pageContent = list.subList(start, end);
        return new PageImpl<>(pageContent, pageable, list.size());
    }

    public Page<ToHopPhongPhuHop> getToHopPhongPhuHop(
            LocalDateTime ngayNhanPhong,
            LocalDateTime ngayTraPhong,
            Integer soNguoi,
            Integer treEm,
            String key,
            Double tongChiPhiMin,
            Double tongChiPhiMax,
            Integer tongSoPhongMin,
            Integer tongSoPhongMax,
            Integer tongSucChuaMin,
            Integer tongSucChuaMax,
            List<LoaiPhongChon> loaiPhongChons,
            Pageable pageable) {
        List<LoaiPhongKhaDungResponse> loaiPhongKhaDungResponses = getLoaiPhongKhaDungResponseList(
                ngayNhanPhong,
                ngayTraPhong,
                soNguoi,
                treEm,
                1,
                null
        );
        List<ToHopPhongPhuHop> toHopPhongPhuHops = toHopPhuHop(
                DanhSachToHop(loaiPhongKhaDungResponses, soNguoi, treEm, ngayNhanPhong, ngayTraPhong),
                key,
                tongChiPhiMin,
                tongChiPhiMax,
                tongSoPhongMin,
                tongSoPhongMax,
                tongSucChuaMin,
                tongSucChuaMax,
                loaiPhongChons
        );
        return paginateToHopWithPageable(toHopPhongPhuHops, pageable);
    }

    //    Chua dung den

    //    Tuan Dat
//    public boolean KiemTraDon(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong, Integer soNguoi) {
//        if (ngayNhanPhong != null && ngayTraPhong != null && soNguoi != null) {
//            System.out.println(soNguoi);
//            List<LoaiPhongResponse> loaiPhongResponseList = loaiPhongRepository.findLoaiPhongResponseTest(ngayNhanPhong, ngayTraPhong);
//            Integer totalCap = 0;
//            for (LoaiPhongResponse lp : loaiPhongResponseList) {
//                totalCap += loaiPhongRepository.demSoPhongKhaDung(lp.getId(), ngayNhanPhong, ngayTraPhong);
//            }
//            System.out.println(totalCap);
//            return totalCap >= soNguoi;
//        }
//        return false;
//    }
//
//    public boolean KiemTraDa(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong, Integer soNguoi) {
//        if (ngayNhanPhong != null && ngayTraPhong != null && soNguoi != null) {
//            System.out.println(soNguoi);
//            List<LoaiPhongResponse> loaiPhongResponseList = loaiPhongRepository.findLoaiPhongResponseTest(ngayNhanPhong, ngayTraPhong);
//            Integer totalCaps = 0;
//            for (LoaiPhongResponse lp : loaiPhongResponseList) {
//                totalCaps += loaiPhongRepository.demSoPhongKhaDung(lp.getId(), ngayNhanPhong, ngayTraPhong) * lp.getSoKhachToiDa();
//            }
//            System.out.println(totalCaps);
//            return totalCaps >= soNguoi;
//        }
//        return false;
//    }
//    public Page<SearchResultResponse> searchAvailableRooms(LocalDateTime checkIn, LocalDateTime checkOut, Integer soNguoi, Integer soPhong, Pageable pageable) {
//        // Lấy tất cả các loại phòng đáp ứng điều kiện cơ bản\
//        List<String> trangThaiTTDP = Arrays.asList("Đã xếp","Chưa xếp","Đang ở");
//        List<LoaiPhongResponse> roomTypes = loaiPhongRepository.findLoaiPhongResponse(checkIn, checkOut, soPhong,trangThaiTTDP);
//        List<SearchResultResponse> resultList = new ArrayList<>();
//        for (LoaiPhongResponse roomType : roomTypes) {
//            // Lấy số phòng khả dụng thực tế cho loại phòng đó
//            Integer availableRooms = loaiPhongRepository.getAvailableRoomCount(roomType.getId(), checkIn, checkOut);
//            availableRooms = (availableRooms == null) ? 0 : availableRooms;
//
//            // Lấy số phòng khả dụng
//            Integer soPhongKhaDung = loaiPhongRepository.demSoPhongKhaDung(roomType.getId(), checkIn, checkOut, trangThaiTTDP);
//            // Kiểm tra điều kiện: số phòng khả dụng phải >= soPhong và tổng sức chứa (soKhachToiDa * soPhong) >= soNguoi
//            boolean isContainable = (availableRooms >= soPhong) && ((roomType.getSoKhachToiDa() * soPhong) >= soNguoi);
//
//            // Tạo đối tượng ChiaPhongResponse
//            ChiaPhongResponse cp = new ChiaPhongResponse();
//            cp.setSoPhongKhaDung(soPhongKhaDung);
//            cp.setSoPhongCan(soPhong);
//            cp.setTongGiaTien(soPhong * roomType.getDonGia());
//            cp.setIsContainable(isContainable);
//
//            // Tạo đối tượng SearchResultResponse
//            SearchResultResponse sr = new SearchResultResponse();
//            sr.setLoaiPhongResponse(roomType);
//            sr.setDanhSachCachChia(cp);
//            resultList.add(sr);
//        }
//
//        // Áp dụng phân trang trực tiếp trên danh sách kết quả
//        int start = (int) pageable.getOffset();
//        int end = Math.min(start + pageable.getPageSize(), resultList.size());
//        List<SearchResultResponse> subList = resultList.subList(start, end);
//        return new PageImpl<>(subList, pageable, resultList.size());
//    }
//    public boolean isRoomTypeAvailable(LoaiPhong roomType, LocalDateTime checkIn, LocalDateTime checkOut) {
//        Integer availableCount = loaiPhongRepository.getAvailableRoomCount(roomType.getId(), checkIn, checkOut);
//        return availableCount != null && availableCount >= 1;
//    }
//
//    public List<List<LoaiPhongKhaDungResponse>> searchAvailableRooms2(LocalDateTime checkIn, LocalDateTime checkOut, int totalPeople, int totalRooms) {
//        // Lấy tất cả các loại phòng từ repository
//        List<LoaiPhong> allRoomTypes = loaiPhongRepository.findAll();
//
//        // Lọc ra các loại phòng khả dụng theo ngày
//        List<LoaiPhong> availableRoomTypes = new ArrayList<>();
//        for (LoaiPhong roomType : allRoomTypes) {
//            if (isRoomTypeAvailable(roomType, checkIn, checkOut)) {
//                availableRoomTypes.add(roomType);
//            }
//        }
//        List<LoaiPhongKhaDungResponse> listLPKHR = loaiPhongRepository.findAllLPKDR(checkIn, checkOut, totalPeople, totalRooms);
//
//        // Sinh ra các kết hợp các phòng khả dụng thỏa mãn số lượng khách yêu cầu
//        List<List<LoaiPhongKhaDungResponse>> results = new ArrayList<>();
//        generateCombinations(listLPKHR, 0, totalRooms, new ArrayList<>(), results, totalPeople);
//        return results;
//    }

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
    public List<HinhAnh> getAnhLP(Integer idLoaiPhong) {
        return loaiPhongRepository.getAnhLP(idLoaiPhong);
    }

    @Override
    public Optional<LoaiPhong> findById(int id) {
        return loaiPhongRepository.findById(id);
    }


    public DichVuDiKem addDichVuDiKem(DichVuDikemRequest dichVuDikemRequest) {
        DichVuDiKem dichVuDiKem = new DichVuDiKem();
        dichVuDiKem.setDichVu(dichVuDikemRequest.getDichVu());
        dichVuDiKem.setLoaiPhong(dichVuDikemRequest.getLoaiPhong());
        dichVuDiKem.setTrangThai(dichVuDikemRequest.getTrangThai());
        return dichVuDiKemRepository.save(dichVuDiKem);
    }

}
