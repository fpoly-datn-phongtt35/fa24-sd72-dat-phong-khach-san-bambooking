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
    <title>Tài khoản</title>
</head>
<body class="container">
<h2 class="text-center m-3">Cập nhật tài khoản</h2>
<form action="/tai-khoan/update" method="post">
    <div class="mb-3">
        <label>Id tài khoản</label>
        <input type="text" class="form-control" name="id" value="${tkDetail.id}" readonly>
    </div>
    <div class="mb-3">
        <label>Tên nhân viên</label>
        <select class="form-select" aria-label="Default select example" name="nhanVien">
            <c:forEach items="${listNhanVien}" var="nv">
                <option value="${nv.id}"
                    ${tkDetail.nhanVien.id == nv.id ? 'selected':''}
                >${nv.hoTen}</option>
            </c:forEach>
        </select>
    </div>
    <div class="mb-3">
        <label>Tên đăng nhập</label>
        <input type="text" class="form-control" name="tenDangNhap" value="${tkDetail.tenDangNhap}">
    </div>
    <div class="mb-3">
        <label>Mật khẩu</label>
        <input type="text" class="form-control" name="matKhau" value="${tkDetail.matKhau}">
    </div>
    <div class="mb-3">
        <label>Trạng thái</label>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="trangThai" value="Hoạt động"
                ${tkDetail.trangThai == 'Hoạt động'?'checked':''}
            >
            <label class="form-check-label">Hoạt động</label>
        </div>
        <div class="form-check form-check-inline">
            <input class="form-check-input" type="radio" name="trangThai" value="Ngừng hoạt động"
            ${tkDetail.trangThai == 'Ngừng hoạt động'?'checked':''}>
            <label class="form-check-label">Ngừng hoạt động</label>
        </div>
    </div>
    <div>
        <button class="btn btn-success">Cập nhật tài khoản</button>
    </div>
</form>
</body>
</html>