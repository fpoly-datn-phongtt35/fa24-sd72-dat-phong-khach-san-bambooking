import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteImage, listImage } from '../../services/ImageService';

const ListImage = () => {
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const itemPerPage = 5;

  const getAllImages = () => {
    listImage({ page: currentPage, size: itemPerPage }, searchQuery)
      .then((response) => {
        console.log(response.data.content);
        setImages(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((error) => {
        console.log("Lỗi : " + error);
      });
  };

  useEffect(() => {
    getAllImages();
  }, [currentPage, searchQuery]);

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage + 1 < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleCreate = () => {
    navigate('/add-hinh-anh');
  };

  const handleRemove = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa ảnh này không?")) {
      deleteImage(id)
        .then((response) => {
          console.log("Xóa ảnh thành công!", response.data);
          getAllImages();
        })
        .catch((error) => {
          console.log("Lỗi khi xóa: " + error);
        });
    }
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Đặt lại trang về 0 khi tìm kiếm
  };

  return (
    <div className='container'>
      <h5>Hình ảnh</h5>
      <div className='card'>
        <div className='card-body'>
          <div className='d-flex justify-content-between mb-3 mt-2'>
            <button
              className='btn btn-outline-success btn-lg fs-6'
              onClick={handleCreate} >
              <i className='bi bi-plus-circle'></i> Thêm
            </button>
            <div className="input-group ms-2 w-25">
              <input
                type="text"
                className='form-control form-control-lg fs-6'
                placeholder='Tìm kiếm tên phòng, tên ảnh...'
                value={searchQuery}
                onChange={handleSearchInput}
              />
            </div>
          </div>
          <table className='table table-hover'>
            <thead>
              <tr>
                <th>ID Image</th>
                <th>Phòng</th>
                <th>Tên ảnh</th>
                <th>Hình ảnh</th>
                <th>Trạng thái</th>
                <td>Chức năng</td>
              </tr>
            </thead>
            <tbody>
              {images.length > 0 ? (
                images.map(image => (
                  <tr key={image.id}>
                    <td>{image.id}</td>
                    <td>{image.phong?.tenPhong}</td>
                    <td>{image.tenAnh}</td>
                    <td>
                      {image.duongDan ? (
                        <img
                          src={image.duongDan}
                          alt={image.tenAnh}
                          style={{ width: '150px', height: 'auto' }}
                        />
                      ) : (
                        <span>Không có hình ảnh</span>
                      )}
                    </td>
                    <td>{image.trangThai ? "Hoạt động" : "Ngừng hoạt động"}</td>
                    <td>
                      <button
                        className='btn btn-outline-danger'
                        onClick={() => handleRemove(image.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className='text-center'>Không có dữ liệu</td>
                </tr>
              )}
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
            <span className='align-self-center' style={{ marginTop: '7px' }}>
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
        </div>
      </div>
    </div>
  );
};

export default ListImage;
