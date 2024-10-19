import React, { useEffect, useState } from 'react';
import { listLoaiPhong } from '../../services/LoaiPhongService';

const TableLoaiPhong = () => {
    const [loaiPhong, setLoaiPhong] = useState([]);

    useEffect(() => {
        listLoaiPhong()
        .then((response) => {
            setLoaiPhong(response.data);
        }).catch(error => {
            console.log(error);
        });
    }, []); // Thêm dấu phẩy ở đây để chạy hàm chỉ 1 lần khi component mount

    return (
        <div className="container">
            <table className="table">
                <thead>
                    <tr>    
                        <th>STT</th>
                        <th>Tên loại phòng</th>
                        <th>Diện tích</th>
                        <th>Sức chứa lớn</th>
                        <th>Sức chứa nhỏ</th>
                        <th>Giá phòng</th>
                        <th>Mô tả</th>
                        <th>Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        loaiPhong.map(lp => (
                            <tr key={lp.id}>
                                <td>{lp.id}</td>
                                <td>{lp.tenLoaiPhong}</td>
                                <td>{lp.dienTich}</td>
                                <td>{lp.sucChuaLon}</td>
                                <td>{lp.sucChuaNho}</td>
                                <td>{lp.moTa}</td>
                                <td>{lp.trangThai}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
}

export default TableLoaiPhong;
