<!doctype html>
<html lang="en">
<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <title>Quản lý phòng</title>
</head>
<body>

    <c:forEach items="${listLoaiPhong}" varStatus="i" var="lp">
        
    <div style="display: flex;flex-direction: column;align-items: center;gap: 50px;padding-top: 50px;">
        <div style="width: 1200px;padding: 20px;border: 1px solid #ccc; border-radius: 5px;">
            <h1>${lp.tenLoaiPhong}</h1>
            <c:forEach items="${model['listPhong' + lp.id]}" var="phong" varStatus="i">
                <div  style="color: black;padding: 10px;margin: 10px;display: inline-block;width: 200px;height: 230px;border-radius: 5px;position: relative;background: #28a745;">
                    <div class="card-body" style="display: flex;flex-direction: column; justify-content: space-between;height: 100%;">
                        <h5 class="card-title">${phong.tenPhong}</h5>
                        <p  style="margin-top:40px" class="card-text">Giá theo giờ:${phong.loaiPhong.giaTheoGio}</p>
                        <div style="display: flex;align-items: center;margin-top: 10px;">
                            <div  style="margin-right: 40px" class="room-status">${phong.trangThai}</div>
                            <div>${phong.tinhTrang}</div>
                        </div>
                        <a href="#" class="btn btn-primary">Xem chi tiết</a>
                    </div>
                </div>
            </c:forEach>
        </div>
    </c:forEach>
<%--    <div style="display: flex;flex-direction: column;align-items: center;gap: 50px;padding-top: 50px;">--%>
<%--        <div style="width: 1200px;padding: 20px;border: 1px solid #ccc; border-radius: 5px;">--%>
<%--            <h1>Phòng đơn</h1>--%>
<%--            <c:forEach items="${listPhongDon}" var="phong" varStatus="i">--%>
<%--                <div  style="color: black;padding: 10px;margin: 10px;display: inline-block;width: 200px;height: 230px;border-radius: 5px;position: relative;background: #28a745;">--%>
<%--                    <div class="card-body" style="display: flex;flex-direction: column; justify-content: space-between;height: 100%;">--%>
<%--                        <h5 class="card-title">${phong.tenPhong}</h5>--%>
<%--                        <p  style="margin-top:40px" class="card-text">Giá theo giờ:${phong.loaiPhong.giaTheoGio}</p>--%>
<%--                        <div style="display: flex;align-items: center;margin-top: 10px;">--%>
<%--                            <div  style="margin-right: 40px" class="room-status">${phong.trangThai}</div>--%>
<%--                            <div>${phong.tinhTrang}</div>--%>
<%--                        </div>--%>
<%--                        <a href="#" class="btn btn-primary">Xem chi tiết</a>--%>
<%--                    </div>--%>
<%--                </div>--%>
<%--            </c:forEach>--%>
<%--        </div>--%>

<%--        <div style="width: 1200px;padding: 20px;border: 1px solid #ccc; border-radius: 5px;">--%>
<%--            <h1>Phòng đôi</h1>--%>
<%--            <c:forEach items="${listPhongDoi}" var="phong" varStatus="i">--%>
<%--                <div  style="color: black;padding: 10px;margin: 10px;display: inline-block;width: 200px;height: 230px;border-radius: 5px;position: relative;background: #28a745;">--%>
<%--                    <div class="card-body" style="display: flex;flex-direction: column; justify-content: space-between;height: 100%;">--%>
<%--                        <h5 class="card-title">${phong.tenPhong}</h5>--%>
<%--                        <p  style="margin-top:40px" class="card-text">Giá theo giờ:${phong.loaiPhong.giaTheoGio}</p>--%>
<%--                        <div style="display: flex;align-items: center;margin-top: 10px;">--%>
<%--                            <div  style="margin-right: 40px" class="room-status">${phong.trangThai}</div>--%>
<%--                            <div>${phong.tinhTrang}</div>--%>
<%--                        </div>--%>
<%--                        <a href="#" class="btn btn-primary">Xem chi tiết</a>--%>
<%--                    </div>--%>
<%--                </div>--%>
<%--            </c:forEach>--%>
<%--        </div>--%>

