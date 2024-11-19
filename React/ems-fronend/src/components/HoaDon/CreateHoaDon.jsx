import React, { useEffect, useState } from 'react';
import { taoHoaDon, taoThongTinHoaDon, listThongTinHoaDonByIdHoaDon } from '../../services/HoaDonService';
import SelectDatPhongModal from '../HoaDon/SelectDatPhongModal';
import { Tabs, Tab } from 'react-bootstrap';
import TraPhongModal from '../HoaDon/TraPhongModal';

const CreateHoaDon = () => {
    const [tenDangNhap, setTenDangNhap] = useState('');
    const [hoaDonList, setHoaDonList] = useState([]);
    const [selectedDatPhong, setSelectedDatPhong] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedTraPhong, setSelectedTraPhong] = useState(null);
    const [showTraPhongModal, setShowTraPhongModal] = useState(false);

    const [thongTinHoaDonMap, setThongTinHoaDonMap] = useState({});

    // Lấy thông tin người dùng và danh sách hóa đơn từ localStorage
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.tenDangNhap) {
            setTenDangNhap(user.tenDangNhap);
        }

        const savedHoaDonList = JSON.parse(localStorage.getItem('hoaDonList')) || [];
        setHoaDonList(savedHoaDonList);
    }, []);

    // Mở modal chọn phòng
    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleSelectDatPhong = (maPhong) => {
        setSelectedDatPhong(maPhong);
        closeModal();
    };

    const openTraPhongModal = () => setShowTraPhongModal(true);
    const closeTraPhongModal = () => setShowTraPhongModal(false);

    const handleSelectTraPhong = (id) => {
        setSelectedTraPhong(id);
        closeTraPhongModal();
    };

    // Tạo hóa đơn
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
            setHoaDonList(updatedHoaDonList);
            localStorage.setItem('hoaDonList', JSON.stringify(updatedHoaDonList));
            setSelectedDatPhong(null);
            alert('Hóa đơn đã được tạo thành công!');
        } catch (error) {
            alert('Lỗi khi tạo hóa đơn.');
            console.error('Lỗi tạo hóa đơn:', error);
        }
    };

    // Lấy thông tin hóa đơn theo idHoaDon
    const findThongTinHoaDonByIdHoaDon = (idHoaDon) => {
        listThongTinHoaDonByIdHoaDon(idHoaDon)
            .then((response) => {
                setThongTinHoaDonMap((prevState) => ({
                    ...prevState,
                    [idHoaDon]: response.data, // Lưu thông tin hóa đơn theo idHoaDon
                }));
            })
            .catch((error) => {
                console.error('Lỗi khi lấy thông tin hóa đơn:', error);
            });
    };

    useEffect(() => {
        if (hoaDonList.length > 0) {
            hoaDonList.forEach(hoaDon => {
                findThongTinHoaDonByIdHoaDon(hoaDon.id);
            });
        }
    }, [hoaDonList]);

    // Tạo thông tin hóa đơn
    const handleCreateThongTinHoaDon = async (idHoaDon) => {
        if (!selectedTraPhong) {
            alert('Vui lòng chọn trả phòng');
            return;
        }

        try {
            const thongTinHoaDon = {
                idTraPhong: selectedTraPhong,
                idHoaDon: idHoaDon,
            };

            const result = await taoThongTinHoaDon(thongTinHoaDon);

            // Cập nhật lại thông tin hóa đơn cho idHoaDon
            setThongTinHoaDonMap((prevState) => ({
                ...prevState,
                [idHoaDon]: [...(prevState[idHoaDon] || []), result.data],
            }));

            const updatedHoaDonList = hoaDonList.map((hoaDon) =>
                hoaDon.id === idHoaDon ? { ...hoaDon, idTraPhong: selectedTraPhong } : hoaDon
            );
            setHoaDonList(updatedHoaDonList);
            localStorage.setItem('hoaDonList', JSON.stringify(updatedHoaDonList));

            setSelectedTraPhong(null);
            alert('Thông tin hóa đơn đã được tạo thành công!');
        } catch (error) {
            alert('Lỗi khi tạo thông tin hóa đơn.');
            console.error('Lỗi tạo thông tin hóa đơn:', error.response ? error.response.data : error.message);
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

                    {hoaDonList.length > 0 && (
                        <div className="mt-3">
                            <Tabs id="hoa-don-tabs" className="mb-3">
                                {hoaDonList.map((hoaDon) => (
                                    <Tab eventKey={hoaDon.id.toString()} title={`${hoaDon.maHoaDon}`} key={hoaDon.id}>
                                        <div className="d-flex align-items-center">
                                            <div className="me-auto">
                                                <h5 className="ms-3">Trả phòng</h5>
                                            </div>
                                            <button className="btn btn-outline-primary me-2" onClick={openTraPhongModal}>
                                                Chọn
                                            </button>
                                            <div className="mb-3 mt-3 me-4 ml-3">
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="traPhong"
                                                    value={selectedTraPhong ? `ID: ${selectedTraPhong}` : ''}
                                                    readOnly
                                                />
                                            </div>
                                            <button
                                                className="btn btn-outline-secondary"
                                                style={{ width: '120px' }}
                                                onClick={() => handleCreateThongTinHoaDon(hoaDon.id)}
                                            >
                                                Tạo TTHD
                                            </button>
                                        </div>

                                        <div className="container mt-3">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>ID</th>
                                                        <th>ID trả phòng</th>
                                                        <th>ID hóa đơn</th>
                                                        <th>Tiền phòng</th>
                                                        <th>Tiền dịch vụ</th>
                                                        <th>Tiền phụ thu</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {thongTinHoaDonMap[hoaDon.id]?.length ? (
                                                        thongTinHoaDonMap[hoaDon.id].map((item) => (
                                                            <tr key={item.id}>
                                                                <td>{item.id}</td>
                                                                <td>{item.idTraPhong}</td>
                                                                <td>{item.idHoaDon}</td>
                                                                <td>{item.tienPhong}</td>
                                                                <td>{item.tienDichVu}</td>
                                                                <td>{item.tienPhuThu}</td>
                                                            </tr>
                                                        ))
                                                    ) : (
                                                        <tr>
                                                            <td colSpan="6" className="text-center">
                                                                <span className="text-muted">Không có thông tin hóa đơn</span> {/* Dòng span bạn muốn thêm */}
                                                            </td>
                                                        </tr>
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>

                                        <hr />

                                        <div className="mt-3">
                                            <p><strong>ID hóa đơn:</strong> {hoaDon.id}</p>
                                            <p><strong>Mã hóa đơn:</strong> {hoaDon.maHoaDon}</p>
                                            <p><strong>Tên nhân viên:</strong> {hoaDon.tenDangNhap}</p>
                                            <p><strong>Mã đặt phòng:</strong> {hoaDon.maDatPhong}</p>
                                            <p><strong>Tổng tiền:</strong> {hoaDon.tongTien}</p>
                                            <p><strong>Trạng thái:</strong> {hoaDon.trangThai}</p>
                                        </div>
                                    </Tab>
                                ))}
                            </Tabs>
                        </div>
                    )}
                </div>
            </div>

            <SelectDatPhongModal show={showModal} onClose={closeModal} onSelect={handleSelectDatPhong} />

            <TraPhongModal show={showTraPhongModal} onClose={closeTraPhongModal} onSelect={handleSelectTraPhong} />
        </div>
    );
};

export default CreateHoaDon;
