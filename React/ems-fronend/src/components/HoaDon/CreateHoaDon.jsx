import React, { useEffect, useState } from 'react';
import { taoHoaDon } from '../../services/HoaDonService';
import SelectDatPhongModal from '../HoaDon/SelectDatPhongModal';
import { Tab, Tabs } from 'react-bootstrap';

const CreateHoaDon = () => {
    const [tenDangNhap, setTenDangNhap] = useState('');
    const [selectedDatPhong, setSelectedDatPhong] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [hoaDonList, setHoaDonList] = useState([]);

    useEffect(() => {
        // Lấy tên đăng nhập từ localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.tenDangNhap) {
            setTenDangNhap(user.tenDangNhap);
        }

        // Lấy danh sách hóa đơn từ localStorage
        const savedHoaDonList = JSON.parse(localStorage.getItem('hoaDonList')) || [];
        setHoaDonList(savedHoaDonList);
    }, []);

    const openModal = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const handleSelectDatPhong = (maPhong) => {
        setSelectedDatPhong(maPhong);
        closeModal();
    };

    const handleCreateHoaDon = async () => {
        if (!selectedDatPhong) {
            alert('Vui lòng chọn phòng.');
            return;
        }

        try {
            const hoaDon = {
                tenDangNhap,
                idDatPhong: selectedDatPhong,
                trangThai: 'Chưa thanh toán',
            };
            const result = await taoHoaDon(hoaDon);

            const updatedHoaDonList = [...hoaDonList, result];
            setHoaDonList(updatedHoaDonList); // Thêm hóa đơn mới vào danh sách
            localStorage.setItem('hoaDonList', JSON.stringify(updatedHoaDonList)); // Lưu danh sách vào localStorage
            setSelectedDatPhong(null); // Reset chọn phòng
            alert('Hóa đơn đã được tạo thành công!');
        } catch (error) {
            alert('Lỗi khi tạo hóa đơn.');
            console.error('Lỗi tạo hóa đơn:', error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card">
                <div className="card-body">
                    <h5>Chọn đặt phòng</h5>
                    <div className="d-flex align-items-center">
                        <button className="btn btn-outline-primary me-2" onClick={openModal}>
                            Chọn
                        </button>
                        <div className="mb-3 mt-3 me-4">
                            <input
                                type="text"
                                className="form-control"
                                id="datPhong"
                                value={selectedDatPhong ? `ID: ${selectedDatPhong}` : ''}
                                readOnly
                            />
                        </div>
                        <button
                            className="btn btn-outline-secondary"
                            style={{ width: '120px' }}
                            onClick={handleCreateHoaDon}
                        >
                            Tạo hóa đơn
                        </button>
                    </div>

                    {/* Hiển thị tab hóa đơn */}
                    {hoaDonList.length > 0 && (
                        <div className="mt-3">
                            <Tabs defaultActiveKey={hoaDonList[0]?.id} id="hoa-don-tabs" className="mb-3">
                                {hoaDonList.map((hoaDon) => (
                                    <Tab eventKey={hoaDon.id} title={`${hoaDon.maHoaDon}`} key={hoaDon.id}>
                                        <div>
                                            <p><strong>ID hóa đơn:</strong> {hoaDon.id}</p>
                                            <p><strong>Mã hóa đơn:</strong> {hoaDon.maHoaDon}</p>
                                            <p><strong>Tên nhân viên:</strong> {hoaDon.tenDangNhap}</p>
                                            <p><strong>Mã đặt phòng:</strong> {hoaDon.maDatPhong}</p>
                                            <p><strong>Tổng tiền:</strong> {hoaDon.tongTien}</p>
                                            <p><strong>Trạng thái:</strong> {hoaDon.trangThai}</p>
                                            <p><strong>Ngày tạo:</strong> {new Date(hoaDon.ngayTao).toLocaleString()}</p>
                                        </div>
                                    </Tab>
                                ))}
                            </Tabs>
                        </div>
                    )}
                </div>
            </div>

            {/* Hiển thị modal */}
            <SelectDatPhongModal
                show={showModal}
                onClose={closeModal}
                onSelect={handleSelectDatPhong}
            />
        </div>
    );
};

export default CreateHoaDon;
