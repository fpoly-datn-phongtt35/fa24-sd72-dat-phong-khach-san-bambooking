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
<h2 class="text-center">Cập nhật hóa đơn chi tiết</h2>
<body class="container">
<form action="/chi-tiet-hoa-don/add" method="post">
    <div class="mb-3">
        <label>ID</label>
        <input type="text" class="form-control" name="id" value="${cthdDetail.id}" readonly>
    </div>
    <div class="mb-3">
        <label>Id phiếu dịch vụ</label>
        <select class="form-select" aria-label="Default select example" name="phieuDichVu">
            <c:forEach items="${listPhieuDichVu}" var="pdv">
                <option value="${pdv.id}"
                    ${cthdDetail.phieuDichVu.id == pdv.id ?'selected':''}
                >${pdv.id}</option>
            </c:forEach>
        </select>
    </div>
    <div class="mb-3">
        <label>Id hóa đơn</label>
        <select class="form-select" aria-label="Default select example" name="hoaDon">
            <c:forEach items="${listHoaDon}" var="hd">
                <option value="${hd.id}"
                    ${cthdDetail.hoaDon.id == hd.id ? 'selected':''}
                >${hd.id}</option>
            </c:forEach>
        </select>
    </div>
    <div class="mb-3">
        <label>Id phòng</label>
        <select class="form-select" aria-label="Default select example" name="phong">
            <c:forEach items="${listPhong}" var="p">
                <option value="${p.id}"
                    ${cthdDetail.phong.id == p.id ? 'selected':''}
                >${p.id}</option>
            </c:forEach>
        </select>
    </div>
    <div class="mb-3">
        <label>Hình thức thuê</label>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="hinhThucThue" value="Theo giờ"
            <c:if test="${cthdDetail.hinhThucThue == 'Theo giờ'}">checked</c:if>
            >
            <label class="form-check-label">Theo giờ</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="hinhThucThue" value="Qua đêm"
                   <c:if test="${cthdDetail.hinhThucThue == 'Qua đêm'}">checked</c:if>>
            <label class="form-check-label">Theo đêm</label>
        </div>
    </div>
    <div class="mb-3">
        <label>Thời gian ra</label>
        <input type="datetime-local" class="form-control" name="thoiGianRa" value="${cthdDetail.thoiGianRa}">
    </div>
    <div class="mb-3">
        <label>Thời gian thuê</label>
        <input type="datetime-local" class="form-control" name="thoiGianThue" value="${cthdDetail.thoiGianThue}">
    </div>
    <div class="mb-3">
        <label>Tiền phòng</label>
        <input type="text" class="form-control" name="tienPhong" value="${cthdDetail.tienPhong}">
    </div>
    <div class="mb-3">
        <label>Tiền dịch vụ</label>
        <input type="text" class="form-control" name="tienDichVu" value="${cthdDetail.tienDichVu}">
    </div>
    <div class="mb-3">
        <label>Tổng tiền</label>
        <input type="text" class="form-control" name="tongTien" value="${cthdDetail.tongTien}">
    </div>
    <div>
        <button class="btn btn-success">Cập nhật hóa đơn chi tiết</button>
    </div>
</form>
</body>
</html>