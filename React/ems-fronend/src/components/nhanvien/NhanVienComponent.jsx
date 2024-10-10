// import React, { useState, useEffect } from "react";
// import { createNhanVien } from "../../services/NhanVienService";
// import { useNavigate } from "react-router-dom";
// import { getTaiKhoanList } from "../../services/TaiKhoanService";
// import { getVaiTroList } from "../../services/VaiTroService";

// const NhanVienComponent = () => {
//   const [taiKhoan, setTaiKhoan] = useState("");
//   const [vaiTro, setVaiTro] = useState("");
//   const [ho, setHo] = useState("");
//   const [ten, setTen] = useState("");
//   const [gioiTinh, setGioiTinh] = useState("");
//   const [diaChi, setDiaChi] = useState("");
//   const [sdt, setSdt] = useState("");
//   const [email, setEmail] = useState("");
//   const [ngayTao, setNgayTao] = useState("");
//   const [ngaySua, setNgaySua] = useState("");
//   const [trangThai, setTrangThai] = useState("");
//   const [listVaiTro, setListVaiTro] = useState([]);
//   const [listTaiKhoan, setListTaiKhoan] = useState([]);

//   const [formData, setFormData] = useState({
//     taiKhoan: null, // Chứa đối tượng nhân viên thay vì chỉ ID
//     vaiTro: null, // Chứa đối tượng khách hàng thay vì chỉ ID
//     ho: "",
//     ten: "",
//     gioiTinh: "Nam",
//     diaChi: "",
//     sdt: "",
//     email: "",
//     ngayTao: "",
//     ngaySua: "",
//     trangThai: "", // Giá trị mặc định là pending
//   });
//   const navigator = useNavigate();

//   useEffect(() => {
//     // Gọi API lấy danh sách vai trò
//     getVaiTroList()
//       .then((response) => {
//         setListVaiTro(response);
//       })
//       .catch((error) => {
//         console.error("Lỗi khi lấy danh sách vai trò:", error);
//       });

//     // Gọi API lấy danh sách tài khoản
//     getTaiKhoanList()
//       .then((response) => {
//         setListTaiKhoan(response);
//       })
//       .catch((error) => {
//         console.error("Lỗi khi lấy danh sách tài khoản:", error);
//       });
//   }, []);
//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };
//   const handleVaiTroChange = (e) => {
//     const selectedVaiTro = listVaiTro.find(
//       (vt) => vt.id === parseInt(e.target.value)
//     );
//     setFormData({
//       ...formData,
//       vaiTro: selectedVaiTro,
//     });
//   };

//   const handleTaiKhoanChange = (e) => {
//     const selectedTaiKhoan = listTaiKhoan.find(
//       (tk) => tk.id === parseInt(e.target.value)
//     );
//     setFormData({
//       ...formData,
//       taiKhoan: selectedTaiKhoan,
//     });
//   };

//   const saveNhanVien = (e) => {
//     e.preventDefault();

//     if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       alert("Email không hợp lệ!");
//       return;
//     }

//     if (formData.sdt.length < 10) {
//       alert("Số điện thoại không hợp lệ!");
//       return;
//     }

//     const formattedNgayTao = ngayTao ? new Date(ngayTao).toISOString() : null;
//     const formattedNgaySua = ngaySua ? new Date(ngaySua).toISOString() : null;
//     formData.ngaySua = formattedNgaySua;
//     formData.ngayTao = formattedNgayTao;

//     console.log("Thông tin nhân viên:", formData);
//     createNhanVien(formData)
//       .then((response) => {
//         console.log(response.data);
//         navigator("/NhanVien");
//       })
//       .catch((error) => {
//         console.error(
//           "Lỗi khi thêm nhân viên: ",
//           error.response?.data || error.message
//         );
//       });
//   };

