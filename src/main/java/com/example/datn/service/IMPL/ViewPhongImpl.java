package com.example.datn.service.IMPL;

import com.example.datn.dto.response.PhongResponse;
import com.example.datn.mapper.PhongMapper;
import com.example.datn.model.*;
import com.example.datn.repository.DichVuSuDungRepository;
import com.example.datn.repository.ViewPhongRepository;
import com.example.datn.repository.XepPhongRepository;
import com.example.datn.service.ViewPhongService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@RequiredArgsConstructor
public class ViewPhongImpl implements ViewPhongService {
    ViewPhongRepository viewPhongRepository;

    XepPhongRepository xepPhongRepository;
    PhongMapper phongMapper;
    DichVuSuDungRepository dichVuSuDungRepository;
    @Override
    public List<PhongResponse> findRoomsByCriteria(String tinhTrang, String keyword,List<Integer> idLoaiPhong,Integer giaMin,Integer giaMax,Integer soTang) {
        List<Phong> phongList = viewPhongRepository.findByCriteria(tinhTrang,keyword,idLoaiPhong,giaMin,giaMax,soTang);
        System.out.println(soTang);
        // Sử dụng phongMapper để ánh xạ từ Phong sang PhongResponse
        return phongList.stream()
                .map(phongMapper::toPhongResponse)
                .collect(Collectors.toList());
    }

    @Override
    public XepPhong RoomDetail(int idPhong) {
        String trangThai = "Đang ở";
        return xepPhongRepository.getByIDPhong(idPhong,trangThai);
    }
    @Override
    public List<DichVuSuDung> addDVDKtoDVSD(int idXepPhong) {
        // Lấy danh sách dịch vụ đi kèm theo idXepPhong
        List<DichVuDiKem> listDVDK = viewPhongRepository.getDVDK(idXepPhong);
        // Lấy danh sách dịch vụ đã sử dụng cho phòng này
        List<DichVuSuDung> existingDVSD = dichVuSuDungRepository.getByIDXepPhong(idXepPhong);

        List<DichVuSuDung> newDVSDList;

        if (existingDVSD.isEmpty() ) {
            // Nếu không có dịch vụ đã sử dụng, thêm toàn bộ listDVDK
            newDVSDList = listDVDK.stream()
                    .map(dvdk -> {
                        DichVuSuDung dvsd = new DichVuSuDung();
                        DichVu dichVu = new DichVu();
                        XepPhong xepPhong = new XepPhong();
                        xepPhong.setId(idXepPhong);
                        dichVu.setId(dvdk.getDichVu().getId());
                        dvsd.setDichVu(dichVu);
                        dvsd.setXepPhong(xepPhong);
                        dvsd.setSoLuongSuDung(dvdk.getSoLuong()); // Mặc định 1, có thể chỉnh lại
                        dvsd.setGiaSuDung(0.0); // Giả sử dịch vụ đi kèm có giá
                        dvsd.setTrangThai(false); // Trạng thái mặc định
                        return dvsd;
                    })
                    .collect(Collectors.toList());
        } else {
            // Nếu đã có dịch vụ sử dụng, chỉ thêm những dịch vụ chưa tồn tại
            newDVSDList = listDVDK.stream()
                    .filter(dvdk -> existingDVSD.stream()
                            .noneMatch(dvsd -> dvsd.getDichVu().getId() == dvdk.getDichVu().getId()))
                    .map(dvdk -> {
                        DichVuSuDung dvsd = new DichVuSuDung();
                        DichVu dichVu = new DichVu();
                        XepPhong xepPhong = new XepPhong();
                        xepPhong.setId(idXepPhong);
                        dichVu.setId(dvdk.getDichVu().getId());
                        dvsd.setDichVu(dichVu);
                        dvsd.setXepPhong(xepPhong);
                        dvsd.setSoLuongSuDung(dvdk.getSoLuong()); // Mặc định 1, có thể chỉnh lại
                        dvsd.setGiaSuDung(0.0); // Giả sử dịch vụ đi kèm có giá
                        dvsd.setTrangThai(true); // Trạng thái mặc định
                        return dvsd;
                    })
                    .collect(Collectors.toList());
        }

        // Chỉ lưu nếu có dịch vụ mới cần thêm

            dichVuSuDungRepository.saveAll(newDVSDList);

        return newDVSDList;
    }



}
