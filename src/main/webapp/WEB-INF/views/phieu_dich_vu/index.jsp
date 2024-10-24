<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <%@ page contentType="text/html; charset=UTF-8" %>
</head>
<body>
<h2 class="text-center mb-5">Quản lý phiếu dịch vụ</h2>
<div class="row">
    <div class="col-md-8 m-3">
        <a href="/phieu-dich-vu/insert" class="btn btn-success mt-5 mb-5">Thêm phiếu dịch vụ</a>
    </div>
    <div class="col-md-3 m-3">
        <form class="d-flex" action="/phieu-dich-vu/search" method="get">
            <input class="form-control me-2" type="search" name="keyword" placeholder="Tìm kiếm" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Tìm kiếm</button>
        </form>
    </div>
</div>
<table class="table table-hover">
    <thead>
    <tr>
        <th>STT</th>
        <th>ID phiếu dịch vụ</th>
        <th>Tên dịch vụ</th>
        <th>Số lượng sử dụng</th>
        <th>Thành tiền</th>
        <th>Chức năng</th>
    </tr>
    </thead>
    <tbody>
    <c:forEach items="${list}" var="phieudv" varStatus="i">
        <tr>
            <td>${i.index+1}</td>
            <td>${phieudv.id}</td>
            <td>${phieudv.dichVu.tenDichVu}</td>
            <td>${phieudv.soLuongSuDung}</td>
            <td>${phieudv.thanhTien}</td>
            <td>
                <form action="/phieu-dich-vu/detail" method="post">
                    <input type="hidden" name="id" value="${phieudv.id}">
                    <button type="submit" class="btn btn-info">Chi tiết</button>
                </form>
                <a class="btn btn-danger" href="/phieu-dich-vu/delete?id=${phieudv.id}">Remove</a>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>
<!-- Modal -->
<div class="modal fade" id="detailModal" tabindex="-1" aria-labelledby="detailModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="detailModalLabel">Chi tiết phiếu dịch vụ</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form action="/phieu-dich-vu/update" method="post">
                    <input type="hidden" id="id" name="id" value="${dichVuSuDung.id}">
                    <div class="mb-3">
                        <label>Tên dịch vụ</label>
                        <select name="dichVu">
                            <c:forEach items="${listDichVu}" var="dv">
                                <option value="${dv.id}"
                                        <c:if test="${dichVuSuDung.dichVu.id == dv.id}">
                                            selected
                                        </c:if>
                                >${dv.tenDichVu}</option>
                            </c:forEach>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label class="form-label">Số lượng sử dụng</label>
                        <input type="number" class="form-control" id="soLuongSuDung" name="soLuongSuDung"
                               value="${dichVuSuDung.soLuongSuDung}">
                    </div>
                    <div class="mb-3">
                        <label class="form-label">Thành tiền</label>
                        <input type="number" class="form-control" id="thanhTien" name="thanhTien"
                               value="${dichVuSuDung.thanhTien}">
                    </div>
                    <button type="submit" class="btn btn-primary">Cập nhật</button>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
            </div>
        </div>
    </div>
</div>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        var hasDetails = ${not empty dichVuSuDung};
        if (hasDetails) {
            var modal = new bootstrap.Modal(document.getElementById('detailModal'), {});
            modal.show();
        }
    });
</script>
</body>
</html>