//   return (
//     <div className="container">
//       <br />
//       <div className="row">
//         <div className="card">
//           <div className="text-center">Thêm Nhân Viên</div>
//           <div className="col-md-6 offset-md-3">
//             <div className="card-body">
//               <form>
//                 <div className="mb-3">
//                   <label htmlFor="taiKhoan" className="form-label">
//                     Tài Khoản
//                   </label>
//                   <select
//                     className="form-select"
//                     id="taiKhoan"
//                     name="taiKhoan"
//                     value={formData.taiKhoan?.id || ""}
//                     onChange={handleTaiKhoanChange}
//                     required
//                   >
//                     <option value="">Chọn tài khoản</option>
//                     {listTaiKhoan.map((tk) => (
//                       <option key={tk.id} value={tk.id}>
//                         {tk.tenDangNhap}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="vaiTro" className="form-label">
//                     Vai Trò
//                   </label>
//                   <select
//                     className="form-select"
//                     id="vaiTro"
//                     name="vaiTro"
//                     value={formData.vaiTro?.id || ""}
//                     onChange={handleVaiTroChange}
//                     required
//                   >
//                     <option value="">Chọn vai trò</option>
//                     {listVaiTro.map((vt) => (
//                       <option key={vt.id} value={vt.id}>
//                         {vt.tenVaiTro}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Họ</label>
//                   <input
//                     type="text"
//                     name="ho"
//                     value={formData.ho}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Tên</label>
//                   <input
//                     type="text"
//                     name="ten"
//                     value={formData.ten}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Giới tính</label>
//                   <div>
//                     <label>
//                       <input
//                         type="radio"
//                         name="gioiTinh" // Đặt name giống với thuộc tính formData bạn muốn cập nhật
//                         value="Nam"
//                         checked={formData.gioiTinh === "Nam"} // So sánh với giá trị trong formData
//                         onChange={handleInputChange} // Sử dụng hàm handleInputChange đã định nghĩa
//                       />
//                       Nam
//                     </label>
//                     <label>
//                       <input
//                         type="radio"
//                         name="gioiTinh" // Đặt name giống với radio button trước để cùng nhóm
//                         value="Nữ"
//                         checked={formData.gioiTinh === "Nữ"}
//                         onChange={handleInputChange}
//                       />
//                       Nữ
//                     </label>
//                   </div>
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Địa chỉ</label>
//                   <input
//                     type="text"
//                     name="diaChi"
//                     value={formData.diaChi}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Số điện thoại</label>
//                   <input
//                     type="text"
//                     name="sdt"
//                     value={formData.sdt}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Email</label>
//                   <input
//                     type="text"
//                     name="email"
//                     value={formData.email}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Ngày tạo</label>
//                   <input
//                     type="date"
//                     name="ngayTao"
//                     value={formData.ngayTao}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Ngày sửa</label>
//                   <input
//                     type="date"
//                     name="ngaySua"
//                     value={formData.ngaySua}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Trạng thái</label>
//                   <input
//                     type="text"
//                     name="trangThai"
//                     value={formData.trangThai}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <button className="btn btn-success" onClick={saveNhanVien}>
//                   Submit
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




// import React, { useState, useEffect } from "react";
// import { createNhanVien, updateNhanVien } from "../../services/NhanVienService"; // Import cả updateNhanVien
// import { useNavigate, useParams } from "react-router-dom";
// import { getTaiKhoanList } from "../../services/TaiKhoanService";
// import { getVaiTroList } from "../../services/VaiTroService";
// import { getNhanVienById } from "../../services/NhanVienService";

// const NhanVienComponent = () => {
//   const [taiKhoan, setTaiKhoan] = useState("");
//   const [vaiTro, setVaiTro] = useState("");
//   const [ho, setHo] = useState("");
//   const [ten, setTen] = useState("");
//   const [gioiTinh, setGioiTinh] = useState("Nam");
//   const [diaChi, setDiaChi] = useState("");
//   const [sdt, setSdt] = useState("");
//   const [email, setEmail] = useState("");
//   const [ngayTao, setNgayTao] = useState("");
//   const [ngaySua, setNgaySua] = useState("");
//   const [trangThai, setTrangThai] = useState("");
//   const [listVaiTro, setListVaiTro] = useState([]);
//   const [listTaiKhoan, setListTaiKhoan] = useState([]);

//   const [formData, setFormData] = useState({
//     taiKhoan: null,
//     vaiTro: null,
//     ho: "",
//     ten: "",
//     gioiTinh: "Nam",
//     diaChi: "",
//     sdt: "",
//     email: "",
//     ngayTao: "",
//     ngaySua: "",
//     trangThai: "",
//   });

//   const navigator = useNavigate();
//   const { id } = useParams(); // Lấy ID từ URL

