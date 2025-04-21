import React, { useState, useEffect } from 'react';
import '../styles/AccountPage.css';
import { getProfile } from '../api/profileApi';

const AccountPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
    address: '',
    email: ''
  });

  const [userEmail, setUserEmail] = useState('');
  const [editingField, setEditingField] = useState(null);
  const [backupData, setBackupData] = useState({});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await getProfile();
      const userData = res.data?.data || {};
      setFormData({
        ...userData,
        email: userData.email || 'Chưa có thông tin', // Đảm bảo email luôn có giá trị
      });
      setUserEmail(userData.email || 'Chưa có thông tin');
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu người dùng:', error);
      setFormData((prev) => ({
        ...prev,
        email: 'Chưa có thông tin', // Xử lý lỗi bằng cách đặt giá trị mặc định
      }));
      setUserEmail('Chưa có thông tin');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEdit = (field) => {
    setBackupData(formData); // lưu dữ liệu trước khi sửa
    setEditingField(field);
  };

  const handleCancel = () => {
    setFormData(backupData); // khôi phục dữ liệu cũ
    setEditingField(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Thông tin được lưu:', formData);
    setEditingField(null);
  };

  return (
    <div className="container">
      <h1>Thông tin cá nhân</h1>
      <p>Cập nhật thông tin của bạn và tìm hiểu cách thông tin này được sử dụng ra sao.</p>

      <div className="profile-pic">
        <img src="https://via.placeholder.com/50" alt="Profile" />
      </div>

      <form onSubmit={handleSubmit}>
        {/* Tên và Họ */}
        <div className="form-group">
          <label>Tên và Họ <span className="required">*</span></label>
          {editingField === 'name' ? (
            <div className="edit-wrapper">
              <button type="button" onClick={handleCancel} className="cancel-btn">Hủy</button>
              <div className="edit-row">
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Tên" />
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Họ" />
              </div>
              <div className="save-row">
                <button type="submit" className="save-btn">Lưu</button>
              </div>
            </div>
          ) : (
            <div className="view-row">
              <span>{formData.firstName} {formData.lastName || 'Chưa có thông tin'}</span>
              <button type="button" onClick={() => handleEdit('name')} className="edit-btn">Chỉnh sửa</button>
            </div>
          )}
        </div>


        {/* Địa chỉ email */}
        <div className="form-group">
          <label>Địa chỉ email</label>
          {editingField === 'email' ? (
            <div className="edit-row">
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                placeholder="Địa chỉ email"
              />
              <button type="button" onClick={handleCancel} className="cancel-btn">Hủy</button>
              <button type="submit" className="save-btn">Lưu</button>
            </div>
          ) : (
            <div className="view-row">
              <span>{formData.email || 'Chưa có thông tin'}</span>
              <span className="verified">Xác thực</span>
              <button type="button" onClick={() => handleEdit('email')} className="edit-btn">Chỉnh sửa</button>
            </div>
          )}
          <p>
            Đây là địa chỉ email bạn dùng để đăng nhập. Chúng tôi cũng sẽ gửi các xác nhận đặt chỗ tới địa chỉ này.
          </p>
        </div>


        {/* Số điện thoại */}
        <div className="form-group">
          <label>Số điện thoại</label>
          {editingField === 'phoneNumber' ? (
            <div className="edit-row">
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Số điện thoại" />
              <button type="button" onClick={handleCancel} className="cancel-btn">Hủy</button>
              <button type="submit" className="save-btn">Lưu</button>
            </div>
          ) : (
            <div className="view-row">
              <span>{formData.phoneNumber || 'Chưa có thông tin'}</span>
              <button type="button" onClick={() => handleEdit('phoneNumber')} className="edit-btn">Chỉnh sửa</button>
            </div>
          )}
        </div>

        {/* Giới tính */}
        <div className="form-group">
          <label>Giới tính <span className="required">*</span></label>
          {editingField === 'gender' ? (
            <div className="edit-row">
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Chọn giới tính</option>
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Không xác định">Không xác định</option>
                <option value="Không muốn nêu rõ">Không muốn nêu rõ</option>
              </select>
              <button type="button" onClick={handleCancel} className="cancel-btn">Hủy</button>
              <button type="submit" className="save-btn">Lưu</button>
            </div>
          ) : (
            <div className="view-row">
              <span>{formData.gender || 'Chưa có thông tin'}</span>
              <button type="button" onClick={() => handleEdit('gender')} className="edit-btn">Chỉnh sửa</button>
            </div>
          )}
        </div>

        {/* Địa chỉ */}
        <div className="form-group">
          <label>Địa chỉ</label>
          {editingField === 'address' ? (
            <div className="edit-row">
              <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="Địa chỉ" />
              <button type="button" onClick={handleCancel} className="cancel-btn">Hủy</button>
              <button type="submit" className="save-btn">Lưu</button>
            </div>
          ) : (
            <div className="view-row">
              <span>{formData.address || 'Chưa có thông tin'}</span>
              <button type="button" onClick={() => handleEdit('address')} className="edit-btn">Chỉnh sửa</button>
            </div>
          )}
        </div>

      </form>
    </div>
  );
};

export default AccountPage;
