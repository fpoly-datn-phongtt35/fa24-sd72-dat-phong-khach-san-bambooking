// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom'; 

// const Login = ({ onLoginSuccess }) => { // Nhận props từ App
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await axios.post('http://localhost:8080/api/auth/login', {
//         tenDangNhap: username,
//         matKhau: password,
//       });
//       if (response.status === 200) {
//         setMessage('Đăng nhập thành công!');
//         onLoginSuccess(); // Gọi hàm từ App để cập nhật trạng thái
//         navigate('/NhanVien'); // Điều hướng sau khi đăng nhập
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         setMessage('Sai tên đăng nhập hoặc mật khẩu!');
//       } else {
//         setMessage('Có lỗi xảy ra, vui lòng thử lại!');
//       }
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
//         <button type="submit" style={{ width: '100%', padding: '10px' }}>
//           Đăng Nhập
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


const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/login', {
        tenDangNhap: username,
        matKhau: password,
      });

      if (response.status === 200) {
        const userData = response.data; // Nhận thông tin người dùng từ backend
        onLoginSuccess(userData); // Truyền thông tin người dùng về App.jsx
        navigate('/NhanVien'); // Điều hướng sau khi đăng nhập
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setMessage('Sai tên đăng nhập hoặc mật khẩu!');
      } else {
        setMessage('Có lỗi xảy ra, vui lòng thử lại!');
      }
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto', marginTop: '100px' }}>
      <h2>Đăng Nhập</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Tên Đăng Nhập</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <div>
          <label>Mật Khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px' }}>
          Đăng Nhập
        </button>
      </form>
      {message && <p style={{ color: 'red', marginTop: '10px' }}>{message}</p>}
    </div>
  );
};

export default Login;
