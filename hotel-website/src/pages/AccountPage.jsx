import React, { useState, useEffect } from 'react';
import '../styles/AccountPage.css';
import { getProfile, updateProfileFullName, updateProfileEmail, updateProfilePhoneNumber, updateProfileGender, updateProfileAddress, updateProfileAvatar } from '../api/profileApi';

const AccountPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    gender: '',
    address: '',
    email: '',
    avatar: null
  });

  const [editingField, setEditingField] = useState(null);
  const [backupData, setBackupData] = useState({});
  const [avatarPreview, setAvatarPreview] = useState('https://via.placeholder.com/50');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const res = await getProfile();
      const userData = res.data?.data || {};
      setFormData(userData);
      setAvatarPreview(userData.avatar || 'https://via.placeholder.com/50');
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu người dùng:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleEdit = (field) => {
    setBackupData(formData); // lưu dữ liệu trước khi sửa
    setEditingField(field);
  };

  const handleCancel = () => {
    setFormData(backupData); // khôi phục dữ liệu cũ
    setEditingField(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingField === 'name') {
        const fullNameData = {
          id: formData.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
        };
        await updateProfileFullName(fullNameData);
        console.log('Họ và tên đã được cập nhật thành công:', fullNameData);
      } else if (editingField === 'email') {
        const emailData = { email: formData.email, id: formData.id };
        await updateProfileEmail(emailData);
        console.log('Email đã được cập nhật thành công:', emailData);
      } else if (editingField === 'phoneNumber') {
        const phoneNumberData = { phoneNumber: formData.phoneNumber, id: formData.id };
        await updateProfilePhoneNumber(phoneNumberData);
        console.log('Số điện thoại đã được cập nhật thành công:', phoneNumberData);
      } else if (editingField === 'gender') {
        const genderData = { gender: formData.gender, id: formData.id };
        await updateProfileGender(genderData);
        console.log('Giới tính đã được cập nhật thành công:', genderData);
      } else if (editingField === 'address') {
        const addressData = { address: formData.address, id: formData.id };
        await updateProfileAddress(addressData);
        console.log('Địa chỉ đã được cập nhật thành công:', addressData);
      } else if (editingField === 'avatar') {
        console.log('Đang cập nhật ảnh đại diện...');

        const formDataToSend = new FormData();
        formDataToSend.append('id', formData.id);
        formDataToSend.append('avatar', formData.avatar);
        await updateProfileAvatar(formDataToSend);
        console.log('Ảnh đại diện đã được cập nhật thành công');
      }
      setEditingField(null); // Only reset after successful update
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      alert('Đã xảy ra lỗi khi cập nhật. Vui lòng thử lại.');
    }
  };

  return (
    <div className="container">
      <h1>Thông tin cá nhân</h1>
      <p>Cập nhật thông tin của bạn và tìm hiểu cách thông tin này được sử dụng ra sao.</p>

      <div className="profile-pic">
        <img src={avatarPreview} alt="Profile" className="avatar-circle" />
        {editingField === 'avatar' ? (
          <div className="edit-avatar">
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
            <button type="button" onClick={handleCancel} className="cancel-btn">Hủy</button>
            <button type="button" onClick={handleSubmit} className="save-btn">Lưu</button>
          </div>
        ) : (
          <button type="button" onClick={() => handleEdit('avatar')} className="edit-btn">Chỉnh sửa</button>
        )}
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
              <button type="button" onClick={() => handleEdit('email')} className="edit-btn">Chỉnh sửa</button>
            </div>
          )}
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
