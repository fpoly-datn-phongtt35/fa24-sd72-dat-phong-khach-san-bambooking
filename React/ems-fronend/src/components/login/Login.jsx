// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// const Login = ({ onLoginSuccess }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
    
//     // Tránh nhiều request đồng thời
//     if (loading) return;
//     setLoading(true);

//     try {
//       const response = await axios.post(
//         'http://localhost:8080/api/auth/login',
//         {
//           tenDangNhap: username,
//           matKhau: password,
//         },
//         { withCredentials: true }
//       );

//       if (response.status === 200) {
//         const userData = response.data;
//         onLoginSuccess(userData);
//         navigate('/NhanVien');
//       }
//     } catch (error) {
//       if (error.response) {
//         // Xử lý các lỗi chi tiết hơn dựa vào mã lỗi
//         switch (error.response.status) {
//           case 401:
//             setMessage('Sai tên đăng nhập hoặc mật khẩu!');
//             break;
//           case 500:
//             setMessage('Lỗi máy chủ, vui lòng thử lại sau!');
//             break;
//           default:
//             setMessage('Có lỗi xảy ra, vui lòng thử lại!');
//         }
//       } else {
//         setMessage('Không thể kết nối đến máy chủ, vui lòng kiểm tra mạng!');
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ maxWidth: '400px', margin: 'auto', marginTop: '100px' }}>
//       <h2>Đăng Nhập</h2>
//       <form onSubmit={handleLogin}>
//         <div>
//           <label>Tên Đăng Nhập</label>
//           <input
//             type="text"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//             style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
//           />
//         </div>
//         <div>
//           <label>Mật Khẩu</label>
//           <input
//             type="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
//           />
//         </div>
//         <button
//           type="submit"
//           style={{ width: '100%', padding: '10px' }}
//           disabled={loading}
//         >
//           {loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}
//         </button>
//       </form>
//       {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
//     </div>
//   );
// };

// export default Login;


import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import CSS

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        { tenDangNhap: username, matKhau: password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        onLoginSuccess(response.data);
        navigate('/NhanVien');
      }
    } catch (error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setMessage('Sai tên đăng nhập hoặc mật khẩu!');
            break;
          case 500:
            setMessage('Lỗi máy chủ, vui lòng thử lại sau!');
            break;
          default:
            setMessage('Có lỗi xảy ra, vui lòng thử lại!');
        }
      } else {
        setMessage('Không thể kết nối đến máy chủ, vui lòng kiểm tra mạng!');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Đăng Nhập</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Tên đăng nhập"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Đang Đăng Nhập...' : 'Đăng Nhập'}
          </button>
        </form>
        {message && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
};

export default Login;

