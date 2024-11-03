import React, { useEffect, useState } from 'react';
import { listLoaiPhong, filterLoaiPhong } from '../../services/LoaiPhongService';
import FormAdd from './FormAdd';
import FormDetail from './FormDetail';

const LoaiPhong = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 7;
    const [selectedData, setSelectedData] = useState(null);
    const [searchTerm, setSearchTerm] = useState({
        tenLoaiPhong: '',
        dienTichMin: '',
        dienTichMax: '',
        soKhach: '',
        donGiaMin: '',
        donGiaMax: '',
        donGiaPhuThuMin: '',
        donGiaPhuThuMax: ''
    });

    const getAllSanPham = () => {
        const apicall = filterLoaiPhong(searchTerm.tenLoaiPhong,    
                                        searchTerm.dienTichMin,
                                        searchTerm.dienTichMax,
                                        searchTerm.soKhach,
                                        searchTerm.donGiaMin,
                                        searchTerm.donGiaMax,
                                        searchTerm.donGiaPhuThuMin,
                                        searchTerm.donGiaPhuThuMax, { page: currentPage, size: itemsPerPage });
        apicall
            .then((response) => {
                setData(response.data.content || []);
                setTotalPages(response.data.totalPages || 0);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        getAllSanPham();
    }, [currentPage, searchTerm,data]);

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const [showAddForm, setShowAddForm] = useState(false);
    const [showDetailForm, setShowDetailForm] = useState(false);

    const handleOpenFormAdd = () => {
        setShowAddForm(true);
    };

    const handleCloseFormAdd = () => {
        setShowAddForm(false);
    };

    const handleOpenFormDetail = (id) => {
        const selectedItem = data.find(item => item.id === id);
        setSelectedData(selectedItem);
        setShowDetailForm(true);
    };

    const handleCloseFormDetail = () => {
        setShowDetailForm(false);
        setSelectedData(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSearchTerm(prevState => ({
            ...prevState,
            [name]: value
        }));
        setCurrentPage(0);
    };

    return (
        <div className="container">
            <div>
                <br></br>
                <input type="text" className="form-control" id="tenLoaiPhong" name="tenLoaiPhong" value={searchTerm.tenLoaiPhong || ''} onChange={handleInputChange} placeholder="Tên loại phòng" />
                <input type="text" className="form-control" id="dienTichMin" name="dienTichMin" value={searchTerm.dienTichMin || ''} onChange={handleInputChange} placeholder="Diện tích min" />
                <input type="text" className="form-control" id="dienTichMax" name="dienTichMax" value={searchTerm.dienTichMax || ''} onChange={handleInputChange} placeholder="Diện tích max" />
                <input type="text" className="form-control" id="soKhach" name="soKhach" value={searchTerm.soKhach || ''} onChange={handleInputChange} placeholder="Số khách" />
                <input type="text" className="form-control" id="donGiaMin" name="donGiaMin" value={searchTerm.donGiaMin || ''} onChange={handleInputChange} placeholder="Đơn giá min" />
                <input type="text" className="form-control" id="donGiaMax" name="donGiaMax" value={searchTerm.donGiaMax || ''} onChange={handleInputChange} placeholder="Đơn giá max" />
                <input type="text" className="form-control" id="donGiaPhuThuMin" name="donGiaPhuThuMin" value={searchTerm.donGiaPhuThuMin || ''} onChange={handleInputChange} placeholder="Đơn giá phụ thu min" />
                <input type="text" className="form-control" id="donGiaPhuThuMax" name="donGiaPhuThuMax" value={searchTerm.donGiaPhuThuMax || ''} onChange={handleInputChange} placeholder="Đơn giá phụ thu max" />
                <br></br>
            </div>
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th className="col">ID</th>
                            <th className="col">Tên loại phòng</th>
                            <th className="col">Diện tích</th>
                            <th className="col">Số khách tối đa</th>
                            <th className="col">Đơn giá</th>
                            <th className="col">Đơn giá phụ thu</th>
                            <th className="col">Mô tả</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Array.isArray(data) && data.length > 0 ? (
                            data.map(ti => (
                                <tr key={ti.id} onClick={() => handleOpenFormDetail(ti.id)}>
                                    <td>{ti.id}</td>
                                    <td>{ti.tenLoaiPhong}</td>
                                    <td>{ti.dienTich}</td>
                                    <td>{ti.soKhachToiDa}</td>
                                    <td>{ti.donGia}</td>
                                    <td>{ti.donGiaPhuThu}</td>
                                    <td>{ti.moTa}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7">Không có dữ liệu tìm kiếm</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                <button className="btn btn-success" onClick={handlePreviousPage}>
                    Trang trước
                </button>

                <span>Trang hiện tại: {currentPage + 1} / {totalPages}</span>
                <button className="btn btn-success" onClick={handleNextPage}>
                    Trang sau
                </button>
            </div>

            <div>
                <br></br>
                <button className="btn btn-secondary" onClick={handleOpenFormAdd}>
                    Thêm mới
                </button>

                {showAddForm && <FormAdd show={showAddForm} handleClose={handleCloseFormAdd} />}
                {showDetailForm && <FormDetail show={showDetailForm} handleClose={handleCloseFormDetail} data={selectedData} />}
            </div>
        </div>
    );
}

export default LoaiPhong;
