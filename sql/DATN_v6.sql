create database DATN_v6
go

use DATN_v6
go

CREATE TABLE vai_tro (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ten_vai_tro NVARCHAR (255),
  trang_thai BIT
);

CREATE TABLE tai_khoan (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_vai_tro INT,
  ten_dang_nhap VARCHAR (255) UNIQUE,
  mat_khau VARCHAR (255),
  trang_thai BIT,
  FOREIGN KEY (id_vai_tro) REFERENCES vai_tro(id),
);

CREATE TABLE nhan_vien (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_tai_khoan INT,
  cmnd VARCHAR(255),
  ho NVARCHAR(255),
  ten NVARCHAR(255),
  gioi_tinh NVARCHAR(255),
  dia_chi NVARCHAR(255),
  sdt VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  ngay_tao DATETIME,
  ngay_sua DATETIME,
  trang_thai BIT,
	avatar VARCHAR(255),
	public_id VARCHAR(255),
  FOREIGN KEY (id_tai_khoan) REFERENCES tai_khoan(id)
);

CREATE TABLE khach_hang (
  id INT IDENTITY(1,1) PRIMARY KEY,
	id_tai_khoan INT,
  cmnd VARCHAR(255),
  ho NVARCHAR(255),
  ten NVARCHAR(255),
  gioi_tinh NVARCHAR(255),
  dia_chi NVARCHAR(255),
  sdt VARCHAR(255),
  email VARCHAR(255),
  ngay_tao DATETIME,
  ngay_sua DATETIME,
  trang_thai BIT,
	avatar VARCHAR(255),
	public_id VARCHAR(255),
	FOREIGN KEY (id_tai_khoan) REFERENCES tai_khoan(id)
);

CREATE TABLE vat_tu (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ten_vat_tu NVARCHAR(255),
  gia DECIMAL(18,2),
  hinh_anh VARCHAR(255)
);

CREATE TABLE loai_phong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ma_loai_phong VARCHAR(255),
  ten_loai_phong NVARCHAR(255),
  dien_tich INT,
  so_khach_toi_da INT,
  don_gia DECIMAL(18,2),
  don_gia_phu_thu DECIMAL(18,2),
  mo_ta NVARCHAR(255)
);

CREATE TABLE vat_tu_loai_phong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_loai_phong INT,
  id_vat_tu INT,
  so_luong INT,
  CONSTRAINT unique_tienich_loaiphong UNIQUE (id_vat_tu, id_loai_phong),
  FOREIGN KEY (id_loai_phong) REFERENCES loai_phong(id),
  FOREIGN KEY (id_vat_tu) REFERENCES vat_tu(id)
);

CREATE TABLE dich_vu (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ten_dich_vu NVARCHAR(255),
  don_gia DECIMAL(18,2),
  mo_ta NVARCHAR(255),
  hinh_anh VARCHAR(255),
  trang_thai bit
);

CREATE TABLE phong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_loai_phong INT,
  ma_phong VARCHAR(255) UNIQUE,	
  ten_phong NVARCHAR(255),
  tinh_trang NVARCHAR(255),
  trang_thai bit,
  FOREIGN KEY (id_loai_phong) REFERENCES loai_phong(id)
);

CREATE TABLE hinh_anh (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_phong INT,
  ten NVARCHAR(255),
  duong_dan VARCHAR(255),
  trang_thai bit,	
  FOREIGN KEY (id_phong) REFERENCES phong(id)
);

CREATE TABLE dat_phong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_khach_hang INT,
  ma_dat_phong VARCHAR(255) UNIQUE,
  so_nguoi INT,
  so_phong INT,
  ngay_dat DATE,
  tong_tien DECIMAL(18,2),
  ghi_chu NVARCHAR(255),
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id)
);

CREATE TABLE thong_tin_dat_phong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_dat_phong INT,
  id_loai_phong INT,
  ma_thong_tin_dat_phong VARCHAR(255) UNIQUE,
  ngay_nhan_phong DATE,
  ngay_tra_phong DATE,
  so_nguoi INT,
  gia_dat DECIMAL(18,2),
  ghi_chu NVARCHAR(255),
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_dat_phong) REFERENCES dat_phong(id),
  FOREIGN KEY (id_loai_phong) REFERENCES loai_phong(id)
);

CREATE TABLE khach_hang_checkin (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_thong_tin_dat_phong  INT ,
  id_khach_hang INT,
  trang_thai BIT,
  FOREIGN KEY (id_thong_tin_dat_phong) REFERENCES thong_tin_dat_phong(id),
  FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id)
);

CREATE TABLE xep_phong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_phong INT ,
  id_thong_tin_dat_phong INT,
  ngay_nhan_phong DATETIME,
  ngay_tra_phong DATETIME,
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_thong_tin_dat_phong) REFERENCES thong_tin_dat_phong(id),
  FOREIGN KEY (id_phong) REFERENCES phong(id)
);

