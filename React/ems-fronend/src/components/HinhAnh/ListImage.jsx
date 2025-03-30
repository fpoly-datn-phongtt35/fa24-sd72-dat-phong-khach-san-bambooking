import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteImage, listImage } from '../../services/ImageService';
import Swal from 'sweetalert2';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Pagination,
} from '@mui/material';

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
    Swal.fire({
      title: 'Xác nhận xóa',
      text: "Bạn có chắc chắn muốn xóa ảnh này không?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Xóa',
      cancelButtonText: 'Hủy'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteImage(id)
          .then((response) => {
            console.log("Xóa ảnh thành công!", response.data);
            Swal.fire({
              title: 'Đã xóa!',
              text: 'Ảnh đã được xóa thành công.',
              icon: 'success',
              confirmButtonText: 'OK'
            }).then(() => {
              getAllImages(); // Cập nhật danh sách ảnh sau khi xóa
            });
          })
          .catch((error) => {
            console.log("Lỗi khi xóa: " + error);
            Swal.fire({
              title: 'Lỗi!',
              text: 'Không thể xóa ảnh. Vui lòng thử lại.',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          });
      }
    });
  };


  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(0); // Đặt lại trang về 0 khi tìm kiếm
  };

  return (
    <div className='container'>
      <h5>Hình ảnh</h5>
      <Paper sx={{ p: 2, mt: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Button variant='contained' color='success' onClick={handleCreate}>
            Thêm Hình Ảnh
          </Button>
          <TextField
            label='Tìm kiếm'
            variant='outlined'
            size='small'
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(0);
            }}
          />
        </div>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Phòng</TableCell>
                <TableCell>Tên ảnh</TableCell>
                <TableCell>Hình ảnh</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Chức năng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {images.length > 0 ? (
                images.map((image) => (
                  <TableRow key={image.id}>
                    <TableCell>{image.id}</TableCell>
                    <TableCell>{image.phong?.tenPhong}</TableCell>
                    <TableCell>{image.tenAnh}</TableCell>
                    <TableCell>
                      {image.duongDan ? (
                        <img src={image.duongDan} alt={image.tenAnh} width='100' height='auto' />
                      ) : (
                        'Không có hình ảnh'
                      )}
                    </TableCell>
                    <TableCell>{image.trangThai ? 'Hoạt động' : 'Ngừng hoạt động'}</TableCell>
                    <TableCell>
                      <Button variant="outlined" color='error' onClick={() => handleDelete(image.id)} sx={{ ml: 1 }}>Xóa</Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align='center'>Không có dữ liệu</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Pagination */}
        <Pagination
          count={totalPages}
          page={currentPage + 1}
          onChange={(e, page) => setCurrentPage(page - 1)}
          color='primary'
          sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}
        />
      </Paper>
    </div>
  );
};

export default ListImage;
