import React, { useState, useEffect } from "react";
import { createNhanVien, updateNhanVien, getNhanVienById } from "../../services/NhanVienService";
import { getTaiKhoanList } from "../../services/TaiKhoanService";
import { getVaiTroList } from "../../services/VaiTroService";
import { useNavigate, useParams } from "react-router-dom";

const NhanVienComponent = () => {
  const [formData, setFormData] = useState({
    taiKhoan: "",
    vaiTro: "",
    ho: "",
    ten: "",
    gioiTinh: "Nam",
    diaChi: "",
    sdt: "",
    email: "",
    ngayTao: "",
    ngaySua: "",
    trangThai: "active",
  });

  const [listVaiTro, setListVaiTro] = useState([]);
  const [listTaiKhoan, setListTaiKhoan] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  const formatDateString = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return !isNaN(date) ? date.toISOString().split("T")[0] : dateString;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const vaiTroResponse = await getVaiTroList();
        setListVaiTro(vaiTroResponse);

        const taiKhoanResponse = await getTaiKhoanList();
        setListTaiKhoan(taiKhoanResponse);

        if (id) {
          const nhanVienResponse = await getNhanVienById(id);
          const nhanVien = nhanVienResponse.data;
          setFormData({
            ...nhanVien,
            taiKhoan: nhanVien.taiKhoan?.id || "",
            vaiTro: nhanVien.vaiTro?.id || "",
            ngayTao: formatDateString(nhanVien.ngayTao),
            ngaySua: formatDateString(nhanVien.ngaySua),
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      }
    };

    fetchInitialData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const saveNhanVien = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      taiKhoan: { id: parseInt(formData.taiKhoan) }, // Sửa thành đối tượng
      vaiTro: { id: parseInt(formData.vaiTro) }, // Sửa thành đối tượng
    };

    try {
      if (id) {
        payload.ngaySua = new Date().toISOString().split("T")[0]; // Cập nhật ngày sửa
        await updateNhanVien(id, payload);
        alert("Cập nhật nhân viên thành công!");
      } else {
        payload.ngayTao = new Date().toISOString().split("T")[0]; // Cập nhật ngày tạo
        await createNhanVien(payload);
        alert("Thêm nhân viên thành công!");
      }
      navigate("/NhanVien");
    } catch (error) {
      console.error("Lỗi khi lưu nhân viên:", error);
      alert("Có lỗi xảy ra khi lưu nhân viên.");
    }
  };



  return (
    <div className="container">
      <br />
      <div className="row">
        <div className="card">
          <div className="text-center">
            {id ? "Cập Nhật Nhân Viên" : "Thêm Nhân Viên"}
          </div>
          <div className="col-md-6 offset-md-3">
            <div className="card-body">
              <form onSubmit={saveNhanVien}>
                <div className="mb-3">
                  <label className="form-label">Tài Khoản</label>
                  <select
                    className="form-select"
                    name="taiKhoan"
                    value={formData.taiKhoan}
                    onChange={handleSelectChange}
                    required
                  >
                    <option value="">Chọn tài khoản</option>
                    {listTaiKhoan.map((tk) => (
                      <option key={tk.id} value={tk.id}>
                        {tk.tenDangNhap}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Vai Trò</label>
                  <select
                    className="form-select"
                    name="vaiTro"
                    value={formData.vaiTro}
                    onChange={handleSelectChange}
                    required
                  >
                    <option value="">Chọn vai trò</option>
                    {listVaiTro.map((vt) => (
                      <option key={vt.id} value={vt.id}>
                        {vt.tenVaiTro}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group mb-2">
                  <label>Họ</label>
                  <input
                    type="text"
                    name="ho"
                    value={formData.ho}
                    className="form-control"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group mb-2">
                  <label>Tên</label>
                  <input
                    type="text"
                    name="ten"
                    value={formData.ten}
                    className="form-control"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group mb-2">
                  <label>Giới tính</label>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="gioiTinh"
                        value="Nam"
                        checked={formData.gioiTinh === "Nam"}
                        onChange={handleInputChange}
                      />
                      Nam
                    </label>
                    <label className="ms-3">
                      <input
                        type="radio"
                        name="gioiTinh"
                        value="Nữ"
                        checked={formData.gioiTinh === "Nữ"}
                        onChange={handleInputChange}
                      />
                      Nữ
                    </label>
                  </div>
                </div>

                <div className="form-group mb-2">
                  <label>Địa chỉ</label>
                  <input
                    type="text"
                    name="diaChi"
                    value={formData.diaChi}
                    className="form-control"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group mb-2">
                  <label>Số điện thoại</label>
                  <input
                    type="text"
                    name="sdt"
                    value={formData.sdt}
                    className="form-control"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group mb-2">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    className="form-control"
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group mb-2">
                  <label>Ngày Tạo</label>
                  <input
                    type="date"
                    name="ngayTao"
                    value={formData.ngayTao || ""}
                    className="form-control"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group mb-2">
                  <label>Ngày Sửa</label>
                  <input
                    type="date"
                    name="ngaySua"
                    value={formData.ngaySua || ""}
                    className="form-control"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group mb-2">
                  <label>Trạng Thái</label>
                  <div>
                    <label>
                      <input
                        type="radio"
                        name="trangThai"
                        value="active"
                        checked={formData.trangThai === "active"}
                        onChange={handleInputChange}
                      />
                      Active
                    </label>
                    <label className="ms-3">
                      <input
                        type="radio"
                        name="trangThai"
                        value="inactive"
                        checked={formData.trangThai === "inactive"}
                        onChange={handleInputChange}
                      />
                      Inactive
                    </label>
                  </div>
                </div>

                <button className="btn btn-success" type="submit">
                  {id ? "Cập Nhật" : "Thêm"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NhanVienComponent;
