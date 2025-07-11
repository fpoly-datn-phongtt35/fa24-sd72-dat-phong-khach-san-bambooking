import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchNhanVien, deleteNhanVien } from "../../services/NhanVienService";
import useDebounce from "../../utils/useDebounce";


const ListNhanVien = () => {
  const [nhanVien, setNhanVien] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 500); // Debounce 500ms
  const pageSize = 5;
  const navigate = useNavigate();

  const fetchNhanVien = async () => {
    const response = await searchNhanVien({
      keyword: debouncedSearchQuery, // Sử dụng giá trị debounce
      page: currentPage,
      size: pageSize,
    });
    setNhanVien(response.data.content);
    setTotalPages(response.data.totalPages);
  };

  useEffect(() => {
    fetchNhanVien();
  }, [currentPage, debouncedSearchQuery]); // Chỉ fetch khi debounce hoàn tất hoặc chuyển trang

  const formatDateString = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return isNaN(date) ? dateString : date.toLocaleDateString("vi-VN");
  };

  const handleDeleteNhanVien = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa nhân viên này?")) {
      try {
        await deleteNhanVien(id);
        setNhanVien((prev) => prev.filter((emp) => emp.id !== id));
        console.log("Xóa nhân viên thành công!");
      } catch (error) {
        console.error("Lỗi khi xóa nhân viên: ", error.message);
      }
    }
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0);
    searchNhanVien({
      keyword: e.target.value,
      page: 0,
      size: pageSize,
    }).then((response) => {
      setNhanVien(response.data.content);
      setTotalPages(response.data.totalPages);
    });
  };


  return (
    <div className="container">
      <h5 className="my-3">Danh Sách Nhân Viên</h5>
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-outline-success btn-lg fs-6"
          onClick={() => navigate("/add-nhanvien")}
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
                <th>ID Tài khoản</th>
                <th>cmnd</th>
                <th>Họ</th>
                <th>Tên</th>
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
                    <td>{nv.taiKhoan.tenDangNhap}</td>
                    <td>{nv.cmnd}</td>
                    <td>{nv.ho}</td>
                    <td>{nv.ten}</td>
                    <td>{nv.gioiTinh}</td>
                    <td>{nv.diaChi}</td>
                    <td>{nv.sdt}</td>
                    <td>{nv.email}</td>
                    <td>{formatDateString(nv.ngayTao)}</td>
                    <td>{formatDateString(nv.ngaySua)}</td>
                    <td>{nv.trangThai ? "Active" : "Inactive"}</td>
                    <td>
                      <button
                        className="btn btn-warning"
                        onClick={() => navigate(`/update-nhan-vien/${nv.id}`)}
                      >
                        Update
                      </button>
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
                  <td colSpan="13" className="text-center">
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
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </button>
            <span className="align-self-center" style={{ marginTop: "7px" }}>
              Page {currentPage + 1} / {totalPages}
            </span>
            <button
              className="btn btn-outline-primary ms-2"
              disabled={currentPage + 1 >= totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
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
