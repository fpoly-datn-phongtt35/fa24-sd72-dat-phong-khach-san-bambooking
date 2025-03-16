import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import CSS
import { useForm } from 'react-hook-form';
import { API_ROOT } from '../../utils/constants';
import { useState } from 'react';

const Login = () => {
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
      password: data.password
    };

    await axios.post(`${API_ROOT}/api/auth/access`, result).then((res) => {
      if (res.status === 200) {
        if (res.data.role[0].authority !== "Admin") {
          alert("Bạn không phải admin!")
          return;
        }
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        localStorage.setItem("user", res.data.username);
        navigate("/TrangChu")
      }

    }).catch((err) => {
      alert(err?.response?.data?.message);

    })
  }

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Đăng Nhập</h2>
        {serverError && <p className="error-message">{serverError}</p>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <input
            type="text"
            placeholder="Tên đăng nhập"
            {...register("username", { required: true })}
            required
          />
          {errors.username && (
            <p className="error-message">Vui lòng nhập tên đăng nhập!</p>
          )}
          <input
            type="password"
            placeholder="Mật khẩu"
            {...register("password", { required: true })}
            required
          />
          {errors.password && (
            <p className="error-message">Vui lòng nhập mật khẩu!</p>
          )}
          <button type="submit">
            Đăng Nhập
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;