//   useEffect(() => {
//     // Gọi API lấy danh sách vai trò
//     getVaiTroList()
//       .then((response) => {
//         setListVaiTro(response); // Đảm bảo rằng response là danh sách vai trò
//       })
//       .catch((error) => {
//         console.error("Lỗi khi lấy danh sách vai trò:", error);
//       });
  
//     // Gọi API lấy danh sách tài khoản
//     getTaiKhoanList()
//       .then((response) => {
//         setListTaiKhoan(response); // Đảm bảo rằng response là danh sách tài khoản
//       })
//       .catch((error) => {
//         console.error("Lỗi khi lấy danh sách tài khoản:", error);
//       });
  
//     // Gọi API lấy thông tin nhân viên nếu có ID
//     if (id) {
//       getNhanVienById(id)
//         .then((response) => {
//           const nhanVien = response.data;
//           setFormData({
//             ...nhanVien,
//             taiKhoan: nhanVien.taiKhoan ? nhanVien.taiKhoan.id : null,
//             vaiTro: nhanVien.vaiTro ? nhanVien.vaiTro.id : null,
//           });
//         })
//         .catch((error) => console.error("Lỗi khi lấy thông tin nhân viên:", error));
//     }
//   }, [id]);
  

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handleVaiTroChange = (e) => {
//     const selectedVaiTro = listVaiTro.find(
//       (vt) => vt.id === parseInt(e.target.value)
//     );
//     setFormData({
//       ...formData,
//       vaiTro: selectedVaiTro,
//     });
//   };

//   const handleTaiKhoanChange = (e) => {
//     const selectedTaiKhoan = listTaiKhoan.find(
//       (tk) => tk.id === parseInt(e.target.value)
//     );
//     setFormData({
//       ...formData,
//       taiKhoan: selectedTaiKhoan,
//     });
//   };

//   const saveNhanVien = (e) => {
//     e.preventDefault();

//     if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       alert("Email không hợp lệ!");
//       return;
//     }

//     if (formData.sdt.length < 10) {
//       alert("Số điện thoại không hợp lệ!");
//       return;
//     }

//     const formattedNgayTao = ngayTao ? new Date(ngayTao).toISOString() : null;
//     const formattedNgaySua = ngaySua ? new Date(ngaySua).toISOString() : null;
//     formData.ngaySua = formattedNgaySua;
//     formData.ngayTao = formattedNgayTao;

//     if (id) {
//       // Nếu có ID, gọi API update
//       updateNhanVien(id, formData)
//         .then((response) => {
//           console.log(response.data);
//           navigator("/NhanVien");
//         })
//         .catch((error) => {
//           console.error(
//             "Lỗi khi cập nhật nhân viên: ",
//             error.response?.data || error.message
//           );
//         });
//     } else {
//       // Nếu không có ID, gọi API create
//       createNhanVien(formData)
//         .then((response) => {
//           console.log(response.data);
//           navigator("/NhanVien");
//         })
//         .catch((error) => {
//           console.error(
//             "Lỗi khi thêm nhân viên: ",
//             error.response?.data || error.message
//           );
//         });
//     }
//   };


//   return (
//     <div className="container">
//       <br />
//       <div className="row">
//         <div className="card">
//           <div className="text-center">{id ? "Cập Nhật Nhân Viên" : "Thêm Nhân Viên"}</div>
//           <div className="col-md-6 offset-md-3">
//             <div className="card-body">
//               <form>
//                 <div className="mb-3">
//                   <label htmlFor="taiKhoan" className="form-label">
//                     Tài Khoản
//                   </label>
//                   <select
//                     className="form-select"
//                     id="taiKhoan"
//                     name="taiKhoan"
//                     value={formData.taiKhoan?.id || ""}
//                     onChange={handleTaiKhoanChange}
//                     required
//                   >
//                     <option value="">Chọn tài khoản</option>
//                     {listTaiKhoan.map((tk) => (
//                       <option key={tk.id} value={tk.id}>
//                         {tk.tenDangNhap}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="mb-3">
//                   <label htmlFor="vaiTro" className="form-label">
//                     Vai Trò
//                   </label>
//                   <select
//                     className="form-select"
//                     id="vaiTro"
//                     name="vaiTro"
//                     value={formData.vaiTro?.id || ""}
//                     onChange={handleVaiTroChange}
//                     required
//                   >
//                     <option value="">Chọn vai trò</option>
//                     {listVaiTro.map((vt) => (
//                       <option key={vt.id} value={vt.id}>
//                         {vt.tenVaiTro}
//                       </option>
//                     ))}
//                   </select>
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Họ</label>
//                   <input
//                     type="text"
//                     name="ho"
//                     value={formData.ho}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Tên</label>
//                   <input
//                     type="text"
//                     name="ten"
//                     value={formData.ten}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Giới tính</label>
//                   <div>
//                     <label>
//                       <input
//                         type="radio"
//                         name="gioiTinh"
//                         value="Nam"
//                         checked={formData.gioiTinh === "Nam"}
//                         onChange={handleInputChange}
//                       />
//                       Nam
//                     </label>
//                     <label>
//                       <input
//                         type="radio"
//                         name="gioiTinh"
//                         value="Nữ"
//                         checked={formData.gioiTinh === "Nữ"}
//                         onChange={handleInputChange}
//                       />
//                       Nữ
//                     </label>
//                   </div>
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Địa chỉ</label>
//                   <input
//                     type="text"
//                     name="diaChi"
//                     value={formData.diaChi}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Số điện thoại</label>
//                   <input
//                     type="text"
//                     name="sdt"
//                     value={formData.sdt}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Email</label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Ngày tạo</label>
//                   <input
//                     type="date"
//                     name="ngayTao"
//                     value={formData.ngayTao}
//                     className="form-control"
//                     onChange={(e) => setNgayTao(e.target.value)}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Ngày tạo</label>
//                   <input
//                     type="date"
//                     name="ngaySua"
//                     value={formData.ngaySua}
//                     className="form-control"
//                     onChange={(e) => setNgaySua(e.target.value)}
//                   />
//                 </div>

//                 <div className="form-group mb-2">
//                   <label className="form-lable">Trạng thái</label>
//                   <input
//                     type="text"
//                     name="trangThai"
//                     value={formData.trangThai}
//                     className="form-control"
//                     onChange={handleInputChange}
//                   />
//                 </div>

//                 <button className="btn btn-primary" onClick={saveNhanVien}>
//                   {id ? "Cập nhật" : "Thêm"}
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
import { createNhanVien, updateNhanVien } from "../../services/NhanVienService"; // Import cả updateNhanVien
import { useNavigate, useParams } from "react-router-dom";
import { getTaiKhoanList } from "../../services/TaiKhoanService";
import { getVaiTroList } from "../../services/VaiTroService";
import { getNhanVienById } from "../../services/NhanVienService";

const NhanVienComponent = () => {
  const [formData, setFormData] = useState({
    taiKhoan: null,
    vaiTro: null,
    ho: "",
    ten: "",
    gioiTinh: "Nam",
    diaChi: "",
    sdt: "",
    email: "",
    ngayTao: "", // Sẽ được lấy từ phản hồi API
    ngaySua: "", // Sẽ được lấy từ phản hồi API
    trangThai: "",
  });

  const [listVaiTro, setListVaiTro] = useState([]);
  const [listTaiKhoan, setListTaiKhoan] = useState([]);
  
  const navigator = useNavigate();
  const { id } = useParams(); // Lấy ID từ URL

  useEffect(() => {
    // Gọi API lấy danh sách vai trò
    getVaiTroList()
      .then((response) => {
        setListVaiTro(response);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách vai trò:", error);
      });
  
    // Gọi API lấy danh sách tài khoản
    getTaiKhoanList()
      .then((response) => {
        setListTaiKhoan(response);
      })
      .catch((error) => {
        console.error("Lỗi khi lấy danh sách tài khoản:", error);
      });
  
    // Gọi API lấy thông tin nhân viên nếu có ID
    if (id) {
      getNhanVienById(id)
        .then((response) => {
          const nhanVien = response.data;
          console.log("Nhân viên:", nhanVien);
          // Cắt chuỗi ngày để lấy định dạng đúng
          const formattedNgayTao = nhanVien.ngayTao ? nhanVien.ngayTao.split("T")[0] : ""; // Chỉ lấy phần ngày
          const formattedNgaySua = nhanVien.ngaySua ? nhanVien.ngaySua.split("T")[0] : ""; // Chỉ lấy phần ngày

          setFormData({
            ...nhanVien,
            taiKhoan: nhanVien.taiKhoan ? nhanVien.taiKhoan.id : null,
            vaiTro: nhanVien.vaiTro ? nhanVien.vaiTro.id : null,
            ngayTao: formattedNgayTao,
            ngaySua: formattedNgaySua,
          });
        })
        .catch((error) => console.error("Lỗi khi lấy thông tin nhân viên:", error));
    }
  }, [id]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleVaiTroChange = (e) => {
    const selectedVaiTro = listVaiTro.find(
      (vt) => vt.id === parseInt(e.target.value)
    );
    setFormData({
      ...formData,
      vaiTro: selectedVaiTro,
    });
  };

  const handleTaiKhoanChange = (e) => {
    const selectedTaiKhoan = listTaiKhoan.find(
      (tk) => tk.id === parseInt(e.target.value)
    );
    setFormData({
      ...formData,
      taiKhoan: selectedTaiKhoan,
    });
  };

  const saveNhanVien = (e) => {
    e.preventDefault();

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Email không hợp lệ!");
      return;
    }

    if (formData.sdt.length < 10) {
      alert("Số điện thoại không hợp lệ!");
      return;
    }

    if (id) {
      // Nếu có ID, gọi API update
      updateNhanVien(id, formData)
        .then((response) => {
          console.log(response.data);
          navigator("/NhanVien");
        })
        .catch((error) => {
          console.error(
            "Lỗi khi cập nhật nhân viên: ",
            error.response?.data || error.message
          );
        });
    } else {
      // Nếu không có ID, gọi API create
      createNhanVien(formData)
        .then((response) => {
          console.log(response.data);
          navigator("/NhanVien");
        })
        .catch((error) => {
          console.error(
            "Lỗi khi thêm nhân viên: ",
            error.response?.data || error.message
          );
        });
    }
  };

  return (
    <div className="container">
      <br />
      <div className="row">
        <div className="card">
          <div className="text-center">{id ? "Cập Nhật Nhân Viên" : "Thêm Nhân Viên"}</div>
          <div className="col-md-6 offset-md-3">
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="taiKhoan" className="form-label">
                    Tài Khoản
                  </label>
                  <select
                    className="form-select"
                    id="taiKhoan"
                    name="taiKhoan"
                    value={formData.taiKhoan?.id || ""}
                    onChange={handleTaiKhoanChange}
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
                  <label htmlFor="vaiTro" className="form-label">
                    Vai Trò
                  </label>
                  <select
                    className="form-select"
                    id="vaiTro"
                    name="vaiTro"
                    value={formData.vaiTro?.id || ""}
                    onChange={handleVaiTroChange}
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
                  <label className="form-lable">Họ</label>
                  <input
                    type="text"
                    name="ho"
                    value={formData.ho}
                    className="form-control"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group mb-2">
                  <label className="form-lable">Tên</label>
                  <input
                    type="text"
                    name="ten"
                    value={formData.ten}
                    className="form-control"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group mb-2">
                  <label className="form-lable">Giới tính</label>
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
                    <label>
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
                  <label className="form-lable">Địa chỉ</label>
                  <input
                    type="text"
                    name="diaChi"
                    value={formData.diaChi}
                    className="form-control"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group mb-2">
                  <label className="form-lable">Số điện thoại</label>
                  <input
                    type="text"
                    name="sdt"
                    value={formData.sdt}
                    className="form-control"
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group mb-2">
                  <label className="form-lable">Email</label>
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
                  <label className="form-lable">Ngày tạo</label>
                  <input
                    type="date"
                    name="ngayTao"
                    value={formData.ngayTao}
                    className="form-control"
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>

                <div className="form-group mb-2">
                  <label className="form-lable">Ngày sửa</label>
                  <input
                    type="date"
                    name="ngaySua"
                    value={formData.ngaySua}
                    className="form-control"
                    onChange={handleInputChange}
                    readOnly
                  />
                </div>

                <div className="form-group mb-2">
                  <label className="form-lable">Trạng thái</label>
                  <select
                    className="form-select"
                    name="trangThai"
                    value={formData.trangThai}
                    onChange={handleInputChange}
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Không hoạt động">Không hoạt động</option>
                  </select>
                </div>

                <button className="btn btn-success" onClick={saveNhanVien}>
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
