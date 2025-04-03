package com.example.datn.config;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;

@Component
public class PasswordGenerator {
    private static final String  characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    private static final int password_length = 8;

    public static String generateRandomPassword(){
        SecureRandom random = new SecureRandom();
        StringBuilder password = new StringBuilder(password_length);

        for (int i = 0; i < password_length; i++){
            int index = random.nextInt(characters.length());
            password.append(characters.charAt(index));
        }

        return password.toString();
    }

}
