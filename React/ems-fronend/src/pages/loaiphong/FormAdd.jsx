import React, { useState } from "react";
import { addLoaiPhong } from "../../services/LoaiPhongService";
import Swal from "sweetalert2";

const FormAdd = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    tenLoaiPhong: "",
    maLoaiPhong: "",
    dienTich: "",
    soKhachTieuChuan: "",
    soKhachToiDa: "",
    treEmTieuChuan: "",
    treEmToiDa: "",
    donGia: "",
    phuThuNguoiLon: "",
    phuThuTreEm: "",
    moTa: "",
    trangThai: true,
  });

  // Hàm xử lý thay đổi giá trị input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (
      [
        "dienTich",
        "soKhachTieuChuan",
        "soKhachToiDa",
        "treEmTieuChuan",
        "treEmToiDa",
        "donGia",
        "phuThuNguoiLon",
        "phuThuTreEm",
      ].includes(name)
    ) {
      // Chỉ cho phép số không âm hoặc chuỗi rỗng
      if (value >= 0 || value === "") {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } else if (name === "trangThai") {
      setFormData({
        ...formData,
        [name]: value === "true",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Hàm xử lý submit form
  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra các trường bắt buộc
    const requiredFields = [
      { field: "tenLoaiPhong", message: "Tên loại phòng không được để trống!" },
      { field: "maLoaiPhong", message: "Mã loại phòng không được để trống!" },
      { field: "dienTich", message: "Diện tích phải là số không âm!" },
      {
        field: "soKhachTieuChuan",
        message: "Số khách tiêu chuẩn phải là số không âm!",
      },
      {
        field: "soKhachToiDa",
        message: "Số khách tối đa phải là số không âm!",
      },
      {
        field: "treEmTieuChuan",
        message: "Số trẻ em tiêu chuẩn phải là số không âm!",
      },
      { field: "treEmToiDa", message: "Số trẻ em tối đa phải là số không âm!" },
      { field: "donGia", message: "Đơn giá phải là số không âm!" },
      {
        field: "phuThuNguoiLon",
        message: "Phụ thu người lớn phải là số không âm!",
      },
      { field: "phuThuTreEm", message: "Phụ thu trẻ em phải là số không âm!" },
      { field: "moTa", message: "Mô tả không được để trống!" },
    ];

    for (const { field, message } of requiredFields) {
      if (formData[field] === "" || formData[field] < 0) {
        Swal.fire({
          title: "Lỗi!",
          text: message,
          icon: "error",
          confirmButtonText: "OK",
        });
        return;
      }
    }

    Swal.fire({
      title: "Xác nhận thêm mới",
      text: "Bạn có chắc chắn muốn thêm loại phòng mới?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Đồng ý",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        addLoaiPhong(formData)
          .then((response) => {
            console.log("Thêm mới thành công:", response.data);
            Swal.fire({
              title: "Thành công!",
              text: "Loại phòng mới đã được thêm.",
              icon: "success",
              confirmButtonText: "OK",
            });
            handleClose();
          })
          .catch((error) => {
            console.error("Lỗi khi thêm mới:", error);
            Swal.fire({
              title: "Lỗi!",
              text: "Không thể thêm loại phòng. Vui lòng thử lại sau!",
              icon: "error",
              confirmButtonText: "OK",
            });
          });
      }
    });
  };

  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex={-1}
      role="dialog"
      style={{ backgroundColor: show ? "rgba(0, 0, 0, 0.5)" : "transparent" }}
    >
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title">Thêm Loại Phòng</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="tenLoaiPhong" className="form-label">
                    Tên Loại Phòng
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="tenLoaiPhong"
                    name="tenLoaiPhong"
                    value={formData.tenLoaiPhong}
                    onChange={handleInputChange}
                    placeholder="Nhập tên loại phòng"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="maLoaiPhong" className="form-label">
                    Mã Loại Phòng
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="maLoaiPhong"
                    name="maLoaiPhong"
                    value={formData.maLoaiPhong}
                    onChange={handleInputChange}
                    placeholder="Nhập mã loại phòng"
                    required
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="soKhachTieuChuan" className="form-label">
                    Số Khách Tiêu Chuẩn
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="soKhachTieuChuan"
                    name="soKhachTieuChuan"
                    value={formData.soKhachTieuChuan}
                    onChange={handleInputChange}
                    placeholder="Nhập số khách tiêu chuẩn"
                    required
                    min="0"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="soKhachToiDa" className="form-label">
                    Số Khách Tối Đa
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="soKhachToiDa"
                    name="soKhachToiDa"
                    value={formData.soKhachToiDa}
                    onChange={handleInputChange}
                    placeholder="Nhập số khách tối đa"
                    required
                    min="0"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="treEmTieuChuan" className="form-label">
                    Số Trẻ Em Tiêu Chuẩn
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="treEmTieuChuan"
                    name="treEmTieuChuan"
                    value={formData.treEmTieuChuan}
                    onChange={handleInputChange}
                    placeholder="Nhập số trẻ em tiêu chuẩn"
                    required
                    min="0"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="treEmToiDa" className="form-label">
                    Số Trẻ Em Tối Đa
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="treEmToiDa"
                    name="treEmToiDa"
                    value={formData.treEmToiDa}
                    onChange={handleInputChange}
                    placeholder="Nhập số trẻ em tối đa"
                    required
                    min="0"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="dienTich" className="form-label">
                    Diện Tích (m²)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="dienTich"
                    name="dienTich"
                    value={formData.dienTich}
                    onChange={handleInputChange}
                    placeholder="Nhập diện tích"
                    required
                    min="0"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="donGia" className="form-label">
                    Đơn Giá (VND)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="donGia"
                    name="donGia"
                    value={formData.donGia}
                    onChange={handleInputChange}
                    placeholder="Nhập đơn giá"
                    required
                    min="0"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="phuThuNguoiLon" className="form-label">
                    Phụ Thu Người Lớn (VND)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="phuThuNguoiLon"
                    name="phuThuNguoiLon"
                    value={formData.phuThuNguoiLon}
                    onChange={handleInputChange}
                    placeholder="Nhập phụ thu người lớn"
                    required
                    min="0"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="phuThuTreEm" className="form-label">
                    Phụ Thu Trẻ Em (VND)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="phuThuTreEm"
                    name="phuThuTreEm"
                    value={formData.phuThuTreEm}
                    onChange={handleInputChange}
                    placeholder="Nhập phụ thu trẻ em"
                    required
                    min="0"
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 mb-3">
                  <label htmlFor="moTa" className="form-label">
                    Mô Tả
                  </label>
                  <textarea
                    className="form-control"
                    id="moTa"
                    name="moTa"
                    value={formData.moTa}
                    onChange={handleInputChange}
                    placeholder="Nhập mô tả loại phòng"
                    rows="4"
                    required
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="trangThai" className="form-label">
                    Trạng Thái
                  </label>
                  <select
                    className="form-select"
                    id="trangThai"
                    name="trangThai"
                    value={formData.trangThai}
                    onChange={handleInputChange}
                    required
                  >
                    <option value={true}>Kích Hoạt</option>
                    <option value={false}>Không Kích Hoạt</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleClose}
                >
                  Đóng
                </button>
                <button type="submit" className="btn btn-primary">
                  Lưu
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAdd;
