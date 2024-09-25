import React, { useEffect, useState } from 'react'
import { listNhanVien } from '../services/NhanVienService'

const TableNhanVien = () => {
    const [nv,setNV] = useState([])
    useEffect(()=>{
        listNhanVien().then((reponse)=>{
            setNV(reponse.data)
        }).catch(error=>{
            console.log(error)
        })
    })
    return (
        <div class="container">
            <table className="table">
                <thead>
                    <tr>
                        <th className="col">ID</th>
                        <th className="col">Mã nhân viên</th>
                        <th className="col">Họ tên</th>
                        <th className="col">Ngày sinh</th>
                        <th className="col">Giới tính</th>
                        <th className="col">Địa chỉ</th>
                        <th className="col">SDT</th>
                        <th className="col">Email</th>
                        <th className="col">Chức vụ</th>
                        <th className="col">Ngày tạo</th>
                        <th className="col">Ngày sửa</th>
                        <th className="col">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        nv.map(nv=>
                            <tr key={nv.id}>
                                <td>{nv.id}</td>
                                <td>{nv.maNhanVien}</td>
                                <td>{nv.hoTen}</td>
                                <td>{nv.ngaySinh}</td>
                                <td>{nv.gioiTinh}</td>
                                <td>{nv.diaChi}</td>
                                <td>{nv.sdt}</td>
                                <td>{nv.email}</td>
                                <td>{nv.chucVu} </td>
                                <td>{nv.ngayTao}</td>
                                <td>{nv.ngaySua}</td>
                                <td>{nv.trangThai}</td>
                            </tr>

                        )
                    }
                </tbody>

            </table>

        </div>
    )
}

export default TableNhanVien