CREATE TABLE dich_vu_su_dung(
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_dich_vu INT,
  id_xep_phong INT,
  so_luong_su_dung INT,
  gia_su_dung DECIMAL(18,2),
  trang_thai BIT,
  FOREIGN KEY (id_dich_vu) REFERENCES dich_vu(id),
  FOREIGN KEY (id_xep_phong) REFERENCES xep_phong(id)
);

CREATE TABLE hoa_don (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_nhan_vien INT ,
  id_dat_phong INT,
  ma_hoa_don VARCHAR(255) UNIQUE, 
  tong_tien DECIMAL(18,2),
  ngay_tao DATETIME,
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_nhan_vien) REFERENCES nhan_vien(id),
  FOREIGN KEY (id_dat_phong) REFERENCES dat_phong(id)
);

CREATE TABLE tra_phong (
    id INT PRIMARY KEY IDENTITY(1,1),
    id_xep_phong INT,
    ngay_tra_phong_thuc_te DATETIME,
    trang_thai BIT,
    FOREIGN KEY (id_xep_phong) REFERENCES xep_phong(id)
);

CREATE TABLE thong_tin_hoa_don (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_tra_phong INT,
  id_hoa_don INT,
  tien_dich_vu DECIMAL(18,2),
  tien_phong DECIMAL(18,2),
  tien_phu_thu DECIMAL(18,2),
  tien_khau_tru DECIMAL(18,2),
  FOREIGN KEY (id_tra_phong) REFERENCES tra_phong(id),
  FOREIGN KEY (id_hoa_don) REFERENCES hoa_don(id)
);

CREATE TABLE phu_thu(
	id INT IDENTITY(1,1) PRIMARY KEY,
	id_xep_phong INT,
	ten_phu_thu NVARCHAR(255),
	tien_phu_thu DECIMAL(18,2),
	so_luong INT,
	trang_thai VARCHAR(255),
	FOREIGN KEY (id_xep_phong) REFERENCES xep_phong(id),
)

CREATE TABLE thanh_toan(
	id INT IDENTITY(1,1) PRIMARY KEY,
	id_hoa_don INT,
	id_nhan_vien INT,
	ngay_thanh_toan DATE,
	tien_thanh_toan DECIMAL(18,2),
	tien_thua DECIMAL(18,2),
	phuong_thuc_thanh_toan BIT,
	ma_qr VARCHAR(255),
	trang_thai BIT,
	FOREIGN KEY (id_hoa_don) REFERENCES hoa_don(id),
	FOREIGN KEY (id_nhan_vien) REFERENCES nhan_vien(id),
);

CREATE TABLE danh_gia (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_khach_hang INT,
  id_thong_tin_dat_phong INT,
  stars INT,
  nhan_xet NVARCHAR(255),
  ngay_tao DATETIME,
  ngay_sua DATETIME,
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id),
  FOREIGN KEY (id_thong_tin_dat_phong) REFERENCES thong_tin_dat_phong(id)
);

CREATE TABLE dich_vu_di_kem (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_dich_vu INT,
  id_loai_phong INT,
  trang_thai BIT,
  so_luong INT,
  CONSTRAINT unique_dichvu_loaiphong UNIQUE (id_dich_vu, id_loai_phong),
  FOREIGN KEY (id_dich_vu) REFERENCES dich_vu(id),
  FOREIGN KEY (id_loai_phong) REFERENCES loai_phong(id)
);

CREATE TABLE kiem_tra_phong(
	id INT IDENTITY(1,1) PRIMARY KEY,
	id_xep_phong INT,
	id_nhan_vien INT,
	thoi_gian_kiem_tra DATETIME,
	tinh_trang NVARCHAR(50),
	trang_thai NVARCHAR(50),
	FOREIGN KEY (id_xep_phong) REFERENCES xep_phong(id),
	FOREIGN KEY (id_nhan_vien) REFERENCES nhan_vien(id)
);

CREATE TABLE kiem_tra_vat_tu(
	id INT IDENTITY(1,1) PRIMARY KEY,
	id_kiem_tra_phong INT,
	id_vat_tu INT,
	so_luong INT, -- Đây là số lượng thực tế ở phòng
	tinh_trang NVARCHAR(50), -- Thiếu / Đủ / Hỏng
	ghi_chu NVARCHAR(255),
	FOREIGN KEY (id_kiem_tra_phong) REFERENCES kiem_tra_phong(id),
	FOREIGN KEY (id_vat_tu) REFERENCES vat_tu(id)
);

INSERT INTO vai_tro (ten_vai_tro, trang_thai)
VALUES 
('Admin', 1),
('User', 1);


INSERT INTO tai_khoan (id_vai_tro, ten_dang_nhap, mat_khau, trang_thai)
VALUES 
(1, 'admin', '$2a$12$TQ2F9v.MFTBrtO38gdoSUOdcmbTS5GkJ9ievghUJ1JgCOd0mvJrxS', 1),
(2, 'user', '$2a$12$HPUd4MGiGThQwn1dMQa3yO8qsiKD4O/CF1HiETvK0l9.uL0H5K48S', 1);


