package com.example.datn.config;
import static spark.Spark.staticFiles;

import java.nio.file.Paths;

import com.example.datn.model.PayOS;
import com.example.datn.model.ThanhToan;
import org.springframework.beans.factory.annotation.Value;

public class Server {
    @Value("${clientId}")
    private String clientId;
    @Value("${apiKey}")
    private String apiKey;
    @Value("${checksumKey}")
    private String checksumKey;
    public PayOS buildPayOS(){
        PayOS payOS = new PayOS(clientId, apiKey, checksumKey);
        return payOS;
    }
}