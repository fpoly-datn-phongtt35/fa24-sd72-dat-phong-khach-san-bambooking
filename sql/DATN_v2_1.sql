Create database DATN_v2_1
go
use DATN_v2_1
go

CREATE TABLE vai_tro (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ten_vai_tro NVARCHAR (255),
  trang_thai NVARCHAR(255)
);

CREATE TABLE tai_khoan (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ten_dang_nhap VARCHAR (255) UNIQUE,
  mat_khau VARCHAR (255),
  trang_thai NVARCHAR(255)
);

CREATE TABLE nhan_vien (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_vai_tro INT,
  id_tai_khoan INT,
  ho NVARCHAR(255),
  ten NVARCHAR(255),
  gioi_tinh NVARCHAR(255),
  quoc_gia NVARCHAR(255),
  sdt VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  ngay_tao DATETIME,
  ngay_sua DATETIME,
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_vai_tro) REFERENCES vai_tro(id),
  FOREIGN KEY (id_tai_khoan) REFERENCES tai_khoan(id)
<<<<<<< HEAD
);

CREATE TABLE khach_hang (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_tai_khoan INT NULL,
  ho NVARCHAR(255), 
=======

);
CREATE TABLE khach_hang (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_tai_khoan INT,
  ho NVARCHAR(255),
>>>>>>> long
  ten NVARCHAR(255),
  gioi_tinh NVARCHAR(255),
  quoc_gia NVARCHAR(255),
  sdt VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  ngay_tao DATETIME,
  ngay_sua DATETIME,
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_tai_khoan) REFERENCES tai_khoan(id)
);

<<<<<<< HEAD
=======







>>>>>>> long
CREATE TABLE tien_ich (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ten_tien_ich NVARCHAR(255),
  hinh_anh VARCHAR(255)
);

<<<<<<< HEAD
=======

>>>>>>> long
CREATE TABLE loai_phong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ten_loai_phong NVARCHAR(255),
  dien_tich INT,
  suc_chua_lon INT,
  suc_chua_nho INT,
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
<<<<<<< HEAD

=======
>>>>>>> long
CREATE TABLE phong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_loai_phong INT,
  ma_phong VARCHAR(255) UNIQUE,
  ten_phong NVARCHAR(255),
  gia_phong DECIMAL(18,2),
  tinh_trang NVARCHAR(255),
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_loai_phong) REFERENCES loai_phong(id)
);
<<<<<<< HEAD

=======
>>>>>>> long
CREATE TABLE hinh_anh (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_phong INT,
  ten NVARCHAR(255),
  duong_dan VARCHAR(255),
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_phong) REFERENCES phong(id)
);

<<<<<<< HEAD
=======






>>>>>>> long
CREATE TABLE dat_phong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_nhan_vien INT,
  id_khach_hang INT,
  ma_dat_phong VARCHAR(255) UNIQUE,
  ngay_dat DATETIME,
  ghi_chu NVARCHAR(255),
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_nhan_vien) REFERENCES nhan_vien(id),
  FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id)
);

<<<<<<< HEAD
=======


>>>>>>> long
CREATE TABLE thong_tin_dat_phong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_dat_phong INT,
  id_phong INT,
  ngay_nhan_phong DATETIME,
  ngay_tra_phong DATETIME,
  so_nguoi INT,
  so_ngay INT,
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_dat_phong) REFERENCES dat_phong(id),
  FOREIGN KEY (id_phong) REFERENCES phong(id)
);
<<<<<<< HEAD

=======
>>>>>>> long
CREATE TABLE hoa_don (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_nhan_vien INT ,
  id_thong_tin_dat_phong INT,
  ma_hoa_don VARCHAR(255) UNIQUE, 
  tong_tien DECIMAL(18,2),
  phuong_thuc_thanh_toan NVARCHAR(255),
  ngay_thanh_toan DATETIME,
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_nhan_vien) REFERENCES nhan_vien(id),
  FOREIGN KEY (id_thong_tin_dat_phong) REFERENCES thong_tin_dat_phong(id)
);

<<<<<<< HEAD
=======

>>>>>>> long
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

<<<<<<< HEAD
=======




>>>>>>> long
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

INSERT INTO vai_tro (ten_vai_tro, trang_thai)
VALUES 
(N'Quản lý', 'active'),
(N'Nhân viên', 'active');

INSERT INTO tai_khoan (ten_dang_nhap, mat_khau, trang_thai)
VALUES 
('admin', 'password123', 'active'),
('nhanvien1', 'password123', 'active'),
('khachhang1', 'password123', 'active');

