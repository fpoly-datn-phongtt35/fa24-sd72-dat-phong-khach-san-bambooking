package com.example.datn.utilities;

import com.example.datn.model.DatPhong;
import com.example.datn.model.ThongTinDatPhong;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

public class UniqueDatPhongCode {
    public String generateRandomCode() {
        String str = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        Random random = new Random();
        StringBuilder code = new StringBuilder(8);

        for (int i = 0; i < 8; i++) {
            code.append(str.charAt(random.nextInt(str.length())));
        }
        return code.toString();
    }
    public String generateUniqueCode(List<DatPhong> listCheck) {
        List<String> existingCodes = new ArrayList<>();

        // Lấy tất cả các mã hiện có trong danh sách và lưu vào Set để kiểm tra nhanh hơn
        for (DatPhong dp : listCheck) {
            existingCodes.add(dp.getMaDatPhong()); // Giả sử DatPhong có phương thức getMaDatPhong()
        }

        String newCode;
        do {
            newCode = generateRandomCode();
        } while (existingCodes.contains(newCode)); // Tiếp tục tạo lại nếu mã bị trùng

        return newCode;
    }

    public String generateUniqueCodeTTDP(List<ThongTinDatPhong> listCheck) {
        List<String> existingCodes = new ArrayList<>();

        // Lấy tất cả các mã hiện có trong danh sách và lưu vào Set để kiểm tra nhanh hơn
        for (ThongTinDatPhong dp : listCheck) {
            existingCodes.add(dp.getMaThongTinDatPhong()); // Giả sử DatPhong có phương thức getMaDatPhong()
        }

        String newCode;
        do {
            newCode = generateRandomCode();
        } while (existingCodes.contains(newCode)); // Tiếp tục tạo lại nếu mã bị trùng

        return newCode;
    }


}
