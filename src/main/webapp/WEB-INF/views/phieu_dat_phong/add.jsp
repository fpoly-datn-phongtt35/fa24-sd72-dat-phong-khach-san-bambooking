<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <title>Phiếu đặt phòng</title>
</head>
<body class="container">
<h2 class="text-center">Thêm phiếu đặt phòng</h2>
<form action="/phieu-dat-phong/add" method="post">
    <div class="mb-3">
        <label>Tên khách hàng</label>
        <select name="khachHang">
            <c:forEach items="${listKhachHang}" var="kh">
                <option value="${kh.id}">${kh.hoTen}</option>
            </c:forEach>
        </select>
    </div>
    <div class="mb-3">
        <label>Loại phòng</label>
        <select name="loaiPhong">
            <c:forEach items="${listLoaiPhong}" var="lp">
                <option value="${lp.id}">${lp.tenLoaiPhong}</option>
            </c:forEach>
        </select>
    </div>
    <div class="mb-3">
        <label>Mã đặt phòng</label>
        <input type="text" class="form-control" name="maDatPhong">
    </div>
    <div class="mb-3">
        <label>Thời gian vào dự kiến</label>
        <input type="date" class="form-control" name="thoiGianVaoDuKien">
    </div>
    <div class="mb-3">
        <label>Thời gian vào dự kiến</label>
        <input type="date" class="form-control" name="thoiGianRaDuKien">
    </div>
    <div class="mb-3">
        <label>Số người</label>
        <input type="text" class="form-control" name="soNguoi">
    </div>
    <div class="mb-3">
        <label>Số phòng</label>
        <input type="text" class="form-control" name="soPhong">
    </div>
    <div class="mb-3">
        <label>Trạng thái</label>
        <select name="trangThai">
            <option value="Đã đặt phòng">Đã đặt phòng</option>
        </select>
    </div>
    <div>
        <button class="btn btn-success">Lưu</button>
    </div>
</form>
</body>
</html>