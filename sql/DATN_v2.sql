Create database DATN_v2
go
use DATN_v2
go

CREATE TABLE nhan_vien (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ho NVARCHAR(255),
  ten NVARCHAR(255),
  gioi_tinh NVARCHAR(255),
  quoc_gia NVARCHAR(255),
  sdt VARCHAR(255),
  email VARCHAR(255),
  ngay_tao DATETIME,
  ngay_sua DATETIME,
  trang_thai NVARCHAR(255)
);
CREATE TABLE khach_hang (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ho NVARCHAR(255),
  ten NVARCHAR(255),
  gioi_tinh NVARCHAR(255),
  quoc_gia NVARCHAR(255),
  sdt VARCHAR(255),
  email VARCHAR(255),
  mat_khau VARCHAR(255),
  ngay_tao DATETIME,
  ngay_sua DATETIME,
  trang_thai NVARCHAR(255)
);




CREATE TABLE vai_tro (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ten_vai_tro NVARCHAR (255),
  trang_thai NVARCHAR(255)
);

CREATE TABLE tai_khoan (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_nhan_vien INT ,
  id_vai_tro INT ,
  ten_dang_nhap VARCHAR (255) UNIQUE,
  mat_khau VARCHAR (255),
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_vai_tro) REFERENCES vai_tro(id),
  FOREIGN KEY (id_nhan_vien) REFERENCES nhan_vien(id)
);



CREATE TABLE tien_ich (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ten_tien_ich NVARCHAR(255),
  hinh_anh VARCHAR(255)
);


CREATE TABLE loai_phong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ten_loai_phong NVARCHAR(255),
  dien_tich INT,
  suc_chua_lon INT,
  suc_chua_nho INT,
  gia_phong INT,
  mo_ta NVARCHAR(255),
  trang_thai NVARCHAR(255)
);

CREATE TABLE tien_ich_phong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_loai_phong INT,
  id_tien_ich INT,
  FOREIGN KEY (id_loai_phong) REFERENCES loai_phong(id),
  FOREIGN KEY (id_tien_ich) REFERENCES tien_ich(id)
  
);

CREATE TABLE dich_vu (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ten_dich_vu NVARCHAR(255),
  don_gia DECIMAL(18,2),
  mo_ta NVARCHAR(255),
  hinh_anh VARCHAR(255),
  trang_thai NVARCHAR(255)
);
CREATE TABLE phong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_loai_phong INT,
  ma_phong VARCHAR(255) UNIQUE,
  ten_phong NVARCHAR(255),
  tinh_trang NVARCHAR(255),
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_loai_phong) REFERENCES loai_phong(id)
);
CREATE TABLE hinh_anh (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_phong INT,
  ten NVARCHAR(255),
  duong_dan VARCHAR(255),
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_phong) REFERENCES phong(id)
);

CREATE TABLE hoa_don (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_tai_khoan INT ,
  tong_tien DECIMAL(18,2),
  phuong_thuc_thanh_toan NVARCHAR(255),
  ngay_thanh_toan DATETIME,
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_tai_khoan) REFERENCES tai_khoan(id)
);





CREATE TABLE dat_phong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_hoa_don INT NULL,
  id_khach_hang INT,
  ma_dat_phong VARCHAR(255) UNIQUE,
  so_luong_phong INT,
  thoi_gian_vao_du_kien DATETIME,
  thoi_gian_ra_du_kien DATETIME,
  thoi_gian_dat DATETIME,
  ghi_chu NVARCHAR(255),
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_hoa_don) REFERENCES hoa_don(id),
  FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id)
);



CREATE TABLE thong_tin_dat_phong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_dat_phong INT,
  id_phong INT,
  ngay_nhan_phong DATETIME,
  ngay_tra_phong DATETIME,
  so_nguoi INT,
  tien_phong DECIMAL(18,2),
  tien_dich_vu DECIMAL(18,2),
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_dat_phong) REFERENCES dat_phong(id),
  FOREIGN KEY (id_phong) REFERENCES phong(id)
);

