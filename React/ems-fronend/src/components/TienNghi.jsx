import React, { useEffect, useState } from 'react'
import { listTienNghi } from '../services/TienNghiService'

const TienNghi = () => {
    const [tn,setTN] = useState([])
    useEffect(()=>{
        listTienNghi().then((reponse)=>{
            setTN(reponse.data)
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
                        <th className="col">Mã tiện nghi</th>
                        <th className="col">Tên tiện nghi</th>
                        <th className="col">Số lượng tồn</th>
                        <th className="col">Đơn giá</th>
                        <th className="col">Trạng thái</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        tn.map(tn=>
                            <tr key={tn.id}>
                                <td>{tn.id}</td>
                                <td>{tn.maTienNghi}</td>
                                <td>{tn.tenTienNghi}</td>
                                <td>{tn.soLuongTon}</td>
                                <td>{tn.donGia}</td>
                                <td>{tn.trangThai}</td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default TienNghi