import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDichVuSuDung, getHoaDonById, getThongTinHoaDonByHoaDonId } from "../../services/InfoHoaDon";

const InfoHoaDon = () => {
    const { id } = useParams();
    const [hoaDon, setHoaDon] = useState(null);
    const [thongTinHoaDon, setThongTinHoaDon] = useState([]);
    const [dichVuSuDung, setDichVuSuDung] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hoaDonResponse, thongTinHoaDonResponse, dichVuSuDungResponse] = await Promise.all([
                    getHoaDonById(id),
                    getThongTinHoaDonByHoaDonId(id),
                    getDichVuSuDung(id),
                ]);

                setHoaDon(hoaDonResponse?.data || null);
                setThongTinHoaDon(thongTinHoaDonResponse?.data || []);
                setDichVuSuDung(dichVuSuDungResponse?.data || []);
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu:", error);
            }
        };

        fetchData();
    }, [id]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
        }).format(amount);
    };

    if (!hoaDon) {
        return (
            <div className="container">
                <p>Không tìm thấy thông tin hóa đơn.</p>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card" style={{ marginTop: "20px", marginBottom: '20px' }}>
                <h5 className="mt-4">Thông tin hóa đơn</h5>
                <div className="card-body" style={{ marginLeft: '100px' }}>
                    <div className="row">
                        <div className="col-md-6">
                            <p><b>Mã hóa đơn:</b> {hoaDon.maHoaDon}</p>
                        </div>
                        <div className="col-md-6">
                            <p><b>Tên nhân viên:</b> {hoaDon.tenNhanVien}</p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <p><b>Ngày tạo:</b> {hoaDon.ngayTao}</p>
                        </div>
                        <div className="col-md-6">
                            <p>
                                <b>Tổng tiền:</b>{" "}
                                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(hoaDon.tongTien)}
                            </p>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-6">
                            <p><b>Trạng thái:</b> {hoaDon.trangThai}</p>
                        </div>
                    </div>
                </div>

                <div className="container">
                    {thongTinHoaDon.length > 0 && (
                        <div className="card-body">
                            <h5 className="card-title">Thông tin tiền phòng</h5>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Tên phòng</th>
                                        <th>Ngày nhận phòng</th>
                                        <th>Ngày trả phòng</th>
                                        <th>Giá phòng</th>
                                        <th>Tiền phòng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {thongTinHoaDon.map((item, index) => (
                                        <tr key={item.id || index}>
                                            <td>{(item.tenPhong)}</td>
                                            <td>{(item.ngayNhanPhong)}</td>
                                            <td>{(item.ngayTraPhong)}</td>
                                            <td>{formatCurrency(item.giaPhong)}</td>
                                            <td>{formatCurrency(item.tienPhong)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {dichVuSuDung.length > 0 && (
                        <div className="card-body">
                            <h5 className="card-title">Thông tin dịch vụ sử dụng</h5>
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Tên phòng</th>
                                        <th>Tên dịch vụ</th>
                                        <th>Giá dịch vụ</th>
                                        <th>Số lượng sử dụng</th>
                                        <th>Tổng tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {dichVuSuDung.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.tenPhong}</td>
                                            <td>{item.tenDichVu}</td>
                                            <td>{formatCurrency(item.giaDichVu)}</td>
                                            <td>{item.soLuongSuDung}</td>
                                            <td>{formatCurrency(item.tongTien)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>



            </div>
        </div>
    );
};

export default InfoHoaDon;
