import React from 'react'
import DanhSach from './DanhSach'
import NavDatPhong from './NavDatPhong'
import './DatPhongCSS.css'
const DatPhong = () => {
    return (
        <div className="dat-phong-container">

            {/* <NavDatPhong /> */}

            <DanhSach />
        </div>
    )
}

export default DatPhong