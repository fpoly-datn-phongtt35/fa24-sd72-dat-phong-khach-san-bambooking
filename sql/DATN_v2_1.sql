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
);

CREATE TABLE khach_hang (
  id INT IDENTITY(1,1) PRIMARY KEY,
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
  FOREIGN KEY (id_tai_khoan) REFERENCES tai_khoan(id)
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
  gia_phong DECIMAL(18,2),
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

