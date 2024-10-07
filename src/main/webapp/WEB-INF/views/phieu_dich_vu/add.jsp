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
    <title>Phiếu dịch vụ</title>
</head>
<body class="container">
<h2 class="text-center">Thêm phiếu dịch vụ</h2>
<form action="/phieu-dich-vu/add" method="post">
    <div class="mb-3">
        <label>Tên dịch vụ</label>
        <select name="dichVu">
            <c:forEach items="${listDichVu}" var="dv">
                <option value="${dv.id}">${dv.tenDichVu}</option>
            </c:forEach>
        </select>
    </div>
    <div class="mb-3">
        <label>Số lượng sử dụng</label>
        <input type="text" class="form-control" name="soLuongSuDung">
    </div>
    <div class="mb-3">
        <label>Thành Tiền</label>
        <input type="text" class="form-control" name="thanhTien">
    </div>

    <div>
        <button class="btn btn-success">Lưu</button>
    </div>
</form>

</body>
</html>