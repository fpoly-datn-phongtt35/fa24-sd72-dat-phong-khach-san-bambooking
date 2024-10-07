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
    <title>Nhân viên</title>
</head>
<body>
<div class="row">
    <div class="col-md-8 m-3">
        <a href="/khach-hang/view-add" class="btn btn-success">Thêm khách hàng</a>
    </div>
    <div class="col-md-3 m-3">
        <form class="d-flex" action="/khach-hang/search" method="Get">
            <input class="form-control me-2" type="search" name="keyword" placeholder="Tìm kiếm" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Tìm kiếm</button>
        </form>
    </div>
</div>
<h2 class="text-center ; mb-5">Quản lý khách hàng</h2>
<table class="table table-hover">
    <thead>
    <tr>
        <th>STT</th>
        <th>Họ và tên</th>
        <th>Ngày sinh</th>
        <th>Giới tính</th>
        <th>Địa chỉ</th>
        <th>Số điện thoại</th>
        <th>Email</th>
        <th>Trạng thái</th>
        <th></th>
    </tr>
    </thead>
    <tbody>
    <c:forEach items="${list}" var="khachHang" varStatus="i">
        <tr>
            <td>${i.index+1}</td>
            <td>${khachHang.hoTen}</td>
            <td>${khachHang.ngaySinh}</td>
            <td>${khachHang.gioiTinh}</td>
            <td>${khachHang.diaChi}</td>
            <td>${khachHang.sdt}</td>
            <td>${khachHang.email}</td>
            <td>${khachHang.trangThai}</td>
            <td>
                <a class="btn btn-info" href="/khach-hang/detail/${khachHang.id}">Thông tin</a>
                <a class="btn btn-danger" href="/khach-hang/status/${khachHang.id}">Đổi trạng thái</a>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>
</body>
</html>