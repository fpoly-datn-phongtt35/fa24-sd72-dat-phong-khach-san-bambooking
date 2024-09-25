import React,{useEffect,useState} from 'react'
import { listDichVu } from '../services/DichVuService'

const TableDichVu = () => {
    
    const [dv,setDV]=useState([])
    useEffect(()=>{
        listDichVu().then((response)=>{
            setDV(response.data)
        }).catch(error=>{
            console.log(error);
        })
    }
    )
    return (
        <div class="container">
            <table class="table">
            <thead>
                <tr>    
                    <th>STT</th>
                    <th>Tên dịch vụ</th>
                    <th>Đơn giá</th>
                    <th>Mô tả</th>
                    <th>Hình ảnh</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
            <tbody>
                {
                    dv.map(dv =>
                        <tr key={dv.id}>
                            <td>{dv.id}</td>
                            <td>{dv.tenDichVu}</td>
                            <td>{dv.donGia}</td>
                            <td>{dv.moTa}</td>
                            <td>{dv.hinhAnh}</td>
                            <td>{dv.trangThai}</td>
                        </tr>
                    )
                }
            </tbody>
            </table>
        </div>
    )
}

export default TableDichVu