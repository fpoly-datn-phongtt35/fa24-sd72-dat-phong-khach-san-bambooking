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
        <a href="/phieu-dat-phong/insert" class="btn btn-success">Thêm</a>
    </div>
    <div class="col-md-3 m-3">
        <form class="d-flex" action="/phieu_dat_phong/search" method="Get">
            <input class="form-control me-2" type="search" name="maDatPhong" placeholder="Tìm kiếm" aria-label="Search">
            <button class="btn btn-outline-success" type="submit">Tìm kiếm</button>
        </form>
    </div>
</div>
<h2 class="text-center ; mb-5">Quản lý phiếu đặt phòng</h2>
<table class="table table-hover">
    <thead>
    <tr>
        <th>Id</th>
        <th>Tên Khách hàng</th>
        <th>Loại phòng</th>
        <th>Mã đặt phòng</th>
        <th>Thời gian đặt</th>
        <th>Thời gian vào</th>
        <th>Thời gian ra</th>
        <th>Số người</th>
        <th>Số phòng</th>
        <th>Trạng thái</th>
        <th>Chức năng</th>
    </tr>
    </thead>
    <tbody>
    <c:forEach items="${list}" var="datPhong" varStatus="i">
        <tr>
            <td>${datPhong.id}</td>
            <td>${datPhong.khachHang.hoTen}</td>
            <td>${datPhong.loaiPhong.tenLoaiPhong}</td>
            <td>${datPhong.maDatPhong}</td>
            <td>${datPhong.thoiGianDat}</td>
            <td>${datPhong.thoiGianVaoDuKien}</td>
            <td>${datPhong.thoiGianRaDuKien}</td>
            <td>${datPhong.soNguoi}</td>
            <td>${datPhong.soPhong}</td>
            <td>${datPhong.trangThai}</td>
            <td>
                <form action="/phieu-dat-phong/detail" method="post">
                    <input type="hidden" name="id" value="${datPhong.id}">
                    <button type="submit" class="btn btn-info">Chi tiết</button>
                </form>
                <a href="/phieu-dat-phong/delete?id=${datPhong.id}" class="btn btn-danger">Xóa</a>
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
                <h5 class="modal-title" id="detailModalLabel">Chi tiết phiếu đặt phòng</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form id="idFormUpdate" action="/phieu-dat-phong/update" method="post">
                    <!-- ID ẩn để xác định bản ghi cần cập nhật -->
                    <input type="hidden" name="id" value="${datPhong.id}">

                    <div class="mb-3">
                        <label>Tên khách hàng</label>
                        <select name="khachHang" class="form-control">
                            <c:forEach items="${listKhachHang}" var="kh">
                                <option value="${kh.id}"
                                        <c:if test="${datPhong.khachHang.id == kh.id}">
                                            selected
                                        </c:if>
                                >${kh.hoTen}</option>
                            </c:forEach>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label>Loại phòng</label>
                        <select name="loaiPhong" class="form-control">
                            <c:forEach items="${listLoaiPhong}" var="lp">
                                <option value="${lp.id}"
                                        <c:if test="${datPhong.loaiPhong.id == lp.id}">
                                            selected
                                        </c:if>
                                >${lp.tenLoaiPhong}</option>
                            </c:forEach>
                        </select>
                    </div>

                    <div class="mb-3">
                        <label>Mã đặt phòng</label>
                        <input type="text" class="form-control" name="maDatPhong" value="${datPhong.maDatPhong}">
                    </div>

                    <div class="mb-3">
                        <label>Thời gian vào dự kiến</label>
                        <input type="datetime-local" class="form-control" name="thoiGianVaoDuKien" value="${formattedThoiGianVaoDuKien}">
                    </div>

                    <div class="mb-3">
                        <label>Thời gian ra dự kiến</label>
                        <input type="datetime-local" class="form-control" name="thoiGianRaDuKien" value="${formattedThoiGianRaDuKien}">
                    </div>

                    <div class="mb-3">
                        <label>Số người</label>
                        <input type="number" class="form-control" name="soNguoi" value="${datPhong.soNguoi}">
                    </div>

                    <div class="mb-3">
                        <label>Số phòng</label>
                        <input type="number" class="form-control" name="soPhong" value="${datPhong.soPhong}">
                    </div>
                    <div class="mb-3">
                        <label>Thời gian đặt</label>
                        <input type="text" class="form-control" name="thoiGianDat" value="${datPhong.thoiGianDat}"  readonly>
                    </div>
                    <div class="mb-3">
                        <label>Trạng thái</label>
                        <select name="trangThai">
                            <option value="Đã đặt phòng">Đã đặt phòng</option>
                        </select>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                <button type="submit" class="btn btn-success" form="idFormUpdate">Cập nhật</button>
            </div>
        </div>
    </div>
</div>

<script>
    document.addEventListener("DOMContentLoaded", function() {
        var hasDetails = ${not empty datPhong};
        if (hasDetails) {
            var modal = new bootstrap.Modal(document.getElementById('detailModal'), {});
            modal.show();
        }
    });
</script>

</body>
</html>