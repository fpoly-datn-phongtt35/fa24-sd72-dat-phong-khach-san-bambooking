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
                                                           Integer soNguoi, Integer soPhong, Pageable pageable) {

            Pageable pg = PageRequest.of(pageable.getPageNumber(),3);
            Page<LoaiPhongKhaDungResponse> pageLPKD = loaiPhongRepository.LoaiPhongKhaDung(ngayNhanPhong,ngayTraPhong,soNguoi,soPhong,pg);
            return loaiPhongRepository.LoaiPhongKhaDung(ngayNhanPhong,ngayTraPhong,soNguoi,soPhong,pg);

    }

    @Override
    public SearchResultResponse searchLoaiPhong(LocalDateTime ngayNhanPhong, LocalDateTime ngayTraPhong, Integer soNguoi, Integer soPhong,Pageable pageable) {
        // Lấy danh sách tất cả các loại phòng khả dụng
        Page<LoaiPhongKhaDungResponse> allLoaiPhong = loaiPhongRepository.findLoaiPhongKhaDung(ngayNhanPhong, ngayTraPhong, soNguoi, pageable);

        // Sử dụng Stream API để xây dựng danh sách gợi ý cách chia phòng
        List<ChiaPhongResponse> chiaPhongCach = allLoaiPhong.stream()
                .map(loaiPhong -> {
                    int soKhachToiDa = loaiPhong.getSoKhachToiDa();
                    int soPhongCan = (int) Math.ceil((double) soNguoi / soKhachToiDa); // Tính số phòng cần

                    // Kiểm tra nếu số phòng cần thiết <= số phòng khả dụng
                    if (soPhongCan <= loaiPhong.getSoPhongKhaDung()) {
                        return new ChiaPhongResponse(
                                loaiPhong.getId(),
                                loaiPhong.getTenLoaiPhong(),
                                soPhongCan,
                                soKhachToiDa,
                                loaiPhong.getDonGia() * soPhongCan // Tổng giá tiền
                        );
                    }
                    return null; // Không thêm nếu không đủ phòng
                })
                .filter(Objects::nonNull) // Loại bỏ các kết quả null
                .collect(Collectors.toList());

        // Trả về kết quả tìm kiếm
        return new SearchResultResponse(allLoaiPhong, chiaPhongCach);
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
