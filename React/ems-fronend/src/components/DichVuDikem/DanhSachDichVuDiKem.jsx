import React, { useState, useEffect } from 'react';
import { LayDanhSachDichVuDiKem, XoaDichVuDiKem } from '../../services/DichVuDiKemService'; 
import FormAddDichVuDiKem from './FormAddDichVuDiKem';
import FormUpdateDichVuDiKem from './FormUpdateDichVuDiKem';
import DetailDichVuDiKem from './DetailDichVuDiKem';

const DanhSachDichVuDiKem = () => {
    const [dichVuDiKemList, setDichVuDiKemList] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [currentDichVuDiKem, setCurrentDichVuDiKem] = useState(null);
    const [showDetail, setShowDetail] = useState(false);
    const [searchKeyword, setSearchKeyword] = useState(''); // Tìm kiếm
    const [filterStatus, setFilterStatus] = useState(''); // Lọc trạng thái

    const loadDichVuDiKem = () => {
        LayDanhSachDichVuDiKem()
            .then(response => {
                const filteredData = response.data.filter(dvDiKem => {
                    const matchesStatus = filterStatus ? dvDiKem.trangThai === filterStatus : true;
                    const matchesKeyword = searchKeyword
                        ? (dvDiKem.dichVu?.tenDichVu.toLowerCase().includes(searchKeyword.toLowerCase()) || 
                           dvDiKem.loaiPhong?.tenLoaiPhong.toLowerCase().includes(searchKeyword.toLowerCase()))
                        : true;

                    return matchesStatus && matchesKeyword;
                });
                setDichVuDiKemList(filteredData);
            })
            .catch(error => {
                console.error("Lỗi khi tải danh sách dịch vụ đi kèm:", error);
            });
    };

    useEffect(() => {
        loadDichVuDiKem();
    }, [searchKeyword, filterStatus]);

    const openForm = () => setShowForm(true);
    const closeForm = () => setShowForm(false);
    const openUpdateForm = (dvDiKem) => { setCurrentDichVuDiKem(dvDiKem); setShowUpdateForm(true); };
    const closeUpdateForm = () => { setShowUpdateForm(false); setCurrentDichVuDiKem(null); };
    const openDetail = (dvDiKem) => { setCurrentDichVuDiKem(dvDiKem); setShowDetail(true); };
    const closeDetail = () => { setShowDetail(false); setCurrentDichVuDiKem(null); };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa dịch vụ đi kèm này?")) {
            XoaDichVuDiKem(id)
                .then(() => loadDichVuDiKem())
                .catch(error => console.error("Lỗi khi xóa dịch vụ đi kèm:", error));
        }
    };

    return (
        <div>
            <h1>Danh Sách Dịch Vụ Đi Kèm</h1>
            <div>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên dịch vụ hoặc loại phòng"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="">Tất cả trạng thái</option>
                    <option value="Hoạt động">Hoạt động</option>
                    <option value="Ngừng hoạt động">Ngừng hoạt động</option>
                </select>
                {/* <button onClick={loadDichVuDiKem}>Lọc</button> */}
            </div> <br />

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
                                <button onClick={() => openDetail(dvDiKem)}>Chi Tiết</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {showForm && <FormAddDichVuDiKem show={showForm} handleClose={closeForm} refreshData={loadDichVuDiKem} />}
            {showUpdateForm && <FormUpdateDichVuDiKem show={showUpdateForm} handleClose={closeUpdateForm} refreshData={loadDichVuDiKem} dichVuDiKem={currentDichVuDiKem} />}
            {showDetail && <DetailDichVuDiKem dichVuDiKem={currentDichVuDiKem} handleClose={closeDetail} />}
        </div>
    );
};

export default DanhSachDichVuDiKem;
