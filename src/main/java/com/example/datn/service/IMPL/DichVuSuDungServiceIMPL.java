package com.example.datn.service.IMPL;

import com.example.datn.dto.request.DichVuSuDungRequest;
import com.example.datn.model.DichVuSuDung;
import com.example.datn.repository.DichVuSuDungRepository;
import com.example.datn.service.DichVuSuDungService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service

public class DichVuSuDungServiceIMPL implements DichVuSuDungService {
    @Autowired
    DichVuSuDungRepository phieuDichVuRepository;

    @Override
    public List<DichVuSuDung> getAll() {
        return phieuDichVuRepository.findAll();
    }

    @Override
    public DichVuSuDung addPhieuDichVu(DichVuSuDungRequest dichVuSuDungRequest) {
        DichVuSuDung dichVuSuDung = new DichVuSuDung();
        dichVuSuDung.setDichVu(dichVuSuDungRequest.getDichVu());
        dichVuSuDung.setXepPhong(dichVuSuDungRequest.getXepPhong());
        dichVuSuDung.setSoLuongSuDung(dichVuSuDungRequest.getSoLuongSuDung());
        dichVuSuDung.setGiaSuDung(dichVuSuDungRequest.getGiaSuDung());
        dichVuSuDung.setTrangThai(dichVuSuDungRequest.getTrangThai());
        return phieuDichVuRepository.save(dichVuSuDung);
    }


    @Override
    public DichVuSuDung detailPhieuDichVu(Integer id) {
        return phieuDichVuRepository.findById(id).get();
    }

    @Override
    public DichVuSuDung updatePhieuDichVu(DichVuSuDungRequest dichVuSuDungRequest) {
        // Tìm dịch vụ đi kèm bằng ID
        DichVuSuDung dichVuSuDung = phieuDichVuRepository.findById(dichVuSuDungRequest.getId()).orElse(null);
        if (dichVuSuDung != null) {
            dichVuSuDung.setDichVu(dichVuSuDungRequest.getDichVu());
            dichVuSuDung.setXepPhong(dichVuSuDungRequest.getXepPhong());
            dichVuSuDung.setSoLuongSuDung(dichVuSuDungRequest.getSoLuongSuDung());
            dichVuSuDung.setTrangThai(dichVuSuDungRequest.getTrangThai());
            if (dichVuSuDungRequest.getGiaSuDung() == null) {
                dichVuSuDung.setGiaSuDung(0.0);
            } else {
                dichVuSuDung.setGiaSuDung(dichVuSuDungRequest.getGiaSuDung());
            }
            return phieuDichVuRepository.save(dichVuSuDung);
        }
        return null;
    }

    @Override
    public DichVuSuDung updateGSG(DichVuSuDungRequest dichVuSuDungRequest) {
        DichVuSuDung dichVuSuDung = phieuDichVuRepository.findById(dichVuSuDungRequest.getId()).orElse(null);
        List<DichVuSuDung> DVSDtrue = phieuDichVuRepository.getByTrangThai(dichVuSuDungRequest.getXepPhong().getId());
        if (dichVuSuDung != null) {
            dichVuSuDung.setDichVu(dichVuSuDungRequest.getDichVu());
            dichVuSuDung.setXepPhong(dichVuSuDungRequest.getXepPhong());
            dichVuSuDung.setSoLuongSuDung(dichVuSuDungRequest.getSoLuongSuDung());
            dichVuSuDung.setTrangThai(dichVuSuDungRequest.getTrangThai());
            if (dichVuSuDungRequest.getGiaSuDung() == null) {
                dichVuSuDung.setGiaSuDung(0.0);
            } else {
                dichVuSuDung.setGiaSuDung(dichVuSuDungRequest.getGiaSuDung());
            }


            for (DichVuSuDung dvsdTrue : DVSDtrue) {
                if (dvsdTrue.getDichVu().getId().equals(dichVuSuDung.getDichVu().getId())
                        && dvsdTrue.getGiaSuDung().equals(dichVuSuDung.getGiaSuDung())
                        && dvsdTrue.getId() != dichVuSuDung.getId()) {
                    System.out.println("update so luong");
                    dvsdTrue.setSoLuongSuDung(dvsdTrue.getSoLuongSuDung() + dichVuSuDung.getSoLuongSuDung());
                    phieuDichVuRepository.save(dvsdTrue);
                    phieuDichVuRepository.delete(dichVuSuDung);
                    return dvsdTrue;
                }
            }

            // Nếu không tìm thấy bản ghi nào khớp, lưu dichVuSuDung như bình thường
            return phieuDichVuRepository.save(dichVuSuDung);
        }
        return null;
    }


    @Override
    public void deletePhieuDichVu(Integer id) {
        phieuDichVuRepository.deleteById(id);
    }

    @Override
    public void updateStatus(Integer id) {
        DichVuSuDung dichVuSuDung = phieuDichVuRepository.findById(id).orElse(null);
        if (dichVuSuDung != null) {
            if (dichVuSuDung.getTrangThai()) {
                dichVuSuDung.setTrangThai(false);
            } else {
                dichVuSuDung.setTrangThai(true);
            }
            phieuDichVuRepository.save(dichVuSuDung);
        }
    }

    @Override
    public List<DichVuSuDung> getByIDXepPhong(int idXepPhong) {
        return phieuDichVuRepository.getByIDXepPhong(idXepPhong);
    }

    @Override
    public DichVuSuDung addPhieuDichVu2(DichVuSuDungRequest dichVuSuDungRequest) {
        List<DichVuSuDung> DVSDtrue = phieuDichVuRepository.getByTrangThai(dichVuSuDungRequest.getXepPhong().getId());

        for (DichVuSuDung dvsd : DVSDtrue) {
            if (dvsd.getDichVu().getId().equals(dichVuSuDungRequest.getDichVu().getId())
                    && dvsd.getGiaSuDung().equals(dichVuSuDungRequest.getGiaSuDung())) {
                dvsd.setSoLuongSuDung(dvsd.getSoLuongSuDung() + dichVuSuDungRequest.getSoLuongSuDung());
                return phieuDichVuRepository.save(dvsd);
            }
        }

        DichVuSuDung dichVuSuDung = new DichVuSuDung();
        dichVuSuDung.setDichVu(dichVuSuDungRequest.getDichVu());
        dichVuSuDung.setXepPhong(dichVuSuDungRequest.getXepPhong());
        dichVuSuDung.setSoLuongSuDung(dichVuSuDungRequest.getSoLuongSuDung());
        dichVuSuDung.setGiaSuDung(dichVuSuDungRequest.getGiaSuDung());
        dichVuSuDung.setTrangThai(true);
        return phieuDichVuRepository.save(dichVuSuDung);
    }

    @Override
    public void HuyDVSD(Integer id) {
        DichVuSuDung dichVuSuDung = phieuDichVuRepository.findById(id).orElse(null);
        dichVuSuDung.setTrangThai(false);
        phieuDichVuRepository.save(dichVuSuDung);
    }
}

