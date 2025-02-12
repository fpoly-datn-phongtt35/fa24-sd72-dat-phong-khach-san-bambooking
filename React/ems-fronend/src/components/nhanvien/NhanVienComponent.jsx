import { useState, useEffect } from "react";
import { createNhanVien, updateNhanVien, getNhanVienById } from "../../services/NhanVienService";
import { getVaiTroList } from "../../services/VaiTroService";
import { useNavigate, useParams } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';


const NhanVienComponent = () => {
  const [formData, setFormData] = useState({
    vaiTro: "",
    ho: "",
    ten: "",
    gioiTinh: "Nam",
    diaChi: "",
    sdt: "",
    email: "",
    ngayTao: "",
    ngaySua: "",
    trangThai: true,
  });

  const [listVaiTro, setListVaiTro] = useState([]);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { id } = useParams();

  const formatDateString = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.toISOString().split("T")[0] : "";
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const vaiTroResponse = await getVaiTroList();
        setListVaiTro(vaiTroResponse);

        if (id) {
          const nhanVienResponse = await getNhanVienById(id);
          const nhanVien = nhanVienResponse.data;
          setFormData({
            ...nhanVien,
            vaiTro: nhanVien.vaiTro?.id.toString() || "",
            ngayTao: formatDateString(nhanVien.ngayTao),
            ngaySua: formatDateString(nhanVien.ngaySua),
          });
        }
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        toast.error("Có lỗi xảy ra khi tải dữ liệu");
      }
    };

    fetchInitialData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData((prevData) => ({ ...prevData, [name]: newValue }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.vaiTro) newErrors.vaiTro = "Vui lòng chọn vai trò";
    if (!formData.ho.trim()) newErrors.ho = "Họ không được để trống";
    if (!formData.cmnd.trim()) newErrors.ho = "Cmnd không được để trống";
    if (!formData.ten.trim()) newErrors.ten = "Tên không được để trống";
    if (!formData.email.trim()) newErrors.email = "Email không được để trống";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email không hợp lệ";
    if (!formData.sdt.trim()) newErrors.sdt = "Số điện thoại không được để trống";
    else if (!/^\d{10}$/.test(formData.sdt)) newErrors.sdt = "Số điện thoại phải có 10 chữ số";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveNhanVien = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
        Swal.fire({
            title: 'Lỗi!',
            text: 'Vui lòng kiểm tra lại thông tin nhập.',
            icon: 'error',
            confirmButtonText: 'OK',
        });
        return;
    }

    const payload = {
        ...formData,
        vaiTro: { id: parseInt(formData.vaiTro) },
    };

    try {
        const currentDate = new Date().toISOString().split("T")[0];
        if (id) {
            payload.ngaySua = currentDate;
            await updateNhanVien(id, payload);
            Swal.fire({
                title: 'Thành công!',
                text: 'Cập nhật nhân viên thành công!',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        } else {
            payload.ngayTao = currentDate;
            await createNhanVien(payload);
            Swal.fire({
                title: 'Thành công!',
                text: 'Thêm nhân viên thành công!',
                icon: 'success',
                confirmButtonText: 'OK',
            });
        }
        navigate("/NhanVien");
    } catch (error) {
        console.error("Lỗi khi lưu nhân viên:", error);
        Swal.fire({
            title: 'Lỗi!',
            text: 'Có lỗi xảy ra khi lưu nhân viên. Vui lòng thử lại.',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }
};


  return (
    <div className="container">
      <ToastContainer />
      <br />
      <div className="row">
        <div className="card">
          <div className="card-header text-center">
            <h2>{id ? "Cập Nhật Nhân Viên" : "Thêm Nhân Viên"}</h2>
          </div>
          <div className="col-md-6 offset-md-3">
            <div className="card-body">
              <form onSubmit={saveNhanVien}>
                <div className="mb-3">
                  <label className="form-label">Vai Trò</label>
                  <select
                    className={`form-select ${errors.vaiTro ? 'is-invalid' : ''}`}
                    name="vaiTro"
                    value={formData.vaiTro}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Chọn vai trò</option>
                    {listVaiTro.map((vt) => (
                      <option key={vt.id} value={vt.id.toString()}>
                        {vt.tenVaiTro}
                      </option>
                    ))}
                  </select>
                  {errors.vaiTro && <div className="invalid-feedback">{errors.vaiTro}</div>}
                </div>

                <div className="form-group mb-2">
                  <label>cmnd</label>
                  <input
                    type="text"
                    name="cmnd"
                    value={formData.cmnd}
                    className={`form-control ${errors.ho ? 'is-invalid' : ''}`}
                    onChange={handleInputChange}
                  />
                  {errors.cmnd && <div className="invalid-feedback">{errors.cmnd}</div>}
                </div>

                <div className="form-group mb-2">
                  <label>Họ</label>
                  <input
                    type="text"
                    name="ho"
                    value={formData.ho}
                    className={`form-control ${errors.ho ? 'is-invalid' : ''}`}
                    onChange={handleInputChange}
                  />
                  {errors.ho && <div className="invalid-feedback">{errors.ho}</div>}
                </div>

                <div className="form-group mb-2">
                  <label>Tên</label>
                  <input
                    type="text"
                    name="ten"
                    value={formData.ten}
                    className={`form-control ${errors.ten ? 'is-invalid' : ''}`}
                    onChange={handleInputChange}
                  />
                  {errors.ten && <div className="invalid-feedback">{errors.ten}</div>}
                </div>

                <div className="form-group mb-2">
                  <label className="form-label">Giới tính</label>
                  <div className="d-flex align-items-center">
                    <div className="form-check me-3">
                      <input
                        className="form-check-input-sm"
                        type="radio"
                        name="gioiTinh"
                        value="Nam"
                        checked={formData.gioiTinh === "Nam"}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label">Nam</label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input-sm"
                        type="radio"
                        name="gioiTinh"
                        value="Nữ"
                        checked={formData.gioiTinh === "Nữ"}
                        onChange={handleInputChange}
                      />
                      <label className="form-check-label">Nữ</label>
                    </div>
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
                    className={`form-control ${errors.sdt ? 'is-invalid' : ''}`}
                    onChange={handleInputChange}
                  />
                  {errors.sdt && <div className="invalid-feedback">{errors.sdt}</div>}
                </div>

                <div className="form-group mb-2">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>

                <div className="form-group mb-2">
                  <label className="form-label">Trạng Thái</label>
                  <div className="form-check">
                    <input
                      className="form-check-input-sm"
                      type="checkbox"
                      name="trangThai"
                      checked={formData.trangThai}
                      onChange={handleInputChange}
                    />
                    <label className="form-check-label">
                      {formData.trangThai ? "Active" : "Inactive"}
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