INSERT INTO nhan_vien (id_tai_khoan, cmnd, ho, ten, gioi_tinh, dia_chi, sdt, email, ngay_tao, ngay_sua, trang_thai)
VALUES 
(1, '123456789', 'Nguyen', 'An', 'Nam', '123 Nguyen Trai', '0901234567', 'an.nguyen@example.com', GETDATE(), GETDATE(), 1),
(2, '001204042060', 'Luu', 'Hung', 'Nam', '12 Xuan Thuy', '0911575888', 'hunglq@gmail.com', GETDATE(), GETDATE(), 1);


INSERT INTO khach_hang (id_tai_khoan, cmnd, ho, ten, gioi_tinh, dia_chi, sdt, email, ngay_tao, ngay_sua, trang_thai)
VALUES 
(2, '222333444', 'Thu', 'Chuc', 'Nu', '567 Tran Phu', '0843787882', 'nguyenchuc812@gmail.com', GETDATE(), GETDATE(), 1),
(2, '001204042061', 'Nguyen', 'Hien', 'Nu', 'Tuyen Quang', '0364573309', 'hiennt@gmail.com', GETDATE(), GETDATE(), 1);



INSERT INTO vat_tu (ten_vat_tu, gia, hinh_anh)
VALUES 
(N'Tivi', 5000000, ''),
(N'Tủ lạnh', 7000000, ''),
(N'Máy lạnh', 10000000, ''),
(N'Ghế sofa', 3000000, ''),
(N'Giường', 8000000, '');



INSERT INTO loai_phong (ma_loai_phong, ten_loai_phong, dien_tich, so_khach_toi_da, don_gia, don_gia_phu_thu, mo_ta)
VALUES 
('LP001', N'Phòng đơn', 25, 1, 500000, 100000, N'Phòng dành cho một khách.'),
('LP002', N'Phòng đôi', 35, 2, 800000, 150000, N'Phòng dành cho hai khách.'),
('LP003', N'Phòng gia đình', 60, 4, 1200000, 200000, N'Phòng rộng rãi dành cho gia đình.');



INSERT INTO vat_tu_loai_phong (id_loai_phong, id_vat_tu, so_luong)
VALUES 
(1, 1, 1), -- Phòng đơn có 1 Tivi
(1, 5, 1), -- Phòng đơn có 1 Giường
(2, 1, 1), -- Phòng đôi có 1 Tivi
(2, 5, 2), -- Phòng đôi có 2 Giường
(3, 1, 1); -- Phòng gia đình có 1 Tivi




INSERT INTO dich_vu (ten_dich_vu, don_gia, mo_ta, hinh_anh, trang_thai)
VALUES 
(N'Nước lọc (Chai)', 20000, N'Aqua', '', 1),
(N'Xoài (Đĩa)', 30000, N'Xoài chấm muối', '', 1),
(N'Bimbim (Gói)', 15000, N'Bimbim tự chọn', '', 1),
(N'Bữa sáng (Vé)', 150000, N'Bữa sáng tự chọn với nhiều món ăn hấp dẫn.', '', 1),
(N'Táo (Đĩa)', 100000, N'Apple', '', 1);

INSERT INTO phong (id_loai_phong, ma_phong, ten_phong, tinh_trang, trang_thai)
VALUES 
-- 6 phòng đơn
(1, 'P101', N'Phòng đơn 101', N'Trống', 1),
(1, 'P102', N'Phòng đơn 102', N'Trống', 1),
(1, 'P103', N'Phòng đơn 103', N'Trống', 1),
(1, 'P104', N'Phòng đơn 104', N'Trống', 1),
(1, 'P105', N'Phòng đơn 105', N'Trống', 1),
(1, 'P106', N'Phòng đơn 106', N'Trống', 1),
-- 8 phòng đôi
(2, 'P201', N'Phòng đôi 201', N'Trống', 1),
(2, 'P202', N'Phòng đôi 202', N'Trống', 1),
(2, 'P203', N'Phòng đôi 203', N'Trống', 1),
(2, 'P204', N'Phòng đôi 204', N'Trống', 1),
(2, 'P205', N'Phòng đôi 205', N'Trống', 1),
(2, 'P206', N'Phòng đôi 206', N'Trống', 1),
(2, 'P207', N'Phòng đôi 207', N'Trống', 1),
(2, 'P208', N'Phòng đôi 208', N'Trống', 1),
-- 8 phòng gia đình
(3, 'P301', N'Phòng gia đình 301', N'Trống', 1),
(3, 'P302', N'Phòng gia đình 302', N'Trống', 1),
(3, 'P303', N'Phòng gia đình 303', N'Trống', 1),
(3, 'P304', N'Phòng gia đình 304', N'Trống', 1),
(3, 'P305', N'Phòng gia đình 305', N'Trống', 1),
(3, 'P306', N'Phòng gia đình 306', N'Trống', 1),
(3, 'P307', N'Phòng gia đình 307', N'Trống', 1),
(3, 'P308', N'Phòng gia đình 308', N'Trống', 1);
