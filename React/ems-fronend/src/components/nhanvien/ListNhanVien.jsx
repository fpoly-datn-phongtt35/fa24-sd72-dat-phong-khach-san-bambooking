import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  searchNhanVien,
  updateNhanVien,
  deleteNhanVien,
} from "../../services/NhanVienService";

const ListNhanVien = () => {
  const [nhanVien, setNhanVien] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  // Quản lý nhân viên đã chọn
  const [taiKhoan, setTaiKhoan] = useState("");
  const [vaiTro, setVaiTro] = useState("");
  const [ho, setHo] = useState("");
  const [ten, setTen] = useState("");
  const [gioiTinh, setGioiTinh] = useState("");
  const [diaChi, setDiaChi] = useState("");
  const [sdt, setSdt] = useState("");
  const [email, setEmail] = useState("");
  const [ngayTao, setNgayTao] = useState("");
  const [ngaySua, setNgaySua] = useState("");
  const [trangThai, setTrangThai] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const pageSize = 5;
  const navigate = useNavigate();

  const fetchNhanVien = () => {
    searchNhanVien({ keyword: searchQuery, page: currentPage, size: pageSize })
      .then((response) => {
        setNhanVien(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.log("Có lỗi khi lấy danh sách nhân viên: " + error);
      });
  };

  useEffect(() => {
    fetchNhanVien();
  }, [currentPage, searchQuery]);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  function addNewNhanVien() {
    navigate("/add-nhanvien");
  }

  const handleEditClick = (id) => {
    navigate(`/update-nhan-vien/${id}`);
  };

 
  const handleUpdateNhanVien = (e) => {
    e.preventDefault(); // Ngăn chặn reload trang
    const nhanVien = {
      id: selectedEmployee.id,
      vaiTro,
      taiKhoan,
      ho,
      ten,
      gioiTinh,
      diaChi,
      sdt,
      email,
      ngayTao: new Date(ngayTao).toISOString(),
      ngaySua: new Date(ngaySua).toISOString(),
      trangThai,
    };

    updateNhanVien(nhanVien)
      .then((response) => {
        console.log("Cập nhật thành công:", response.data);
        setNhanVien((prev) =>
          prev.map((emp) => (emp.id === nhanVien.id ? nhanVien : emp))
        );
      })
      .catch((error) => {
        console.error(
          "Lỗi khi cập nhật nhân viên:",
          error.response?.data || error.message
        );
      });
  };

  const handleDeleteNhanVien = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      deleteNhanVien(id)
        .then((response) => {
          console.log("Phản hồi từ server:", response);
          setNhanVien((prev) => prev.filter((emp) => emp.id !== id));
          console.log("Xóa nhân viên thành công!");
        })
        .catch((error) => {
          // Kiểm tra xem error.response có tồn tại không
          const errorMessage = error.response
            ? error.response.data
            : error.message;
          console.error("Lỗi khi xóa nhân viên:", errorMessage);
        });
    }
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // reset lại trang khi tìm kiếm
  };



  return (
    <div className="container">
      <h5 className="my-3">Danh Sách Nhân Viên</h5>
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-outline-success btn-lg fs-6"
          onClick={addNewNhanVien}
        >
          <i className="bi bi-plus-circle"></i> Thêm
        </button>

        <div className="input-group ms-2 w-25">
          <input
            type="text"
            className="form-control form-control-lg fs-6"
            placeholder="Tìm kiếm nhân viên..."
            value={searchQuery}
            onChange={handleSearchInput}
          />
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ ten</th>
                <th>Giới Tính</th>
                <th>Địa Chỉ</th>
                <th>Số Điện Thoại</th>
                <th>Email</th>
                <th>Ngày Tạo</th>
                <th>Ngày Sửa</th>
                <th>Trạng Thái</th>
                <th>Hành Động</th>
              </tr>
            </thead>
            <tbody>
              {nhanVien.length > 0 ? (
                nhanVien.map((nv) => (
                  <tr key={nv.id}>
                    <td>{nv.id}</td>
                    <td>{nv.ho + " " + nv.ten}</td>
                    <td>{nv.gioiTinh}</td>
                    <td>{nv.diaChi}</td>
                    <td>{nv.sdt}</td>
                    <td>{nv.email}</td>
                    <td>{new Date(nv.ngayTao).toLocaleDateString("vi-VN")}</td>
                    <td>{new Date(nv.ngaySua).toLocaleDateString("vi-VN")}</td>
                    <td>{nv.trangThai}</td>
                    <td>
                      <button onClick={() => handleEditClick(nv.id)}>Update</button>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteNhanVien(nv.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center">
                    Không có nhân viên
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="d-flex justify-content-center my-3">
            <button
              className="btn btn-outline-primary me-2"
              disabled={currentPage === 0}
              onClick={handlePreviousPage}
            >
              Previous
            </button>
            <span className="align-self-center" style={{ marginTop: "7px" }}>
              Page {currentPage + 1} / {totalPages}
            </span>
            <button
              className="btn btn-outline-primary ms-2"
              disabled={currentPage + 1 >= totalPages}
              onClick={handleNextPage}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListNhanVien;
