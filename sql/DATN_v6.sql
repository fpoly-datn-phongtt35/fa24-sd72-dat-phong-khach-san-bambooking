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
  trang_thai BIT,
  FOREIGN KEY (id_thong_tin_dat_phong) REFERENCES thong_tin_dat_phong(id),
  FOREIGN KEY (id_phong) REFERENCES phong(id)
);

CREATE TABLE dich_vu_su_dung(
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_dich_vu INT,
  id_xep_phong INT,
  so_luong_su_dung INT,
  ngay_bat_dau DATETIME,
  ngay_ket_thuc DATETIME,
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
    id_nhan_vien INT,
    id_xep_phong INT,
    ngay_tra_phong_thuc_te DATETIME,
    trang_thai BIT,
    FOREIGN KEY (id_nhan_vien) REFERENCES nhan_vien(id),
    FOREIGN KEY (id_xep_phong) REFERENCES xep_phong(id)
);

CREATE TABLE thong_tin_hoa_don (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_tra_phong INT,
  id_hoa_don INT,
  tien_dich_vu DECIMAL(18,2),
  tien_phong DECIMAL(18,2),
  tien_phu_thu DECIMAL(18,2),
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
  id_loai_phong INT,
  stars INT,
  nhan_xet NVARCHAR(255),
  ngay_tao DATETIME,
  ngay_sua DATETIME,
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id),
  FOREIGN KEY (id_loai_phong) REFERENCES loai_phong(id)
);
CREATE TABLE dich_vu_di_kem (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_dich_vu INT,
  id_loai_phong INT,
  trang_thai BIT,
  CONSTRAINT unique_dichvu_loaiphong UNIQUE (id_dich_vu, id_loai_phong),
  FOREIGN KEY (id_dich_vu) REFERENCES dich_vu(id),
  FOREIGN KEY (id_loai_phong) REFERENCES loai_phong(id)
);
CREATE TABLE kiem_tra_phong(
	id INT IDENTITY(1,1) PRIMARY KEY,
	id_tra_phong INT,
	ten_vat_tu NVARCHAR(255),
	so_luong INT,
	trang_thai VARCHAR(255),
	FOREIGN KEY (id_tra_phong) REFERENCES tra_phong(id),
)


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
(1, '123456789', 'Nguyen', 'An', 'Nam', '123 Nguyen Trai', '0901234567', 'an.nguyen@example.com', GETDATE(), GETDATE(), 1);



INSERT INTO khach_hang (id_tai_khoan, cmnd, ho, ten, gioi_tinh, dia_chi, sdt, email, ngay_tao, ngay_sua, trang_thai)
VALUES 
(2, '222333444', 'Thu', 'Chuc', 'Nu', '567 Tran Phu', '0843787882', 'nguyenchuc812@gmail.com', GETDATE(), GETDATE(), 1);



INSERT INTO vat_tu (ten_vat_tu, gia, hinh_anh)
VALUES 
(N'Tivi', 5000000, 'tivi.png'),
(N'Tủ lạnh', 7000000, 'tu_lanh.png'),
(N'Máy lạnh', 10000000, 'may_lanh.png'),
(N'Ghế sofa', 3000000, 'sofa.png'),
(N'Giường', 8000000, 'giuong.png');



INSERT INTO loai_phong (ma_loai_phong, ten_loai_phong, dien_tich, so_khach_toi_da, don_gia, don_gia_phu_thu, mo_ta)
VALUES 
('LP001', N'Phòng đơn', 25, 1, 500000, 100000, N'Phòng dành cho một khách.'),
('LP002', N'Phòng đôi', 35, 2, 800000, 150000, N'Phòng dành cho hai khách.'),
('LP003', N'Phòng gia đình', 50, 4, 1200000, 200000, N'Phòng rộng rãi dành cho gia đình.'),
('LP004', N'Phòng VIP', 70, 3, 2000000, 300000, N'Phòng cao cấp với đầy đủ tiện nghi.'),
('LP005', N'Phòng tập thể', 100, 10, 300000, 50000, N'Phòng dành cho nhóm đông người.');



INSERT INTO vat_tu_loai_phong (id_loai_phong, id_vat_tu, so_luong)
VALUES 
(1, 1, 1), -- Phòng đơn có 1 Tivi
(1, 5, 1), -- Phòng đơn có 1 Giường
(2, 1, 1), -- Phòng đôi có 1 Tivi
(2, 5, 2), -- Phòng đôi có 2 Giường
(3, 1, 1); -- Phòng gia đình có 1 Tivi




INSERT INTO dich_vu (ten_dich_vu, don_gia, mo_ta, hinh_anh, trang_thai)
VALUES 
(N'Spa', 500000, N'Dịch vụ spa thư giãn.', 'spa.png', 1),
(N'Bể bơi', 300000, N'Sử dụng bể bơi trong ngày.', 'be_boi.png', 1),
(N'Gym', 200000, N'Tập gym với thiết bị hiện đại.', 'gym.png', 1),
(N'Bữa sáng', 150000, N'Bữa sáng tự chọn với nhiều món ăn hấp dẫn.', 'buffet_sang.png', 1),
(N'Dịch vụ giặt là', 100000, N'Giặt ủi quần áo trong ngày.', 'giat_ui.png', 1);




