import React, { useState, useEffect , useCallback } from 'react';
import { searchRooms } from '../../services/ViewPhong';
import { useNavigate } from 'react-router-dom';
import { searchByIDPhong } from '../../services/ImageService';

const ViewPhong = () => {
  const [rooms, setRooms] = useState([]);
  const [tinhTrang, setTinhTrang] = useState(null);
  const [giaMin, setGiaMin] = useState(null);
  const [giaMax, setGiaMax] = useState(null);
  const [keyword, setKeyword] = useState('');
  const [listImage, setlistImage] = useState('');
  const navigate = useNavigate();

  const handleSearch = useCallback(() => {
    const min = giaMin !== null ? Number(giaMin) : null;
    const max = giaMax !== null ? Number(giaMax) : null;

    searchRooms(tinhTrang, min, max, keyword)
      .then(async roomList => {
        if (Array.isArray(roomList)) {
          console.log('Dữ liệu phòng trả về:', roomList);
          setRooms(roomList);

          // Sử dụng Promise.all để đợi tất cả các yêu cầu ảnh hoàn tất
          const images = await Promise.all(
            roomList.map(room => searchByIDPhong(room.id).then(response => ({ id: room.id, data: response.data })))
          );

          // Cập nhật listImage theo đúng định dạng { [room.id]: response.data }
          const imageMap = images.reduce((acc, img) => {
            acc[img.id] = img.data;
            return acc;
          }, {});

          setlistImage(imageMap);
          console.log(listImage)
          console.log("Danh sách ảnh đã cập nhật:", imageMap);
        } else {
          console.error("Dữ liệu trả về không phải là mảng:", roomList);
          setRooms([]);
        }
      })
      .catch(error => {
        console.error("Không thể tìm kiếm phòng:", error);
        setRooms([]);
      });
  }, [tinhTrang, giaMin, giaMax, keyword]);

  useEffect(() => {
    handleSearch();
  }, [tinhTrang, giaMin, giaMax, keyword]);

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setTinhTrang(value === 'all' ? null : value);
    console.log('Tình trạng phòng đã chọn:', value);
  };

  const handlePriceChange = () => {
    handleSearch(); // Gọi lại hàm tìm kiếm khi giá thay đổi
  };

  // Hàm để điều hướng đến trang chi tiết
  const handleViewDetail = (roomId) => {
    navigate(`/room-detail/${roomId}`);
  };

  return (
    <div className='container d-flex'>
      <div className='card' style={{ width: '20%', marginRight: '20px', alignSelf: 'flex-start', marginTop: '10px' }}>
        <div className='card-body'>
          <div className='search-bar mb-3'>
            <input
              type='text'
              className='form-control'
              placeholder='Tìm kiếm tên phòng...'
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyUp={handleSearch}
            />
          </div>
          <div className='filter-price mb-3'>
            <label>Tìm theo khoảng giá:</label>
            <div className='d-flex align-items-center'>
              <span>Giá min</span>
              <input
                type='number'
                className='form-control mx-2'
                min='0'
                value={giaMin !== null ? giaMin : ''}
                onChange={(e) => setGiaMin(e.target.value ? Number(e.target.value) : null)}
                onBlur={handlePriceChange}
                style={{ width: '70%' }}
              />
            </div>
            <div className='d-flex align-items-center' style={{ marginTop: '10px' }}>
              <span>Giá max</span>
              <input
                type='number'
                className='form-control mx-2'
                value={giaMax !== null ? giaMax : ''}
                onChange={(e) => setGiaMax(e.target.value ? Number(e.target.value) : null)}
                onBlur={handlePriceChange}
                style={{ width: '70%' }}
              />
            </div>
          </div>
          <div className='filter-status'>
            <label>Tình trạng phòng:</label>
            <div>
              <div className='form-check mb-1'>
                <input
                  type='radio'
                  name='tinhTrang'
                  value='all'
                  className='form-check-input'
                  checked={tinhTrang === null}
                  onChange={handleStatusChange}
                />
                <label className='form-check-label'>Tất cả</label>
              </div>
              <div className='form-check mb-1'>
                <input
                  type='radio'
                  name='tinhTrang'
                  value='Trống'
                  className='form-check-input'
                  checked={tinhTrang === 'Trống'}
                  onChange={handleStatusChange}
                />
                <label className='form-check-label'>Trống</label>
              </div>
              <div className='form-check'>
                <input
                  type='radio'
                  name='tinhTrang'
                  value='Đang sử dụng'
                  className='form-check-input'
                  checked={tinhTrang === 'Đang sử dụng'}
                  onChange={handleStatusChange}
                />
                <label className='form-check-label'>Đang sử dụng</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='d-flex flex-wrap' style={{ width: '70%' }}>
        {Array.isArray(rooms) && rooms.length > 0 ? (
          rooms.map(room => (
            <div key={room.id} className='card' style={{ width: '30%', margin: '10px' }}>
              <div className='card-body'>
                {listImage[room.id] ? (
                  <img
                  src={listImage[room.id]?.[0]?.duongDan} // Lấy ảnh đầu tiên trong mảng
                  alt='Phòng'
                  className='img-fluid'
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                
                ) : (
                  <span>Không có hình ảnh</span>
                )}
              </div>
              <div className='card-footer'>
                <p>Tên phòng: {room.tenPhong}</p>
                <p>Tình trạng: {room.tinhTrang}</p>
                <p>Giá: {room.loaiPhong.donGia} VND</p>
                <button
                  className='btn btn-primary'
                  onClick={() => handleViewDetail(room.id)} // Gọi hàm để xử lý chi tiết
                >
                  Chi tiết
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>Không tìm thấy phòng nào.</p>
        )}
      </div>
    </div>
  );
};

export default ViewPhong;
