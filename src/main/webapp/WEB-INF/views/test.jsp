<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Single Page Application Demo</title>
    <%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <%@ taglib prefix = "c" uri = "http://java.sun.com/jsp/jstl/core" %>

    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            display: flex;
        }
        .sidebar {
            height: 100vh;
            width: 200px;
            background-color: #333;
            color: white;
            padding: 15px;
            box-sizing: border-box;
        }
        .sidebar a {
            color: white;
            text-decoration: none;
            display: block;
            padding: 10px 0;
            margin: 10px 0;
            transition: background-color 0.3s;
        }
        .sidebar a:hover {
            background-color: #575757;
        }
        .content {
            flex-grow: 1;
            padding: 20px;
        }
        .page {
            display: none;
        }
        .page.active {
            display: block;
        }
    </style>
</head>
<body>
<div class="sidebar">
    <h2>Menu</h2>
    <a href="#" data-target="home">Trang Chủ</a>
    <a href="#" data-target="about">Giới Thiệu</a>
    <a href="#" data-target="services">Dịch Vụ</a>
    <a href="#" data-target="contact">Liên Hệ</a>
</div>
<div class="content">
    <div id="home" class="page active">
        <h1>Trang Chủ</h1>
        <p>Chào mừng đến với trang chủ của chúng tôi!</p>
    </div>
    <div id="about" class="page">
        <h1>Giới Thiệu</h1>
        <p>Đây là trang giới thiệu.</p>
    </div>
    <div id="services" class="page">
        <h1>Dịch Vụ</h1>
        <p>Đây là trang dịch vụ của chúng tôi.</p>
    </div>
    <div id="contact" class="page">
        <h1>Liên Hệ</h1>
        <p>Đây là trang liên hệ.</p>
    </div>
</div>
<script>
    document.querySelectorAll('.sidebar a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            document.getElementById(this.getAttribute('data-target')).classList.add('active');
        });
    });
</script>
</body>
</html>