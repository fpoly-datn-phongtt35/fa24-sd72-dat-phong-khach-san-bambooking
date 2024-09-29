package com.example.datn.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface UploadImageFile {
    String UploadImage(MultipartFile file) throws IOException;
}
