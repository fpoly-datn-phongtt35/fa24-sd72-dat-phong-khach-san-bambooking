import React, {useEffect, useState} from 'react'
import { listVaiTro } from '../../services/VaiTroService';

const ListVaiTro = () => {
    const [vaiTro, setVaiTro] = useState([]);
    // Hàm lấy tất cả vai trò
    const getAllVaiTro = () => {
        listVaiTro()  // Gọi API không cần tham số phân trang
            .then((response) => {
                setVaiTro(response.data); // Gán dữ liệu vai trò vào state
            })
            .catch((error) => {
                console.log(error);
            });
    };

    // Gọi API khi component được mount
    useEffect(() => {
        getAllVaiTro();
    }, []);

  return (

    <div className='card'>
        <div className='card-body'>
        <table className='table table-striped table-bordered'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Tên Vai Trò</th>
                        <th>Trạng Thái</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        vaiTro.map(vaiTro => (
                            <tr key={vaiTro.id}>
                                <td>{vaiTro.id}</td>
                                <td>{vaiTro.tenVaiTro}</td>
                                <td>{vaiTro.trangThai}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    </div>
  )
}

export default ListVaiTro