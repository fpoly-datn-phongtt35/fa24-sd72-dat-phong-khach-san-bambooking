import React, { useState, useEffect } from 'react';
import { searchRooms } from '../../services/ViewPhong';

const ViewPhong = () => {
  const [rooms, setRooms] = useState([]);
  const [tinhTrang, setTinhTrang] = useState(null);
  const [giaMin, setGiaMin] = useState(null);
  const [giaMax, setGiaMax] = useState(null);
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    const min = giaMin !== null ? Number(giaMin) : null;
    const max = giaMax !== null ? Number(giaMax) : null;

    searchRooms(tinhTrang, min, max, keyword)
      .then(roomList => {
        // Kiểm tra xem roomList có phải là mảng không
        if (Array.isArray(roomList)) {
          console.log('Dữ liệu phòng trả về:', roomList);
          setRooms(roomList);
        } else {
          console.error("Dữ liệu trả về không phải là mảng:", roomList);
          setRooms([]); // Đặt rooms thành mảng rỗng nếu không phải là mảng
        }
      })
      .catch(error => {
        console.error("Không thể tìm kiếm phòng:", error);
      });
  };

  useEffect(() => {
    handleSearch();
  }, [tinhTrang, giaMin, giaMax, keyword]);

  const handleStatusChange = (e) => {
    const value = e.target.value;
    if (value === 'all') {
      setTinhTrang(null);
    } else {
      setTinhTrang(value);
    }
    console.log('Tình trạng phòng đã chọn:', value);
  };

  const handlePriceChange = () => {
    handleSearch(); // Gọi lại hàm tìm kiếm khi giá thay đổi
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
              style={{ fontSize: '14px', padding: '5px' }}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyUp={handleSearch}
            />
          </div>
          <div className='filter-price mb-3'>
            <label style={{ fontSize: '14px' }}>Tìm theo khoảng giá:</label>
            <div className='d-flex align-items-center'>
              <span style={{ fontSize: '14px', width: '30%', textAlign: 'left' }}>Giá min</span>
              <input
                type='number'
                className='form-control mx-2'
                min='0'
                value={giaMin !== null ? giaMin : ''} // Hiển thị giá trị min hoặc rỗng
                onChange={(e) => setGiaMin(e.target.value ? Number(e.target.value) : null)}
                onBlur={handlePriceChange}
                style={{ width: '70%' }}
              />
            </div>
            <div className='d-flex align-items-center' style={{ marginTop: '10px' }}>
              <span style={{ fontSize: '14px', width: '30%', textAlign: 'left' }}>Giá max</span>
              <input
                type='number'
                className='form-control mx-2'
                max='3000000'
                value={giaMax !== null ? giaMax : ''} // Hiển thị giá trị max hoặc rỗng
                onChange={(e) => setGiaMax(e.target.value ? Number(e.target.value) : null)}
                onBlur={handlePriceChange}
                style={{ width: '70%' }}
              />
            </div>
          </div>
          <div className='filter-status'>
            <label style={{ fontSize: '14px' }}>Tình trạng phòng:</label>
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
                <label className='form-check-label' style={{ fontSize: '14px' }}>Tất cả</label>
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
                <label className='form-check-label' style={{ fontSize: '14px' }}>Trống</label>
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
                <label className='form-check-label' style={{ fontSize: '14px' }}>Đang sử dụng</label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='d-flex flex-wrap' style={{ width: '70%' }}>
        {Array.isArray(rooms) && rooms.length > 0 ? ( // Kiểm tra rooms có phải là mảng không
          rooms.map(room => (
            <div key={room.id} className='card' style={{ width: '30%', margin: '10px' }}>
              <div className='card-body'>
                {room.duongDanAnh ? (
                  <img
                    src={room.duongDanAnh}
                    alt='Phòng'
                    className='img-fluid'
                    style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                  />
                ) : (
                  <span>Không có hình ảnh</span>
                )}
              </div>
              <div className='card-footer'>
                <p style={{ fontSize: '14px', margin: '5px 1px' }}>Tên phòng: {room.tenPhong}</p>
                <p style={{ fontSize: '14px', margin: '5px 1px' }}>Tình trạng: {room.tinhTrang}</p>
                <p style={{ fontSize: '14px', margin: '5px 1px' }}>Giá: {room.giaPhong} VND</p>
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
