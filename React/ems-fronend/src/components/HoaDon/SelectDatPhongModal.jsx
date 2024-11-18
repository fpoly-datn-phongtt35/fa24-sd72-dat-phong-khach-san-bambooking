import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { listDatPhong } from '../../services/HoaDonService';

const SelectDatPhongModal = ({
    show,
    onClose,
    onSelect
}) => {
    const [datPhongList, setDatPhongList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [keyWord, setKeyword] = useState('');
    const itemPerPage = 5;

    const findAllDatPhong = () => {
        const param = { page: currentPage, size: itemPerPage };
        listDatPhong(param, keyWord).then((response) => {
            setDatPhongList(response.data.content);
            setTotalPages(response.data.totalPages);
            console.log(response.data.content);
        }).catch((error) => {
            console.log(error);
        })
    }

    useEffect(() => {
        findAllDatPhong();
    }, [keyWord, currentPage]);

    const handlePreviousPage = () => {
        if (currentPage > 0) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handleSearchChange = (e) => {
        setKeyword(e.target.value);
        setCurrentPage(0); // Reset về trang 1 khi tìm kiếm
    };

    return (
        <Modal show={show} onHide={onClose} centered size='lg'>
            <Modal.Header closeButton>
                <Modal.Title>Chọn đặt phòng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {/* Tìm kiếm phòng */}
                <div className='mb-3 w-50'>
                    <input
                        type='text'
                        className='form-control'
                        placeholder='Tìm đặt phòng...'
                        value={keyWord}
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Bảng hiển thị danh sách đặt phòng */}
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Mã đặt phòng</th>
                            <th>Tên khách hàng</th>
                            <th>Ngày đặt</th>
                            <th>Tổng tiền</th>
                            <th>Đặt cọc</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {datPhongList.map((item) => (
                            <tr
                                key={item.id}
                                style={{ cursor: 'pointer' }}
                                onClick={() => onSelect(item.id)}
                            >
                                <td>{item.id}</td>
                                <td>{item.maDatPhong}</td>
                                <td>{item.khachHang?.ho} {item.khachHang?.ten}</td>
                                <td>{item.ngayDat ? new Date(item.ngayDat).toLocaleDateString() : "N/A"}</td>
                                <td>{item.tongTien}</td>
                                <td>{item.datCoc}</td>
                                <td>{item.trangThai}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Phân trang */}
                <div className='d-flex justify-content-center my-3'>
                    <button
                        className='btn btn-outline-primary me-2'
                        disabled={currentPage === 0}
                        onClick={handlePreviousPage}
                    >
                        Previous
                    </button>
                    <span className='align-self-center'>
                        Trang {currentPage + 1} / {totalPages}
                    </span>
                    <button
                        className='btn btn-outline-primary ms-2'
                        disabled={currentPage + 1 >= totalPages}
                        onClick={handleNextPage}
                    >
                        Next
                    </button>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default SelectDatPhongModal;