CREATE TABLE phieu_dich_vu (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_dich_vu INT,
  id_thong_tin_dat_phong INT,
  so_luong_su_dung INT,
  ngay_bat_dau DATETIME,
  ngay_ket_thuc DATETIME,
  thanh_tien DECIMAL(18,2),
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_dich_vu) REFERENCES dich_vu(id),
  FOREIGN KEY (id_thong_tin_dat_phong) REFERENCES thong_tin_dat_phong(id)
);





CREATE TABLE dich_vu_di_kem (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_dich_vu INT,
  id_loai_phong INT,
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_dich_vu) REFERENCES dich_vu(id),
  FOREIGN KEY (id_loai_phong) REFERENCES loai_phong(id)
);


CREATE TABLE danh_gia (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_khach_hang INT,
  id_loai_phong INT,
  stars INT,
  nhan_xet NVARCHAR(255),
  ngay_tao DATETIME,
  ngay_sua DATETIME,
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id),
  FOREIGN KEY (id_loai_phong) REFERENCES loai_phong(id)
);

INSERT INTO nhan_vien (ho, ten, gioi_tinh, quoc_gia, sdt, email, ngay_tao, ngay_sua, trang_thai)
VALUES 
(N'Nguyễn', N'Văn A', N'Nam', N'Việt Nam', '0912345678', 'vana@example.com', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Trần', N'Thị B', N'Nữ', N'Việt Nam', '0987654321', 'thib@example.com', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Lê', N'Minh C', N'Nam', N'Việt Nam', '0911223344', 'minhc@example.com', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Phạm', N'Thúy D', N'Nữ', N'Việt Nam', '0922334455', 'thuyd@example.com', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Hoàng', N'Anh E', N'Nữ', N'Việt Nam', '0933445566', 'anhe@example.com', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Vũ', N'Bảo F', N'Nam', N'Việt Nam', '0944556677', 'baof@example.com', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Bùi', N'Lan G', N'Nữ', N'Việt Nam', '0955667788', 'lang@example.com', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Doãn', N'Quốc H', N'Nam', N'Việt Nam', '0966778899', 'quoch@example.com', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Đặng', N'Hải I', N'Nam', N'Việt Nam', '0977889900', 'haii@example.com', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Đỗ', N'Mai J', N'Nữ', N'Việt Nam', '0988990011', 'maij@example.com', GETDATE(), GETDATE(), N'Hoạt động');

INSERT INTO khach_hang (ho, ten, gioi_tinh, quoc_gia, sdt, email, mat_khau, ngay_tao, ngay_sua, trang_thai)
VALUES 
(N'Nguyễn', N'Văn A', N'Nam', N'Việt Nam', '0901234567', 'vana@gmail.com', 'password1', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Trần', N'Thị B', N'Nữ', N'Việt Nam', '0902345678', 'thib@gmail.com', 'password2', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Lê', N'Văn C', N'Nam', N'Việt Nam', '0903456789', 'vanc@gmail.com', 'password3', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Phạm', N'Thị D', N'Nữ', N'Việt Nam', '0904567890', 'thid@gmail.com', 'password4', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Hoàng', N'Văn E', N'Nam', N'Việt Nam', '0905678901', 'vane@gmail.com', 'password5', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Vũ', N'Thị F', N'Nữ', N'Việt Nam', '0906789012', 'thif@gmail.com', 'password6', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Bùi', N'Văn G', N'Nam', N'Việt Nam', '0907890123', 'vang@gmail.com', 'password7', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Doãn', N'Thị H', N'Nữ', N'Việt Nam', '0908901234', 'thih@gmail.com', 'password8', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Đặng', N'Văn I', N'Nam', N'Việt Nam', '0909012345', 'vani@gmail.com', 'password9', GETDATE(), GETDATE(), N'Hoạt động'),
(N'Đỗ', N'Thị J', N'Nữ', N'Việt Nam', '0910123456', 'thij@gmail.com', 'password10', GETDATE(), GETDATE(), N'Hoạt động');

INSERT INTO vai_tro (ten_vai_tro, trang_thai)
VALUES 
(N'Admin', N'Hoạt động'),
(N'Nhân viên', N'Hoạt động'),
(N'Khách hàng', N'Hoạt động')

INSERT INTO tai_khoan (id_nhan_vien, id_vai_tro, ten_dang_nhap, mat_khau, trang_thai)
VALUES 
(1, 1, 'admin1', 'passadmin1', N'Hoạt động'),
(2, 2, 'nhanvien1', 'passnv1', N'Hoạt động'),
(3, 2, 'nhanvien2', 'passnv2', N'Hoạt động'),
(4, 2, 'nhanvien3', 'passnv3', N'Hoạt động'),
(5, 3, 'khachhang1', 'passkh1', N'Hoạt động'),
(6, 3, 'khachhang2', 'passkh2', N'Hoạt động'),
(7, 3, 'khachhang3', 'passkh3', N'Hoạt động')


INSERT INTO tien_ich (ten_tien_ich, hinh_anh)
VALUES 
(N'WiFi miễn phí', 'wifi.png'),
(N'Tivi màn hình phẳng', 'tv.png'),
(N'Điều hòa', 'air_conditioner.png'),
(N'Bồn tắm', 'bath.png'),
(N'Tủ lạnh', 'fridge.png'),
(N'Máy sấy', 'dryer.png'),
(N'Máy sưởi', 'heater.png'),
(N'Mini bar', 'minibar.png'),
(N'Máy pha cà phê', 'coffee_maker.png');


INSERT INTO loai_phong (ten_loai_phong, dien_tich, suc_chua_lon, suc_chua_nho, gia_phong, mo_ta, trang_thai)
VALUES 
(N'Phòng đơn', 20, 2, 1, 500000, N'Phòng dành cho 1-2 người', N'Hoạt động'),
(N'Phòng đôi', 30, 4, 2, 800000, N'Phòng dành cho gia đình', N'Hoạt động'),
(N'Phòng VIP', 50, 6, 4, 1200000, N'Phòng VIP với dịch vụ cao cấp', N'Hoạt động'),
(N'Phòng gia đình', 40, 5, 3, 900000, N'Phòng rộng rãi cho gia đình', N'Hoạt động')

INSERT INTO tien_ich_phong (id_loai_phong, id_tien_ich)
VALUES 
(1, 1),(1, 3),(1, 4),(1, 5),
(2, 1),(2, 3),(2, 4),(2, 5),
(3, 1),(3, 3),(3, 4),(3, 5),(3, 8),(3, 9),
(4, 3),(4, 3),(4, 4),(4, 5),(4, 9);

INSERT INTO dich_vu (ten_dich_vu, don_gia, mo_ta, hinh_anh, trang_thai)
VALUES 
(N'Dịch vụ ăn uống', 150000, N'Dịch vụ ăn uống tại phòng', 'an_uong.jpg', N'Hoạt động'),
(N'Dịch vụ spa', 300000, N'Dịch vụ spa cao cấp', 'spa.jpg', N'Hoạt động'),
(N'Giặt là', 50000, N'Dịch vụ giặt là', 'giat_la.jpg', N'Hoạt động'),
(N'Dịch vụ đưa đón', 200000, N'Dịch vụ đưa đón sân bay', 'dua_don.jpg', N'Hoạt động'),
(N'Thể dục', 100000, N'Sử dụng phòng tập gym', 'the_duc.jpg', N'Hoạt động'),
(N'Dịch vụ xe đưa đón', 250000, N'Xe đưa đón khách sạn', 'xe_dua_don.jpg', N'Hoạt động'),
(N'Chăm sóc da', 350000, N'Dịch vụ chăm sóc da', 'cham_soc_da.jpg', N'Hoạt động'),
(N'Đồ uống', 75000, N'Đồ uống miễn phí', 'do_uong.jpg', N'Hoạt động'),
(N'Thuê xe máy', 100000, N'Dịch vụ thuê xe máy', 'thue_xe.jpg', N'Hoạt động'),
(N'Dịch vụ vệ sinh', 50000, N'Vệ sinh phòng hàng ngày', 've_sinh.jpg', N'Hoạt động');

INSERT INTO phong (id_loai_phong, ma_phong, ten_phong, tinh_trang, trang_thai)
VALUES 
(1, 'P101', N'Phòng 101', N'Sẵn sàng', N'Hoạt động'),
(2, 'P102', N'Phòng 102', N'Sẵn sàng', N'Hoạt động'),
(3, 'P103', N'Phòng 103', N'Đang sử dụng', N'Hoạt động'),
(4, 'P104', N'Phòng 104', N'Bảo trì', N'Hoạt động'),
(1, 'P105', N'Phòng 105', N'Sẵn sàng', N'Hoạt động'),
(1, 'P106', N'Phòng 106', N'Sẵn sàng', N'Hoạt động'),
(2, 'P107', N'Phòng 107', N'Đang sử dụng', N'Hoạt động'),
(2, 'P108', N'Phòng 108', N'Sẵn sàng', N'Hoạt động'),
(3, 'P109', N'Phòng 109', N'Sẵn sàng', N'Hoạt động'),
(4, 'P110', N'Phòng 110', N'Đang sửa chữa', N'Hoạt động');

INSERT INTO hinh_anh (id_phong, ten, duong_dan, trang_thai)
VALUES 
(1, N'Hình ảnh phòng 101', 'room101.jpg', N'Hoạt động'),
(2, N'Hình ảnh phòng 102', 'room102.jpg', N'Hoạt động'),
(3, N'Hình ảnh phòng 103', 'room103.jpg', N'Hoạt động'),
(4, N'Hình ảnh phòng 104', 'room104.jpg', N'Hoạt động'),
(5, N'Hình ảnh phòng 105', 'room105.jpg', N'Hoạt động'),
(6, N'Hình ảnh phòng 106', 'room106.jpg', N'Hoạt động'),
(7, N'Hình ảnh phòng 107', 'room103.jpg', N'Hoạt động'),
(8, N'Hình ảnh phòng 108', 'room104.jpg', N'Hoạt động'),
(9, N'Hình ảnh phòng 109', 'room105.jpg', N'Hoạt động'),
(10, N'Hình ảnh phòng 110', 'room106.jpg', N'Hoạt động');

INSERT INTO hoa_don (id_tai_khoan, tong_tien, phuong_thuc_thanh_toan, ngay_thanh_toan, trang_thai)
VALUES 
(1, 1200000, N'Transfer', GETDATE(), N'Hoạt động'),
(2, 800000, N'Tiền mặt', GETDATE(), N'Hoạt động'),
(3, 1500000, N'Transfer', GETDATE(), N'Hoạt động'),
(4, 500000, N'Tiền mặt', GETDATE(), N'Hoạt động'),
(5, 900000, N'Transfer', GETDATE(), N'Hoạt động'),
(1, 600000, N'Tiền mặt', GETDATE(), N'Hoạt động'),
(2, 300000, N'Transfer', GETDATE(), N'Hoạt động'),
(3, 2000000, N'Tiền mặt', GETDATE(), N'Hoạt động'),
(4, 700000, N'Transfer', GETDATE(), N'Hoạt động'),
(5, 1000000, N'Tiền mặt', GETDATE(), N'Hoạt động'),
(1, 1100000, N'Transfer', GETDATE(), N'Hoạt động'),
(2, 1300000, N'Tiền mặt', GETDATE(), N'Hoạt động'),
(3, 1400000, N'Transfer', GETDATE(), N'Hoạt động'),
(4, 1600000, N'Tiền mặt', GETDATE(), N'Hoạt động'),
(5, 1700000, N'Transfer', GETDATE(), N'Hoạt động');

INSERT INTO dat_phong (id_hoa_don, id_khach_hang, ma_dat_phong, so_luong_phong, thoi_gian_vao_du_kien, thoi_gian_ra_du_kien, thoi_gian_dat, ghi_chu, trang_thai)
VALUES 
(1, 1, 'DB101', 1, GETDATE(), DATEADD(DAY, 2, GETDATE()), GETDATE(), N'Không hút thuốc', N'Hoạt động'),
(2, 2, 'DB102', 2, GETDATE(), DATEADD(DAY, 3, GETDATE()), GETDATE(), N'Yêu cầu phòng yên tĩnh', N'Hoạt động'),
(3, 3, 'DB103', 1, GETDATE(), DATEADD(DAY, 1, GETDATE()), GETDATE(), N'Đặt trước 1 ngày', N'Hoạt động'),
(4, 4, 'DB104', 3, GETDATE(), DATEADD(DAY, 4, GETDATE()), GETDATE(), N'Chờ xác nhận', N'Hoạt động'),
(5, 5, 'DB105', 2, GETDATE(), DATEADD(DAY, 5, GETDATE()), GETDATE(), N'Yêu cầu giường đôi', N'Hoạt động'),
(1, 6, 'DB106', 1, GETDATE(), DATEADD(DAY, 2, GETDATE()), GETDATE(), N'Phòng có bồn tắm', N'Hoạt động'),
(2, 7, 'DB107', 2, GETDATE(), DATEADD(DAY, 3, GETDATE()), GETDATE(), N'Yêu cầu bữa sáng', N'Hoạt động'),
(3, 8, 'DB108', 1, GETDATE(), DATEADD(DAY, 1, GETDATE()), GETDATE(), N'Đặt trước 2 ngày', N'Hoạt động'),
(4, 9, 'DB109', 3, GETDATE(), DATEADD(DAY, 4, GETDATE()), GETDATE(), N'Chờ xác nhận', N'Hoạt động'),
(5, 10, 'DB110', 2, GETDATE(), DATEADD(DAY, 5, GETDATE()), GETDATE(), N'Yêu cầu có cửa sổ', N'Hoạt động'),
(1, 1, 'DB111', 1, GETDATE(), DATEADD(DAY, 2, GETDATE()), GETDATE(), N'Không hút thuốc', N'Hoạt động'),
(2, 2, 'DB112', 2, GETDATE(), DATEADD(DAY, 3, GETDATE()), GETDATE(), N'Yêu cầu phòng yên tĩnh', N'Hoạt động'),
(3, 3, 'DB113', 1, GETDATE(), DATEADD(DAY, 1, GETDATE()), GETDATE(), N'Đặt trước 1 ngày', N'Hoạt động'),
(4, 4, 'DB114', 3, GETDATE(), DATEADD(DAY, 4, GETDATE()), GETDATE(), N'Chờ xác nhận', N'Hoạt động'),
(5, 5, 'DB115', 2, GETDATE(), DATEADD(DAY, 5, GETDATE()), GETDATE(), N'Yêu cầu giường đôi', N'Hoạt động');

INSERT INTO thong_tin_dat_phong (id_dat_phong, id_phong, ngay_nhan_phong, ngay_tra_phong, so_nguoi, tien_phong, tien_dich_vu, trang_thai)
VALUES 
(1, 1, GETDATE(), DATEADD(DAY, 2, GETDATE()), 1, 500000, 150000, N'Hoạt động'),
(2, 2, GETDATE(), DATEADD(DAY, 3, GETDATE()), 2, 800000, 200000, N'Hoạt động'),
(3, 3, GETDATE(), DATEADD(DAY, 1, GETDATE()), 1, 500000, 100000, N'Hoạt động'),
(4, 4, GETDATE(), DATEADD(DAY, 4, GETDATE()), 3, 900000, 250000, N'Hoạt động'),
(5, 5, GETDATE(), DATEADD(DAY, 5, GETDATE()), 2, 800000, 300000, N'Hoạt động'),
(1, 6, GETDATE(), DATEADD(DAY, 2, GETDATE()), 1, 500000, 150000, N'Hoạt động'),
(2, 7, GETDATE(), DATEADD(DAY, 3, GETDATE()), 2, 800000, 200000, N'Hoạt động'),
(3, 8, GETDATE(), DATEADD(DAY, 1, GETDATE()), 1, 500000, 100000, N'Hoạt động'),
(4, 9, GETDATE(), DATEADD(DAY, 4, GETDATE()), 3, 900000, 250000, N'Hoạt động'),
(5, 10, GETDATE(), DATEADD(DAY, 5, GETDATE()), 2, 800000, 300000, N'Hoạt động');


INSERT INTO phieu_dich_vu (id_dich_vu, id_thong_tin_dat_phong, so_luong_su_dung, ngay_bat_dau, ngay_ket_thuc, thanh_tien, trang_thai)
VALUES 
(1, 1, 2, GETDATE(), DATEADD(DAY, 2, GETDATE()), 300000, N'Hoạt động'),
(2, 2, 1, GETDATE(), DATEADD(DAY, 2, GETDATE()), 150000, N'Hoạt động'),
(3, 3, 1, GETDATE(), DATEADD(DAY, 3, GETDATE()), 500000, N'Hoạt động'),
(4, 4, 3, GETDATE(), DATEADD(DAY, 1, GETDATE()), 600000, N'Hoạt động'),
(5, 5, 2, GETDATE(), DATEADD(DAY, 2, GETDATE()), 200000, N'Hoạt động'),
(6, 6, 1, GETDATE(), DATEADD(DAY, 1, GETDATE()), 300000, N'Hoạt động'),
(7, 7, 1, GETDATE(), DATEADD(DAY, 3, GETDATE()), 150000, N'Hoạt động'),
(8, 8, 1, GETDATE(), DATEADD(DAY, 4, GETDATE()), 350000, N'Hoạt động'),
(9, 9, 1, GETDATE(), DATEADD(DAY, 5, GETDATE()), 50000, N'Hoạt động'),
(10, 10, 2, GETDATE(), DATEADD(DAY, 3, GETDATE()), 100000, N'Hoạt động');


INSERT INTO dich_vu_di_kem (id_dich_vu, id_loai_phong, trang_thai)
VALUES 
(1, 1, N'Hoạt động'),
(2, 2, N'Hoạt động'),
(3, 3, N'Hoạt động'),
(4, 1, N'Hoạt động'),
(5, 2, N'Hoạt động'),
(6, 3, N'Hoạt động'),
(7, 4, N'Hoạt động'),
(8, 1, N'Hoạt động'),
(9, 2, N'Hoạt động'),
(10, 3, N'Hoạt động');

INSERT INTO phieu_dich_vu (id_dich_vu, id_thong_tin_dat_phong, so_luong_su_dung, ngay_bat_dau, ngay_ket_thuc, thanh_tien, trang_thai)
VALUES 
(1, 1, 1, GETDATE(), DATEADD(DAY, 2, GETDATE()), 200000, N'Hoàn tất'),
(2, 2, 2, GETDATE(), DATEADD(DAY, 2, GETDATE()), 600000, N'Hoàn tất'),
(3, 3, 1, GETDATE(), DATEADD(DAY, 1, GETDATE()), 250000, N'Hoàn tất'),
(4, 4, 1, GETDATE(), DATEADD(DAY, 2, GETDATE()), 200000, N'Hoàn tất'),
(5, 5, 3, GETDATE(), DATEADD(DAY, 3, GETDATE()), 750000, N'Hoàn tất');
	
INSERT INTO dich_vu_di_kem (id_dich_vu, id_loai_phong, trang_thai)
VALUES 
(1, 1, N'Hoạt động'),
(2, 2, N'Hoạt động'),
(3, 3, N'Hoạt động'),
(4, 4, N'Hoạt động'),
(5, 1, N'Hoạt động'),
(1, 2, N'Hoạt động'),
(2, 3, N'Hoạt động'),
(3, 4, N'Hoạt động'),
(4, 1, N'Hoạt động'),
(5, 2, N'Hoạt động');

INSERT INTO danh_gia (id_khach_hang, id_loai_phong, stars, nhan_xet, ngay_tao, ngay_sua, trang_thai)
VALUES 
(1, 1, 5, N'Rất tốt!', GETDATE(), GETDATE(), N'Hoạt động'),
(2, 2, 4, N'Thời gian tuyệt vời!', GETDATE(), GETDATE(), N'Hoạt động'),
(3, 3, 3, N'Ổn!', GETDATE(), GETDATE(), N'Hoạt động'),
(4, 1, 4, N'Tốt nhưng có thể cải thiện!', GETDATE(), GETDATE(), N'Hoạt động'),
(5, 2, 5, N'Tuyệt vời, sẽ quay lại!', GETDATE(), GETDATE(), N'Hoạt động'),
(1, 3, 2, N'Cần cải thiện dịch vụ!', GETDATE(), GETDATE(), N'Hoạt động');
