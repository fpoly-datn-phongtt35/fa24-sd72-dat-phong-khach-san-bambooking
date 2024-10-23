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

        for (DatPhong dp : listCheck) {
            existingCodes.add(dp.getMaDatPhong());
        }

        String newCode;
        do {
            newCode = generateRandomCode();
        } while (existingCodes.contains(newCode));

        return newCode;
    }

    public String generateUniqueCodeTTDP(List<ThongTinDatPhong> listCheck) {
        List<String> existingCodes = new ArrayList<>();

        for (ThongTinDatPhong dp : listCheck) {
            existingCodes.add(dp.getMaThongTinDatPhong());
        }

        String newCode;
        do {
            newCode = generateRandomCode();
        } while (existingCodes.contains(newCode));

        return newCode;
    }


}
