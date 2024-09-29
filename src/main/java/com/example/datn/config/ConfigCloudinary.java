package com.example.datn.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class ConfigCloudinary {

    @Bean
    public Cloudinary configKey(){
        Map<String , String> config = new HashMap<>();
        config.put("cloud_name", "dy9md2des");
        config.put("api_key", "695118656887869");
        config.put("api_secret", "62RoqL3FAHJk8zryVmXnL9A5ZMI");
        return new Cloudinary(config);
    }
}
