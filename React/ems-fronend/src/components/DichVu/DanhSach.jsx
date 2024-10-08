import React, { useState, useEffect } from 'react';
import { DuLieu, XoaDichVu } from '../../services/DichVuService'; 
import FormAdd from './FormAdd';
import FormUpdate from './FormUpdate';
import DetailDichVu from './DetailDichVu';

const DanhSach = () => {
    const [dichVuList, setDichVuList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [currentDichVu, setCurrentDichVu] = useState(null); 
    const [showDetail, setShowDetail] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState(''); // Tìm kiếm
    const [filterStatus, setFilterStatus] = useState(''); // Lọc trạng thái

    const loadDichVu = () => {
        DuLieu()
            .then(response => {
                const filteredData = response.data.filter(dv => {
                    const matchesStatus = filterStatus 
                        ? dv.trangThai.trim().toLowerCase() === filterStatus.trim().toLowerCase() 
                        : true;
                    const matchesKeyword = searchKeyword
                        ? dv.tenDichVu.toLowerCase().includes(searchKeyword.toLowerCase()) || 
                          dv.moTa.toLowerCase().includes(searchKeyword.toLowerCase())
                        : true;
    
                    return matchesStatus && matchesKeyword;
                });
                setDichVuList(filteredData);
            })
            .catch(error => {
                console.error("Lỗi khi tải danh sách dịch vụ:", error);
            });
    };

    useEffect(() => {
        loadDichVu();
    }, [searchKeyword, filterStatus]); // Tự động tải lại khi từ khóa hoặc trạng thái thay đổi

    const openForm = () => setShowForm(true);
    const closeForm = () => setShowForm(false);
    
    const openUpdateForm = (dv) => {
        setCurrentDichVu(dv);
        setShowUpdateForm(true);
    };

    const closeUpdateForm = () => {
        setShowUpdateForm(false);
        setCurrentDichVu(null);
    };

    const openDetail = (dv) => {
        setCurrentDichVu(dv);
        setShowDetail(true);
    };

    const closeDetail = () => {
        setShowDetail(false);
        setCurrentDichVu(null);
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ này?")) {
            XoaDichVu(id)
                .then(() => {
                    loadDichVu();
                })
                .catch(error => {
                    console.error("Lỗi khi xóa dịch vụ:", error);
                });
        }
    };

    return (
        <div>
            <h1>Danh Sách Dịch Vụ</h1>
            <div>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên hoặc mô tả"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">Tất cả trạng thái</option>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                </select>
                <button onClick={loadDichVu}>Lọc</button>
            </div> <br />

            <button onClick={openForm}>Thêm Dịch Vụ</button>
            <table className='table'>
                <thead>
                    <tr>
                        <th>Tên Dịch Vụ</th>
                        <th>Giá</th>
                        <th>Mô Tả</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {dichVuList.map((dv) => (
                        <tr key={dv.id}>
                            <td>{dv.tenDichVu}</td>
                            <td>{dv.donGia}</td>
                            <td>{dv.moTa}</td>
                            <td>{dv.trangThai}</td>
                            <td>
                                <button onClick={() => openUpdateForm(dv)}>Sửa</button>
                                <button onClick={() => handleDelete(dv.id)}>Xóa</button>
                                <button onClick={() => openDetail(dv)}>Chi Tiết</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showForm && <FormAdd show={showForm} handleClose={closeForm} refreshData={loadDichVu} />}
            {showUpdateForm && <FormUpdate show={showUpdateForm} handleClose={closeUpdateForm} refreshData={loadDichVu} dichVu={currentDichVu} />}
            {showDetail && <DetailDichVu dichVu={currentDichVu} handleClose={closeDetail} />}
        </div>
    );
};

export default DanhSach;
