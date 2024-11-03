import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRoomDetail, getServiceBillsByRoomId, getTTDP } from '../../services/ViewPhong';

const RoomDetail = () => {
  const { roomId } = useParams();
  const [roomDetail, setRoomDetail] = useState(null);
  const [serviceBills, setServiceBills] = useState([]);
  const [ttdp, setTtdp] = useState(null); // Trạng thái cho thông tin đặt phòng
  const [loading, setLoading] = useState(true); // Trạng thái loading

  useEffect(() => {
    const fetchRoomDetail = async () => {
      setLoading(true); // Bắt đầu loading
      try {
        const detail = await getRoomDetail(roomId); // Lấy thông tin phòng
        setRoomDetail(detail);
        
        const bills = await getServiceBillsByRoomId(roomId); // Lấy phiếu dịch vụ theo id phòng
        setServiceBills(bills);

        const ttdpData = await getTTDP(); // Lấy thông tin đặt phòng nếu cần
        setTtdp(ttdpData);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin phòng:", error);
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchRoomDetail();
  }, [roomId]);

  return (
    <div>
      {loading ? (
        <p>Đang tải thông tin phòng...</p>
      ) : roomDetail ? (
        <div>
          <h2>Chi tiết phòng: {roomDetail.tenPhong}</h2>
          <p>Giá: {roomDetail.giaPhong} VND</p>
          {roomDetail.duongDanAnh && (
            <img
              src={roomDetail.duongDanAnh}
              alt='Phòng'
              className='img-fluid'
              style={{ width: '100%', height: '300px', objectFit: 'cover' }}
            />
          )}
          <h3>Phiếu dịch vụ</h3>
          {serviceBills.length > 0 ? (
            serviceBills.map(bill => (
              <div key={bill.id}>
                <p>ID phiếu: {bill.id}</p>
                <p>Mô tả: {bill.moTa}</p>
                {/* Thêm thông tin cần thiết khác */}
              </div>
            ))
          ) : (
            <p>Không có phiếu dịch vụ nào.</p>
          )}
        </div>
      ) : (
        <p>Không tìm thấy thông tin phòng.</p>
      )}
    </div>
  );
};

export default RoomDetail;
