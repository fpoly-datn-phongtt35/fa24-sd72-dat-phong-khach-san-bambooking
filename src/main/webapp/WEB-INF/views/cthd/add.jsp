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
<h2 class="text-center">Thêm hóa đơn chi tiết</h2>
<body class="container">
<form action="/chi-tiet-hoa-don/add" method="post">
    <div class="mb-3">
        <label>Id phiếu dịch vụ</label>
        <select class="form-select" aria-label="Default select example" name="phieuDichVu">
            <c:forEach items="${listPhieuDichVu}" var="pdv">
                <option value="${pdv.id}">${pdv.id}</option>
            </c:forEach>
        </select>
    </div>
    <div class="mb-3">
        <label>Id hóa đơn</label>
        <select class="form-select" aria-label="Default select example" name="hoaDon">
            <c:forEach items="${listHoaDon}" var="hd">
                <option value="${hd.id}">${hd.id}</option>
            </c:forEach>
        </select>
    </div>
    <div class="mb-3">
        <label>Id phòng</label>
        <select class="form-select" aria-label="Default select example" name="phong">
            <c:forEach items="${listPhong}" var="p">
                <option value="${p.id}">${p.id}</option>
            </c:forEach>
        </select>
    </div>
    <div class="mb-3">
        <label>Hình thức thuê</label>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="hinhThucThue" value="Theo giờ" checked>
            <label class="form-check-label">Theo giờ</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="hinhThucThue" value="Qua đêm">
            <label class="form-check-label">Qua đêm</label>
        </div>
    </div>
    <div class="mb-3">
        <label>Thời gian ra</label>
        <input type="datetime-local" class="form-control" name="thoiGianRa">
    </div>
    <div class="mb-3">
        <label>Thời gian thuê</label>
        <input type="datetime-local" class="form-control" name="thoiGianThue">
    </div>
    <div class="mb-3">
        <label>Tiền phòng</label>
        <input type="text" class="form-control" name="tienPhong">
    </div>
    <div class="mb-3">
        <label>Tiền dịch vụ</label>
        <input type="text" class="form-control" name="tienDichVu">
    </div>
    <div class="mb-3">
        <label>Tổng tiền</label>
        <input type="text" class="form-control" name="tongTien">
    </div>
    <div>
        <button class="btn btn-success">Thêm hóa đơn chi tiết</button>
    </div>
</form>
</body>
</html>