<%--        <div style="width: 1200px;padding: 20px;border: 1px solid #ccc; border-radius: 5px;">--%>
<%--            <h1>Phòng một giường đôi</h1>--%>
<%--            <c:forEach items="${listPhongMot}" var="phong" varStatus="i">--%>
<%--                <div  style="color: black;padding: 10px;margin: 10px;display: inline-block;width: 200px;height: 230px;border-radius: 5px;position: relative;background: #28a745;">--%>
<%--                    <div class="card-body" style="display: flex;flex-direction: column; justify-content: space-between;height: 100%;">--%>
<%--                        <h5 class="card-title">${phong.tenPhong}</h5>--%>
<%--                        <p  style="margin-top:40px" class="card-text">Giá theo giờ:${phong.loaiPhong.giaTheoGio}</p>--%>
<%--                        <div style="display: flex;align-items: center;margin-top: 10px;">--%>
<%--                            <div  style="margin-right: 40px" class="room-status">${phong.trangThai}</div>--%>
<%--                            <div>${phong.tinhTrang}</div>--%>
<%--                        </div>--%>
<%--                        <a href="#" class="btn btn-primary">Xem chi tiết</a>--%>
<%--                    </div>--%>
<%--                </div>--%>
<%--            </c:forEach>--%>
<%--        </div>--%>

<%--        <div style="width: 1200px;padding: 20px;border: 1px solid #ccc; border-radius: 5px;">--%>
<%--            <h1>Phòng gia đình</h1>--%>
<%--            <c:forEach items="${listPhongGD}" var="phong" varStatus="i">--%>
<%--                <div  style="color: black;padding: 10px;margin: 10px;display: inline-block;width: 200px;height: 230px;border-radius: 5px;position: relative;background: #28a745;">--%>
<%--                    <div class="card-body" style="display: flex;flex-direction: column; justify-content: space-between;height: 100%;">--%>
<%--                        <h5 class="card-title">${phong.tenPhong}</h5>--%>
<%--                        <p  style="margin-top:40px" class="card-text">Giá theo giờ:${phong.loaiPhong.giaTheoGio}</p>--%>
<%--                        <div style="display: flex;align-items: center;margin-top: 10px;">--%>
<%--                            <div  style="margin-right: 40px" class="room-status">${phong.trangThai}</div>--%>
<%--                            <div>${phong.tinhTrang}</div>--%>
<%--                        </div>--%>
<%--                        <a href="#" class="btn btn-primary">Xem chi tiết</a>--%>
<%--                    </div>--%>
<%--                </div>--%>
<%--            </c:forEach>--%>
<%--        </div>--%>

<%--        <div style="width: 1200px;padding: 20px;border: 1px solid #ccc; border-radius: 5px;">--%>
<%--            <h1>Phòng VIP</h1>--%>
<%--            <c:forEach items="${listPhongVIP}" var="phong" varStatus="i">--%>
<%--                <div  style="color: black;padding: 10px;margin: 10px;display: inline-block;width: 200px;height: 230px;border-radius: 5px;position: relative;background: #28a745;">--%>
<%--                    <div class="card-body" style="display: flex;flex-direction: column; justify-content: space-between;height: 100%;">--%>
<%--                        <h5 class="card-title">${phong.tenPhong}</h5>--%>
<%--                        <p  style="margin-top:40px" class="card-text">Giá theo giờ:${phong.loaiPhong.giaTheoGio}</p>--%>
<%--                        <div style="display: flex;align-items: center;margin-top: 10px;">--%>
<%--                            <div  style="margin-right: 40px" class="room-status">${phong.trangThai}</div>--%>
<%--                            <div>${phong.tinhTrang}</div>--%>
<%--                        </div>--%>
<%--                        <a href="#" class="btn btn-primary">Xem chi tiết</a>--%>
<%--                    </div>--%>
<%--                </div>--%>
<%--            </c:forEach>--%>
<%--        </div>--%>
<%--    </div>--%>




</body>
</html>