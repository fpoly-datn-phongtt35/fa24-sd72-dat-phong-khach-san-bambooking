package com.example.datn.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
@FunctionalInterface
public interface UploadImageFile {
    String uploadImage(MultipartFile file) throws IOException;
}
