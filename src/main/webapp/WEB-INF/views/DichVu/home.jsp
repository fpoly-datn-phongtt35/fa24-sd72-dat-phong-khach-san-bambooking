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
<form action="/dich_vu/add" method="post">
    <div class="mb-3">
        <label >Tên dịch vụ:</label>
        <input type="text"  class="form-control" name="tenDichVu">
    </div>

    <div class="mb-3">
        <label >Đơn giá:</label>
        <input type="number"  class="form-control" name="donGia">
    </div>

    <div class="mb-3">
        <label for="hinhAnh">Chọn hình ảnh:</label>
        <input type="file" class="form-control" name="hinhAnh" id="hinhAnh" accept="image/*">
    </div>
    <div id="preview">
        <p>Ảnh đã chọn:</p>
        <img id="selectedImage" style="display: none; max-width: 100%;">
    </div>

    <script>
        document.getElementById('hinhAnh').addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                // Tạo URL tạm thời cho tệp ảnh đã chọn
                const filePath = URL.createObjectURL(file);

                // Hiển thị ảnh đã chọn
                const imgElement = document.getElementById('selectedImage');
                imgElement.src = filePath;
                imgElement.style.display = 'block';
            }
        });
    </script>
    <div class="mb-3">
        <label >Mô tả:</label>
        <input type="text"  class="form-control" name="moTa">
    </div>


    <div class="mb-3">
        <label class="form-label">Trạng thái:</label>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="trangThai" id="Active" value="Hoạt động" checked>
            <label class="form-check-label">Hoạt động</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="trangThai" id="Inactive" value="Ngừng hoạt động" >
            <label class="form-check-label">Ngừng hoạt động</label>
        </div>
    </div>

    <button type="submit" class="btn btn-success">Thêm dịch vụ</button>
</form>
<table class="table">

    <thead>
    <tr>
        <th>STT</th>
        <th>ID</th>
        <th>Tên dịch vụ</th>
        <th>Đơn giá</th>
        <th>Mô tả</th>
        <th>Trạng thái</th>
        <th>Action</th>
    </tr>
    </thead>
    <tbody>
    <c:forEach items="${list}" var="s" varStatus="i">
        <tr>
            <td>${i.index+1}</td>
            <td>${s.id}</td>
            <td>${s.tenDichVu}</td>
            <td>${s.donGia}</td>
            <td>${s.moTa}</td>
            <td>${s.trangThai}</td>
            <td>
                <a href="/dich_vu/detail?id=${s.id}" class="btn btn-success">Chi tiết</a>
                <a href="/dich_vu/update-status?id=${s.id}" class="btn btn-warning">Ngưng hoạt động</a>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>
</body>
</html>