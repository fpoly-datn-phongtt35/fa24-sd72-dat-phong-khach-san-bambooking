<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <%@ taglib prefix = "c" uri = "http://java.sun.com/jsp/jstl/core" %>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <title>Dịch vụ</title>
</head>
<body>
<form action="/tien-nghi/add" method="post">
    <form action="/tien-nghi/update" method="post">
    <div class="mb-3">
        <label >ID:</label>
        <input type="text"  class="form-control" name="id" value="${TienNghi.id}" readonly>
    </div>
    <div class="mb-3">
        <label >Mã  tiện nghi:</label>
        <input type="text"  class="form-control" name="maTienNghi" value="${TienNghi.maTienNghi}">
    </div>

    <div class="mb-3">
        <label >Tên tiện nghi:</label>
        <input type="text"  class="form-control" name="tenTienNghi" value="${TienNghi.tenTienNghi}">
    </div>

    <div class="mb-3">
        <label >Số  lượng tồn:</label>
        <input type="text"  class="form-control" name="soLuongTon" value="${TienNghi.soLuongTon}">
    </div>

    <div class="mb-3">
        <label >Đơn giá:</label>
        <input type="number"  class="form-control" name="donGia" value="${TienNghi.donGia}">
    </div>

    <div class="mb-3">
        <label class="form-label">Trạng thái:</label>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="trangThai" id="Active" value="Hoạt động" checked  ${TienNghi.trangThai == 'Hoạt động' ? 'checked' : ''}>
            <label class="form-check-label">Hoạt động</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="trangThai" id="Inactive" value="Ngừng hoạt động" ${TienNghi.trangThai == 'Ngừng hoạt động' ? 'checked' : ''}>
            <label class="form-check-label">Ngừng hoạt động</label>
        </div>
    </div>

    <button type="submit" class="btn btn-success">Lưu</button>
    </form>
</form>
<table class="table">

    <thead>
    <tr>
        <th>STT</th>
        <th>ID</th>
        <th>Mã</th>
        <th>Tên tiện nghi</th>
        <th>Số lượng tồn</th>
        <th>Đơn giá</th>
        <th>Trạng thái</th>
        <th>Action</th>
    </tr>
    </thead>
    <tbody>
    <c:forEach items="${listTienNghi}" var="s" varStatus="i">
        <tr>
            <td>${i.index+1}</td>
            <td>${s.id}</td>
            <td>${s.maTienNghi}</td>
            <td>${s.tenTienNghi}</td>
            <td>${s.soLuongTon}</td>
            <td>${s.donGia}</td>
            <td>${s.trangThai}</td>
            <td>
                <a href="/tien-nghi/detail?id=${s.id}" class="btn btn-success" >Chi tiết</a>
                <a href="/tien-nghi/delete?id=${s.id}" class="btn btn-danger">Xóa</a>
                <a href="/tien-nghi/update-status?id=${s.id}" class="btn btn-warning">Ngưng hoạt động</a>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>
</body>
</html>