INSERT INTO nhan_vien (id_vai_tro, id_tai_khoan, ho, ten, gioi_tinh, quoc_gia, sdt, email, ngay_tao, ngay_sua, trang_thai)
VALUES 
(1, 1, N'Nguyễn', 'A', N'Nam', N'Việt Nam', '0123456789', 'nguyena@example.com', GETDATE(), GETDATE(), 'active'),
(2, 2, N'Trần', 'B', N'Nữ', N'Việt Nam', '0987654321', 'tranb@example.com', GETDATE(), GETDATE(), 'active');

INSERT INTO khach_hang (id_tai_khoan, ho, ten, gioi_tinh, quoc_gia, sdt, email, ngay_tao, ngay_sua, trang_thai)
VALUES 
(3, N'Lê', 'C', 'Nam', N'Việt Nam', '0912345678', 'lec@example.com', GETDATE(), GETDATE(), 'active');

INSERT INTO tien_ich (ten_tien_ich, hinh_anh)
VALUES 
(N'WiFi miễn phí', 'wifi.jpg'),
(N'Hồ bơi', 'pool.jpg');

INSERT INTO loai_phong (ten_loai_phong, dien_tich, suc_chua_lon, suc_chua_nho, mo_ta, trang_thai)
VALUES 
(N'Phòng Deluxe', 50, 4, 2, N'Phòng sang trọng với đầy đủ tiện nghi', 'available'),
(N'Phòng Suite', 70, 6, 3, N'Phòng cao cấp với view đẹp', 'available');

INSERT INTO tien_ich_phong (id_loai_phong, id_tien_ich)
VALUES 
(1, 1),
(2, 2);

INSERT INTO dich_vu (ten_dich_vu, don_gia, mo_ta, hinh_anh, trang_thai)
VALUES 
('Spa', 500000, N'Dịch vụ spa cao cấp', 'spa.jpg', 'available'),
(N'Ăn sáng', 150000, N'Bữa sáng buffet', 'buffet.jpg', 'available');

INSERT INTO phong (id_loai_phong, ma_phong, ten_phong, gia_phong, tinh_trang, trang_thai)
VALUES 
(1, 'D001', N'Phòng Deluxe 1', 1000000, 'available', 'available'),
(2, 'S001', N'Phòng Suite 1', 2000000, 'available', 'available');

INSERT INTO hinh_anh (id_phong, ten, duong_dan, trang_thai)
VALUES 
(1, N'Phòng Deluxe 1 - Hình 1', 'deluxe1_1.jpg', 'active'),
(2, N'Phòng Suite 1 - Hình 1', 'suite1_1.jpg', 'active');

INSERT INTO dat_phong (id_nhan_vien, id_khach_hang, ma_dat_phong, ngay_dat, ghi_chu, trang_thai)
VALUES 
(1, 1, 'DP001', GETDATE(), N'Đặt phòng nhanh', 'confirmed'),
(1, 1, 'DP002', GETDATE(), N'Đặt phòng nhanh', 'confirmed'),
(2, 1, 'DP003', GETDATE(), N'Đặt phòng nhanh', 'canceled'),
(2, 1, 'DP004', GETDATE(), N'Đặt phòng nhanh', 'canceled'),
(1, 1, 'DP005', GETDATE(), N'Đặt phòng nhanh', 'confirmed'),
(1, 1, 'DP006', GETDATE(), N'Đặt phòng nhanh', 'placing'),
(2, 1, 'DP007', GETDATE(), N'Đặt phòng nhanh', 'unconfirmed'),
(2, 1, 'DP008', GETDATE(), N'Đặt phòng nhanh', 'unconfirmed'),
(2, 1, 'DP009', GETDATE(), N'Đặt phòng nhanh', 'confirmed');

INSERT INTO thong_tin_dat_phong (id_dat_phong, id_phong, ngay_nhan_phong, ngay_tra_phong, so_nguoi, so_ngay, trang_thai)
VALUES 
(1, 1, '2024-10-01', '2024-10-05', 2, 4, 'booked');

INSERT INTO hoa_don (id_nhan_vien, id_thong_tin_dat_phong, ma_hoa_don, tong_tien, phuong_thuc_thanh_toan, ngay_thanh_toan, trang_thai)
VALUES 
(1, 1, 'HD001', 4000000, 'Credit Card', GETDATE(), 'paid');

INSERT INTO phieu_dich_vu (id_dich_vu, id_thong_tin_dat_phong, so_luong_su_dung, ngay_bat_dau, ngay_ket_thuc, thanh_tien, trang_thai)
VALUES 
(1, 1, 1, '2024-10-02', '2024-10-05', 500000, 'used');

INSERT INTO dich_vu_di_kem (id_dich_vu, id_loai_phong, trang_thai)
VALUES 
(1, 1, 'active'),
(2, 2, 'active');

INSERT INTO danh_gia (id_khach_hang, id_loai_phong, stars, nhan_xet, ngay_tao, ngay_sua, trang_thai)
VALUES 
(1, 1, 5, N'Phòng đẹp và sạch sẽ', GETDATE(), GETDATE(), 'active');
