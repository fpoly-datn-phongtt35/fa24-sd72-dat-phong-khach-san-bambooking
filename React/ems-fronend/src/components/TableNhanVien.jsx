//rafce
import React, {useEffect ,useState} from 'react'
import { listNhanVien } from '../services/NhanVienService'

const TableNhanVien = () => {
    const [employees, setEmployee] = useState([])

    useEffect(() =>{
        listNhanVien().then((response) =>{
            setEmployee(response.data);
        }).catch(error =>{
            console.error(error);
        })
    },[])


  return (
    <div className='container'>
        <h3>Nhan Vien</h3>
        <table className='table table-striped table-bordered'>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Họ</th>
                    <th>Tên</th>
                    <th>Giới Tính</th>
                    <th>Quốc Gia</th>
                    <th>Số điện thoại</th>
                    <th>Email</th>
                    <th>Ngày Tạo</th>
                    <th>Ngày Sửa</th>
                    <th>Trạng thái</th>
                </tr>
            </thead>
                
            <tbody>
                {
                    employees.map(employee =>
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.ho}</td>
                            <td>{employee.ten}</td>
                            <td>{employee.gioiTinh}</td>
                            <td>{employee.quocGia}</td>
                            <td>{employee.sdt}</td>
                            <td>{employee.email}</td>
                            <td>{employee.ngayTao}</td>
                            <td>{employee.ngaySua}</td>
                            <td>{employee.trangThai}</td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    </div>

  )
}

export default TableNhanVien