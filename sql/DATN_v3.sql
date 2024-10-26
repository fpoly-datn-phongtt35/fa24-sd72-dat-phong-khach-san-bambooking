Create database DATN_v3
go
use DATN_v3 
go

CREATE TABLE vai_tro (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ten_vai_tro NVARCHAR (255),
  trang_thai BIT
);

CREATE TABLE tai_khoan (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ten_dang_nhap VARCHAR (255) UNIQUE,
  mat_khau VARCHAR (255),
  trang_thai BIT
);

CREATE TABLE nhan_vien (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_vai_tro INT,
  id_tai_khoan INT,
  ho NVARCHAR(255),
  ten NVARCHAR(255),
  gioi_tinh NVARCHAR(255),
  dia_chi NVARCHAR(255),
  sdt VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  ngay_tao DATETIME,
  ngay_sua DATETIME,
  trang_thai BIT,
  FOREIGN KEY (id_vai_tro) REFERENCES vai_tro(id),
  FOREIGN KEY (id_tai_khoan) REFERENCES tai_khoan(id)
);

CREATE TABLE khach_hang (
  id INT IDENTITY(1,1) PRIMARY KEY,
  ho NVARCHAR(255),
  ten NVARCHAR(255),
  gioi_tinh NVARCHAR(255),
  dia_chi NVARCHAR(255),
  sdt VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  mat_khau VARCHAR (255),
  ngay_tao DATETIME,
  ngay_sua DATETIME,
  trang_thai BIT,
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
  so_khach_toi_da INT,
  don_gia DECIMAL(18,2),
  don_gia_phu_thu DECIMAL(18,2),
  mo_ta NVARCHAR(255)
);

CREATE TABLE tien_ich_phong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_loai_phong INT,
  id_tien_ich INT,
  CONSTRAINT unique_tienich_loaiphong UNIQUE (id_tien_ich, id_loai_phong),
  FOREIGN KEY (id_loai_phong) REFERENCES loai_phong(id),
  FOREIGN KEY (id_tien_ich) REFERENCES tien_ich(id)
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
  dat_coc DECIMAL(18,2),
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
  trang_thai NVARCHAR(255),
  FOREIGN KEY (id_dat_phong) REFERENCES dat_phong(id),
  FOREIGN KEY (id_loai_phong) REFERENCES loai_phong(id)
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

CREATE TABLE dich_vu_di_kem (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_dich_vu INT,
  id_loai_phong INT,
  trang_thai BIT,
  CONSTRAINT unique_dichvu_loaiphong UNIQUE (id_dich_vu, id_loai_phong),
  FOREIGN KEY (id_dich_vu) REFERENCES dich_vu(id),
  FOREIGN KEY (id_loai_phong) REFERENCES loai_phong(id)
);

CREATE TABLE tra_phong (
  id INT IDENTITY(1,1) PRIMARY KEY,
  id_xep_phong INT,
  ngay_tra_thuc_te DATETIME,
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
  FOREIGN KEY (id_tra_phong) REFERENCES tra_phong(id),
  FOREIGN KEY (id_hoa_don) REFERENCES hoa_don(id)
);
--Dừng ở đây
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