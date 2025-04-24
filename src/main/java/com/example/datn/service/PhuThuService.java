package com.example.datn.service;

import com.example.datn.dto.request.PhuThuRequest;
import com.example.datn.model.PhuThu;
import org.springframework.stereotype.Service;

@Service
public interface PhuThuService {
    PhuThu addPhuThu(PhuThuRequest phuThuRequest);
    PhuThu updatePhuThu(PhuThuRequest phuThuRequest);
    PhuThu checkIfPhuThuExists(Integer idXepPhong);
}