INSERT INTO phong (id_loai_phong, ma_phong, ten_phong, tinh_trang, trang_thai)
VALUES 
(1, 'P101', N'Phòng đơn 101', N'Trống', 1),
(2, 'P201', N'Phòng đôi 201', N'Trống', 1),
(3, 'P301', N'Phòng gia đình 301', N'Đang sử dụng', 1),
(4, 'P401', N'Phòng VIP 401', N'Trống', 1),
(5, 'P501', N'Phòng tập thể 501', N'Trống', 1);




INSERT INTO hinh_anh (id_phong, ten, duong_dan, trang_thai)
VALUES 
(1, N'Hình ảnh phòng đơn', 'phong_don_101.png', 1),
(2, N'Hình ảnh phòng đôi', 'phong_doi_201.png', 1),
(3, N'Hình ảnh phòng gia đình', 'phong_gia_dinh_301.png', 1),
(4, N'Hình ảnh phòng VIP', 'phong_vip_401.png', 1),
(5, N'Hình ảnh phòng tập thể', 'phong_tap_the_501.png', 1);



INSERT INTO dat_phong (id_khach_hang, ma_dat_phong, ngay_dat, tong_tien, ghi_chu, trang_thai)
VALUES 
(1, 'DP001', '2024-12-01', 2000000, N'Đặt phòng cho gia đình.', N'Đã xác nhận');



INSERT INTO thong_tin_dat_phong (id_dat_phong, id_loai_phong, ma_thong_tin_dat_phong, ngay_nhan_phong, ngay_tra_phong, so_nguoi, gia_dat, ghi_chu, trang_thai)
VALUES 
(1, 3, 'TTDP001', '2024-12-10', '2024-12-12', 4, 2000000, N'Yêu cầu phòng tầng cao.', N'Đã xác nhận');



INSERT INTO khach_hang_checkin (id_thong_tin_dat_phong, id_khach_hang, trang_thai)
VALUES 
(1, 1, 1); -- Khách hàng 1 đã check-in cho thông tin đặt phòng 1


INSERT INTO xep_phong (id_phong, id_thong_tin_dat_phong, ngay_nhan_phong, ngay_tra_phong, trang_thai)
VALUES (1, 1, '2024-12-10 14:00:00', '2024-12-12 12:00:00', 1);



INSERT INTO dich_vu (ten_dich_vu, don_gia, mo_ta, hinh_anh, trang_thai)
VALUES (N'Dịch vụ ăn sáng', 50000, N'Ăn sáng buffet', NULL, 1);



INSERT INTO dich_vu_su_dung (id_dich_vu, id_xep_phong, so_luong_su_dung, ngay_bat_dau, ngay_ket_thuc, gia_su_dung, trang_thai)
VALUES (1, 1, 2, '2024-12-10 07:00:00', '2024-12-10 09:00:00', 100000, 1);



INSERT INTO hoa_don (id_nhan_vien, id_dat_phong, ma_hoa_don, tong_tien, ngay_tao, trang_thai)
VALUES (1, 1, 'HD001', 3100000, '2024-12-12 15:00:00', N'Đã thanh toán');



INSERT INTO tra_phong (id_nhan_vien, id_xep_phong, ngay_tra_phong_thuc_te, trang_thai)
VALUES (1, 1, '2023-10-01 14:30:00', 1);


INSERT INTO thong_tin_hoa_don (id_tra_phong, id_hoa_don, tien_dich_vu, tien_phong, tien_phu_thu)
VALUES (1, 1, 500000.00, 2000000.00, 300000.00);



INSERT INTO phu_thu (id_xep_phong, ten_phu_thu, tien_phu_thu, so_luong, trang_thai)
VALUES (1, N'Phí dịch vụ', 100000.00, 2, N'Hoàn thành');



INSERT INTO thanh_toan (id_hoa_don, id_nhan_vien, ngay_thanh_toan, tien_thanh_toan, tien_thua, phuong_thuc_thanh_toan, ma_qr, trang_thai)
VALUES (1, 1, '2024-12-31', 3000000.00, 0.00, 1, 'QR123456', 1);



INSERT INTO danh_gia (id_khach_hang, id_loai_phong, stars, nhan_xet, ngay_tao, ngay_sua, trang_thai)
VALUES (1, 1, 5, N'Phòng rất tốt, dịch vụ tuyệt vời!', GETDATE(), GETDATE(), N'Hoạt động');



INSERT INTO dich_vu_di_kem (id_dich_vu, id_loai_phong, trang_thai)
VALUES (1, 1, 1); 



INSERT INTO kiem_tra_phong (id_tra_phong, ten_vat_tu, so_luong, trang_thai)
VALUES (1, N'Tivi', 1, N'Hoạt động');







