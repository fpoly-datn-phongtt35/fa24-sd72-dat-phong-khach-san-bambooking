<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Table Row Click</title>
    <%@ page contentType="text/html;charset=UTF-8" language="java" %>
    <%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
    <style>

        .modal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgb(0, 0, 0);
            background-color: rgba(0, 0, 0, 0.4);
            padding: 20px;
        }

        .modal-content {
            background-color: #fefefe;
            margin: 0% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 70%;
        }

        .modalForm {
            top: 30px;
            positon: absolute;
        }

        .close {
            color: #aaa;
            float: left;
            font-size: 28px;
            font-weight: bold;
            position: absolute;
            top: 5px;
            right: 20px;
        }

        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }

        .carousel-item img {
            width: 350px;
            height: 300px;
            object-fit: cover; /* Ensures the image covers the dimensions without distortion */
        }

    </style>
</head>
<body>
<table class="table" id="tphong">
    <thead>
    <tr>
        <th>STT</th>
        <th>ID</th>
        <th>Mã phòng</th>
        <th>Tên phòng</th>
        <th>Hình ảnh</th>
        <th>Ngày tạo</th>
        <th>Ngày sửa</th>
        <th>Trạng thái</th>
        <th>Tình trạng</th>
        <th>Action</th>
    </tr>
    </thead>
    <tbody>
    <c:forEach items="${list}" var="s" varStatus="i">
        <tr class="aa">
            <td>${i.index + 1}</td>
            <td>${s.id}</td>
            <td>${s.maPhong}</td>
            <td>${s.tenPhong}</td>
            <td>${s.hinhAnh}</td>
            <td>${s.ngayTao}</td>
            <td>${s.ngaySua}</td>
            <td>${s.trangThai}</td>
            <td>${s.tinhTrang}</td>
            <td>
                <a href="/phong/update-status?id=${s.id}" class="btn btn-warning">Đổi trạng thái hoạt động</a>
            </td>
        </tr>
    </c:forEach>
    </tbody>
</table>

<!-- The Modal -->
<div id="myModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <form id="modalForm" class="modalForm" action="/phong/add" method="post">
            <form action="/phong/update" method="post">
                <div class="row">
                    <div class="col-md-6">
                        <label for="id">ID</label>
                        <input type="text" class="form-control " id="id" name="id"><br>

                        <label for="maPhong">Mã phòng</label>
                        <input type="text" class="form-control" id="maPhong" name="maPhong"><br>

                        <label for="tenPhong">Tên phòng</label>
                        <input type="text" class="form-control" id="tenPhong" name="tenPhong"><br>

                        <label for="ngayTao">Ngày tạo</label>
                        <input type="datetime-local" class="form-control" id="ngayTao" name="ngayTao"><br>

                        <label for="ngaySua">Ngày sửa</label>
                        <input type="datetime-local" class="form-control" id="ngaySua" name="ngaySua"><br>

                        <label for="tinhTrang">Tình trạng</label>
                        <select class="form-select" id="tinhTrang" name="tinhTrang">
                            <c:forEach items="${listTinhTrang}" var="x">
                                <option value="${x}">${x}</option>
                            </c:forEach>
                        </select><br>

                        <label class="form-label">Trạng thái</label><br>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="hoatDong" name="trangThai"
                                   value="Hoạt động">
                            <label class="form-check-label">Hoạt động</label>
                        </div>
                        <div class="form-check form-check-inline">
                            <input class="form-check-input" type="radio" id="ngungHoatDong" name="trangThai"
                                   value="Ngừng hoạt động">
                            <label class="form-check-label">Ngừng hoạt động</label>
                        </div>
                    </div>
                    <div class="col-md-6">
                        <label for="hinhAnh">Hình ảnh</label>
                        <div id="carouselExample" class="carousel slide" data-bs-ride="carousel">
                            <div class="carousel-inner" id="carouselInner">
                                ---------------------------------------------
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#carouselExample"
                                    data-bs-slide="prev">
                                <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#carouselExample"
                                    data-bs-slide="next">
                                <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                        <br>
                        <input type="file" class="form-control" id="hinhAnh" name="hinhAnh[]" multiple><br>
                    </div>
                </div>

                <br>
                <button type="submit" class="btn btn-success">Lưu</button>
                <a class="btn btn-success" onclick="resetmodal()">Thêm mới</a>
            </form>
        </form>

    </div>
</div>

<script>
    window.addEventListener('load', function () {
        const rows = document.querySelectorAll('#tphong tbody tr');
        const modal = document.getElementById('myModal');
        const span = document.getElementsByClassName('close')[0];
        const hinhAnhInput = document.getElementById('hinhAnh');

        rows.forEach(row => {
            row.addEventListener('dblclick', function () {
                    document.getElementById('id').value = row.getElementsByTagName('td')[1].innerText;
                    document.getElementById('maPhong').value = row.getElementsByTagName('td')[2].innerText;
                    document.getElementById('tenPhong').value = row.getElementsByTagName('td')[3].innerText;
                    document.getElementById('ngayTao').value = row.getElementsByTagName('td')[5].innerText;
                    document.getElementById('ngaySua').value = row.getElementsByTagName('td')[6].innerText;
                    const trangThai = row.getElementsByTagName('td')[7].innerText;
                    if (trangThai === 'Hoạt động') {
                        document.getElementById('hoatDong').checked = true;
                    } else if (trangThai === 'Ngừng hoạt động') {
                        document.getElementById('ngungHoatDong').checked = true;
                    }

                    const tinhTrang = row.getElementsByTagName('td')[8].innerText;
                    const selectTinhTrang = document.getElementById('tinhTrang');
                    for (let i = 0; i < selectTinhTrang.options.length; i++) {
                        if (selectTinhTrang.options[i].text === tinhTrang) {
                            selectTinhTrang.selectedIndex = i;
                            break;
                        }
                    }

                    const imageUrls = row.getElementsByTagName('td')[4].innerText.split(',');
                    carouselInner.innerHTML = '';
                    imageUrls.forEach((url, index) => {
                        const carouselItem = document.createElement('div');
                        carouselItem.classList.add('carousel-item');
                        if (index === 0) carouselItem.classList.add('active');
                        const img = document.createElement('img');
                        img.src = '../../../img/' + url.trim();
                        img.classList.add('d-block', 'w-100');
                        carouselItem.appendChild(img);
                        carouselInner.appendChild(carouselItem);
                    });
                    modal.style.display = "block";
                }
            );
        });
        hinhAnhInput.onchange = function () {
            const files = hinhAnhInput.files;
            carouselInner.innerHTML = '';
            Array.from(files).forEach((file, index) => {
                const carouselItem = document.createElement('div');
                carouselItem.classList.add('carousel-item');
                if (index === 0) carouselItem.classList.add('active');
                const img = document.createElement('img');
                img.src = URL.createObjectURL(file);
                img.classList.add('d-block', 'w-100');
                carouselItem.appendChild(img);
                carouselInner.appendChild(carouselItem);
            });
        };

        span.onclick = function () {
            modal.style.display = "none";
        }

        window.onclick = function (event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }

    });

    function resetmodal(){
        modalForm.reset();
        carouselInner.innerHTML = '';
    }
</script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz"
        crossorigin="anonymous"></script>

</body>
</html>
