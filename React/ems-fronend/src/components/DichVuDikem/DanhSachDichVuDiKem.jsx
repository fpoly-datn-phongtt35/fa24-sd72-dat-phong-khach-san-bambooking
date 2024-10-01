import React, { useState, useEffect } from 'react';
import { LayDanhSachDichVuDiKem, XoaDichVuDiKem } from '../../services/DichVuDiKemService'; 
import FormAdd from './FormAddDichVuDiKem';
import FormUpdate from './FormUpdateDichVuDiKem';

const DanhSachDichVuDiKem = () => {
    const [dichVuDiKemList, setDichVuDiKemList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [currentDichVuDiKem, setCurrentDichVuDiKem] = useState(null); 

    const loadDichVuDiKem = () => {
        LayDanhSachDichVuDiKem()
            .then(response => {
                setDichVuDiKemList(response.data);
            })
            .catch(error => {
                console.error("Lỗi khi tải danh sách dịch vụ đi kèm:", error);
            });
    };

    useEffect(() => {
        loadDichVuDiKem();
    }, []);

    const openForm = () => {
        setShowForm(true);
    };

    const closeForm = () => {
        setShowForm(false);
    };

    const openUpdateForm = (dvDiKem) => {
        setCurrentDichVuDiKem(dvDiKem);
        setShowUpdateForm(true);
    };

    const closeUpdateForm = () => {
        setShowUpdateForm(false);
        setCurrentDichVuDiKem(null);
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ đi kèm này?")) {
            XoaDichVuDiKem(id)
                .then(() => {
                    loadDichVuDiKem();
                })
                .catch(error => {
                    console.error("Lỗi khi xóa dịch vụ đi kèm:", error);
                });
        }
    };

    return (
        <div>
            <h1>Danh Sách Dịch Vụ Đi Kèm</h1>
            <button onClick={openForm}>Thêm Dịch Vụ Đi Kèm</button>
            <table className='table'>
                <thead>
                    <tr>
                        <th>ID Dịch Vụ</th>
                        <th>ID Loại Phòng</th>
                        <th>Trạng Thái</th>
                        <th>Hành Động</th>
                    </tr>
                </thead>
                <tbody>
                    {dichVuDiKemList.map((dvDiKem) => (
                        <tr key={dvDiKem.id}>
                            <td>{dvDiKem.dichVu?.tenDichVu}</td>
                            <td>{dvDiKem.loaiPhong?.tenLoaiPhong}</td>
                            <td>{dvDiKem.trangThai}</td>
                            <td>
                                <button onClick={() => openUpdateForm(dvDiKem)}>Sửa</button>
                                <button onClick={() => handleDelete(dvDiKem.id)}>Xóa</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showForm && <FormAdd show={showForm} handleClose={closeForm} refreshData={loadDichVuDiKem} />}
            {showUpdateForm && <FormUpdate show={showUpdateForm} handleClose={closeUpdateForm} refreshData={loadDichVuDiKem} dichVuDiKem={currentDichVuDiKem} />}
        </div>
    );
};

export default DanhSachDichVuDiKem;
