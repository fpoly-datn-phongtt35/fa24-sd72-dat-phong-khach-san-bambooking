// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import '../styles/Login.css';
// import { useForm } from 'react-hook-form';
// import axios from 'axios';
// import { API_ROOT } from '../utils/constants';

// export default function Login() {
//   const [serverError, setServerError] = useState("");
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm();

//   const onSubmit = async (data) => {
//     const result = {
//       username: data.username,
//       password: data.password
//     };

//     await axios.post(`${API_ROOT}/api/auth/access`, result).then((res) => {
//       if (res.status === 200) {
//         if (res.data.role[0].authority !== "User") {
//           alert("Bạn không phải User!")
//           return;
//         }
//         localStorage.setItem("accessToken", res.data.accessToken);
//         localStorage.setItem("refreshToken", res.data.refreshToken);
//         localStorage.setItem("user", res.data.username);
//         localStorage.setItem("avatar", res.data.avatar);
//         navigate("/TrangChu")
//       }

//     }).catch((err) => {
//       alert(err?.response?.data?.message);

//     })
//   }

//   return (
//     <div className="login-body">
//       <div className="login-container">
//         <h2>Đăng Nhập</h2>

//         {/* Hiển thị thông báo lỗi nếu có */}
//         {serverError && <p className="error-message">{serverError}</p>}

//         <form onSubmit={handleSubmit(onSubmit)}>
//           {/* Trường nhập email */}
//           <input
//             type="text"
//             placeholder="Tên đăng nhập"
//             {...register("username", { required: true })}
//             required
//           />
//           {errors.username && (
//             <p className="error-message">Vui lòng nhập tên đăng nhập!</p>
//           )}

//           {/* Trường nhập mật khẩu */}
//           <input
//             type="password"
//             placeholder="Mật khẩu"
//             {...register("password", { required: true })}
//             required
//           />
//           {errors.password && (
//             <p className="error-message">Vui lòng nhập mật khẩu!</p>
//           )}

//           {/* Nút đăng nhập */}
//           <button type="submit">
//             Đăng Nhập
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { API_ROOT } from '../utils/constants';

export default function Login() {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    const result = {
      username: data.username,
      password: data.password,
    };

    await axios.post(`${API_ROOT}/api/auth/access`, result).then((res) => {
      if (res.status === 200) {
        if (res.data.role[0].authority !== "User") {
          alert("Bạn không phải User!");
          return;
        }
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("user", res.data.username);
        localStorage.setItem("avatar", res.data.avatar);
        // Nếu API trả về email, lưu email vào localStorage
        if (res.data.email) {
          localStorage.setItem("userEmail", res.data.email);
        }
        navigate("/TrangChu");
      }
    }).catch((err) => {
      alert(err?.response?.data?.message);
    });
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <h2>Đăng Nhập</h2>

        {/* Hiển thị thông báo lỗi nếu có */}
        {serverError && <p className="error-message">{serverError}</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Trường nhập username */}
          <input
            type="text"
            placeholder="Tên đăng nhập"
            {...register("username", { required: true })}
            required
          />
          {errors.username && (
            <p className="error-message">Vui lòng nhập tên đăng nhập!</p>
          )}

          {/* Trường nhập mật khẩu */}
          <input
            type="password"
            placeholder="Mật khẩu"
            {...register("password", { required: true })}
            required
          />
          {errors.password && (
            <p className="error-message">Vui lòng nhập mật khẩu!</p>
          )}

          {/* Nút đăng nhập */}
          <button type="submit">
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
}