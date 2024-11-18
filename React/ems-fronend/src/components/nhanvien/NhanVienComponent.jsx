// import React, { useState, useEffect } from "react";
// import { createNhanVien, updateNhanVien, getNhanVienById } from "../../services/NhanVienService";
// import { getVaiTroList } from "../../services/VaiTroService";
// import { useNavigate, useParams } from "react-router-dom";

// const NhanVienComponent = () => {
//   const [formData, setFormData] = useState({
//     vaiTro: "", // Lưu ID vai trò dưới dạng chuỗi
//     ho: "",
//     ten: "",
//     gioiTinh: "Nam",
//     diaChi: "",
//     sdt: "",
//     email: "",
//     ngayTao: "",
//     ngaySua: "",
//     trangThai: true, // Mặc định là true (active)
//   });


//   const [listVaiTro, setListVaiTro] = useState([]);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   const formatDateString = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     return !isNaN(date) ? date.toISOString().split("T")[0] : dateString;
//   };

//   useEffect(() => {
//     const fetchInitialData = async () => {
//       try {
//         const vaiTroResponse = await getVaiTroList();
//         setListVaiTro(vaiTroResponse);

//         if (id) {
//           const nhanVienResponse = await getNhanVienById(id);
//           const nhanVien = nhanVienResponse.data;
//           setFormData({
//             ...nhanVien,
//             vaiTro: nhanVien.vaiTro?.id.toString() || "", // Chuyển ID thành chuỗi để khớp với <select>
//             ngayTao: formatDateString(nhanVien.ngayTao),
//             ngaySua: formatDateString(nhanVien.ngaySua),
//           });
//         }
//       } catch (error) {
//         console.error("Lỗi khi tải dữ liệu:", error);
//       }
//     };

//     fetchInitialData();
//   }, [id]);

//   const handleInputChange = (e) => {
//     const { name, value, type } = e.target;
//     const newValue = type === 'radio' && name === 'trangThai'
//       ? value === 'true'
//       : value;

//     setFormData((prevData) => ({ ...prevData, [name]: newValue }));
//   };

//   const handleSelectChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({ ...prevData, [name]: value }));
//   };

//   const saveNhanVien = async (e) => {
//     e.preventDefault();

//     const payload = {
//       ...formData,
//       vaiTro: { id: parseInt(formData.vaiTro) }, // Chuyển thành số nguyên
//     };

//     try {
//       if (id) {
//         payload.ngaySua = new Date().toISOString().split("T")[0];
//         await updateNhanVien(id, payload);
//         alert("Cập nhật nhân viên thành công!");
//       } else {
//         payload.ngayTao = new Date().toISOString().split("T")[0];
//         await createNhanVien(payload);
//         alert("Thêm nhân viên thành công!");
//       }
//       navigate("/NhanVien");
//     } catch (error) {
//       console.error("Lỗi khi lưu nhân viên:", error);
//       alert("Có lỗi xảy ra khi lưu nhân viên.");
//     }
//   };


//   return (
//     <div className="container">
//       <br />
//       <div className="row">
//         <div className="card">
//           <div className="text-center">
//             {id ? "Cập Nhật Nhân Viên" : "Thêm Nhân Viên"}
//           </div>
//           <div className="col-md-6 offset-md-3">
//             <div className="card-body">
//               <form onSubmit={saveNhanVien}>
//                 <div className="mb-3">
//                   <label className="form-label">Vai Trò</label>
//                   <select
//                     className="form-select"
//                     name="vaiTro"
//                     value={formData.vaiTro}
//                     onChange={handleSelectChange}
//                     required
//                   >
//                     <option value="">Chọn vai trò</option>
//                     {listVaiTro.map((vt) => (
//                       <option key={vt.id} value={vt.id.toString()}>
//                         {vt.tenVaiTro}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="form-group mb-2">
//                   <label>Họ</label>
//                   <input
//                     type="text"
//                     name="ho"
//                     value={formData.ho}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label>Tên</label>
//                   <input
//                     type="text"
//                     name="ten"
//                     value={formData.ten}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-label">Giới tính</label>
//                   <div className="d-flex align-items-center">
//                     <div className="form-check me-3">
//                       <input
//                         className="form-check-input-sm"
//                         type="radio"
//                         name="gioiTinh"
//                         value="Nam"
//                         checked={formData.gioiTinh === "Nam"}
//                         onChange={handleInputChange}
//                       />
//                       <label className="form-check-label">Nam</label>
//                     </div>
//                     <div className="form-check">
//                       <input
//                         className="form-check-input-sm"
//                         type="radio"
//                         name="gioiTinh"
//                         value="Nữ"
//                         checked={formData.gioiTinh === "Nữ"}
//                         onChange={handleInputChange}
//                       />
//                       <label className="form-check-label">Nữ</label>
//                     </div>
//                   </div>
//                 </div>

//                 <div className="form-group mb-2">
//                   <label>Địa chỉ</label>
//                   <input
//                     type="text"
//                     name="diaChi"
//                     value={formData.diaChi}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label>Số điện thoại</label>
//                   <input
//                     type="text"
//                     name="sdt"
//                     value={formData.sdt}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label>Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     className="form-control"
//                     onChange={handleInputChange}
//                     required
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label>Ngày Sửa</label>
//                   <input
//                     type="date"
//                     name="ngaySua"
//                     value={formData.ngaySua || ""}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-label">Trạng Thái</label>
//                   <div className="d-flex align-items-center">
//                     <div className="form-check me-3">
//                       <input
//                         className="form-check-input-sm"
//                         type="radio"
//                         name="trangThai"
//                         value={true}
//                         checked={formData.trangThai === true}
//                         onChange={() => setFormData({ ...formData, trangThai: true })}
//                       />
//                       <label className="form-check-label">Active</label>
//                     </div>
//                     <div className="form-check">
//                       <input
//                         className="form-check-input-sm"
//                         type="radio"
//                         name="trangThai"
//                         value={false}
//                         checked={formData.trangThai === false}
//                         onChange={() => setFormData({ ...formData, trangThai: false })}
//                       />
//                       <label className="form-check-label">Inactive</label>
//                     </div>
//                   </div>
//                 </div>


//                 <button className="btn btn-success" type="submit">
//                   {id ? "Cập Nhật" : "Thêm"}
//                 </button>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default NhanVienComponent;



import React, { useState, useEffect } from "react";
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