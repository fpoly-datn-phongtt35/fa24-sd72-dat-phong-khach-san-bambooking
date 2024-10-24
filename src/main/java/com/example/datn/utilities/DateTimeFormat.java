package com.example.datn.utilities;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class DateTimeFormat {
    public String formatTime(String isoTime) {
        LocalDateTime dateTime = LocalDateTime.parse(isoTime, DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("hh:mm a dd-M-yyyy");

        return dateTime.format(formatter);
    }
    // Chuyển đổi isoTime thành LocalDate
    public LocalDate formatDate(String isoDate) {
        return LocalDate.parse(isoDate, DateTimeFormatter.ISO_LOCAL_DATE);
    }

}
