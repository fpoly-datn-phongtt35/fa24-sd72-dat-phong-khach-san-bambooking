import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { listTraPhong } from '../../services/HoaDonService';

const TraPhongModal = ({
    show,
    onClose,
    onSelect
}) => {

    const [traPhongList, setTraPhongList] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const itemPerPage = 5;

    const findAllTraPhong = () => {
        const param = { page: currentPage, size: itemPerPage };
        listTraPhong(param)
            .then((response) => {
                setTraPhongList(response.data.content);
                setTotalPages(response.data.totalPages);
                console.log(response.data.content);
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách trả phòng:', error);
            });
    };

    useEffect(() => {
        findAllTraPhong();
    }, [currentPage]);

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

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Danh sách trả phòng</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {traPhongList.length > 0 ? (
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>ID xếp phòng</th>
                                <th>Ngày trả</th>
                                <th>Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody>
                            {traPhongList.map((traPhong) => (
                                <tr
                                    key={traPhong.id}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => onSelect(traPhong.id)}
                                >
                                    <td>{traPhong.id}</td>
                                    <td>{traPhong.idXepPhong}</td>
                                    <td>{traPhong.ngayTraThucTe}</td>
                                    <td>{traPhong.trangThai}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>Không có dữ liệu trả phòng.</p>
                )}

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

export default TraPhongModal;
