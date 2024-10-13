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
    <title>Chi tiết hóa đơn</title>
</head>
<body>
<h2 class="text-center">Quản lý chi tiết hóa đơn</h2>
<a class="btn btn-success m-3" href="/chi-tiet-hoa-don/view-add">Thêm chi tiết hóa đơn mới</a>
<table class="table table-hover">
    <thead>
    <tr>
        <th>STT</th>
        <th>Id phiếu dịch vụ</th>
        <th>Id hóa đơn</th>
        <th>Id phòng</th>
        <th>Hình thức thuê</th>
        <th>Thời gian ra</th>
        <th>Thời gian thuê</th>
        <th>Tiền phòng</th>
        <th>Tiền dịch vụ</th>
        <th>Tổng tiền</th>
        <th>Chức năng</th>
    </tr>
    </thead>
    <tbody>
    <c:forEach items="${list}" var="cthd" varStatus="i">
        <tr>
            <td>${i.index+1}</td>
            <td>${cthd.phieuDichVu.id}</td>
            <td>${cthd.hoaDon.id}</td>
            <td>${cthd.phong.id}</td>
            <td>${cthd.hinhThucThue}</td>
            <td>${cthd.thoiGianRa}</td>
            <td>${cthd.thoiGianThue}</td>
            <td>${cthd.tienPhong}</td>
            <td>${cthd.tienDichVu}</td>
            <td>${cthd.tongTien}</td>
            <td>
                <a class="btn btn-info" href="/chi-tiet-hoa-don/detail/${cthd.id}">Chi tiết</a>
                <a class="btn btn-danger" href="/chi-tiet-hoa-don/delete/${cthd.id}">Xóa</a>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>
</body>
</html>