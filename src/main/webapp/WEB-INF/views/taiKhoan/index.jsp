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
<h2 class="text-center">Quản lý tài khoản</h2>
<a class="btn btn-success m-3" href="/tai-khoan/view-add">Thêm tài khoản</a>
<table class="table table-hover">
    <thead>
    <tr>
        <th>STT</th>
        <th>Id nhân viên</th>
        <th>Tên nhân viên</th>
        <th>Tên đăng nhập</th>
        <th>Mật khẩu</th>
        <th>Trạng thái</th>
        <th>Chức năng</th>
    </tr>
    </thead>
    <tbody>
    <c:forEach items="${list}" var="tk" varStatus="i">
        <tr>
            <td>${i.index+1}</td>
            <td>${tk.nhanVien.id}</td>
            <td>${tk.nhanVien.hoTen}</td>
            <td>${tk.tenDangNhap}</td>
            <td>${tk.matKhau}</td>
            <td>${tk.trangThai}</td>
            <td>
                <a class="btn btn-info" href="/tai-khoan/detail/${tk.id}">Thông tin</a>
                <a class="btn btn-warning" href="/tai-khoan/updateStatus/${tk.id}">Đổi trạng thái</a>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>
</body>
</html>