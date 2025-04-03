package com.example.datn.utilities;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class CommonUtils {

    public static String generateCode() {
        Random random = new Random();
        int randomNum = 10000 + random.nextInt(90000);
        return String.valueOf(randomNum);
    }
}
