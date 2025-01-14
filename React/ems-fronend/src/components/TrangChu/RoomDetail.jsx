import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRoomDetail, getDichVuSuDungByIDXepPhong, AddDichVuSuDung } from '../../services/ViewPhong';
import { DuLieu } from '../../services/DichVuService';
import DVSVDetail from './DVSDDetail';

const RoomDetail = () => {
  const { roomId } = useParams();
  const [roomDetail, setRoomDetail] = useState(null);
  const [ListDVSD, setListDVSD] = useState([]);
  const [showFormDetail, setShowFormDetail] = useState(false);
  const [selectedDichVu, setSelectedDichVu] = useState(null); // Lưu dịch vụ được chọn
  const [newDichVu, setNewDichVu] = useState({
    dichVu: { id: '' },
    xepPhong: { id: '' },
    soLuongSuDung: '',
    ngayKetThuc: '', // Dữ liệu kiểu datetime-local
    giaSuDung: '',
    trangThai: 1,
  });

  useEffect(() => {
    getRoomDetail(roomId)
      .then((response) => {
        setRoomDetail(response);
        return getDichVuSuDungByIDXepPhong(response.id);
      })
      .then((dichVuResponse) => {
        const responseArray = Array.isArray(dichVuResponse) ? dichVuResponse : [dichVuResponse];
        setListDVSD(responseArray);
      })
      .catch((error) => {
        console.log("Error fetching data:", error);
      });


  }, [roomId, ListDVSD]);

  useEffect(() => {
    // Cập nhật id của xepPhong trong newDichVu khi roomDetail được load
    if (roomDetail) {
      setNewDichVu((prev) => ({
        ...prev,
        xepPhong: { id: roomDetail.id },
      }));
    }
  }, [roomDetail]);

  const handleAddDV = () => {
    setShowForm(true); // Hiển thị form khi nhấn nút
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    // Định dạng ngày giờ sang chuẩn LocalDateTime trước khi gửi lên backend
    const formattedData = {
      ...newDichVu,
      ngayKetThuc: `${newDichVu.ngayKetThuc}:00`, // Đảm bảo đúng định dạng ISO 8601
    };
    console.log(formattedData)
    AddDichVuSuDung(formattedData)
      .then(() => {
        console.log("Dữ liệu thêm dịch vụ:", formattedData);
        setShowForm(false); // Đóng form sau khi thêm
      })
      .catch((error) => {
        console.error("Error adding service:", error);
      });
  };

 

  const handleCloseFormDetail = () => {
    setShowFormDetail(false);
    setSelectedDichVu(null);
  };

  return (
    <div className='container'>
      <div className='row'>
        {/*Form thông tin khách hàng */}
        <div className='col-md-4'>
          <div className='card'>
            <h5 className='text-center' style={{ marginTop: '15px' }}></h5>
            <div className='card-body'>
              <form>
                <div className='form-group mb-3'>
                  <label className='form-label'>Họ tên khách hàng </label>
                  <p>
                    {roomDetail?.thongTinDatPhong?.datPhong?.khachHang
                      ? roomDetail.thongTinDatPhong.datPhong.khachHang.ho +
                      ' ' +
                      roomDetail.thongTinDatPhong.datPhong.khachHang.ten
                      : 'Chưa có thông tin khách hàng'}
                  </p>

                </div>
                <div className='form-group mb-3'>
                  <label className='form-label'>Số điện thoại: </label>
                  <p>
                    {roomDetail?.thongTinDatPhong?.datPhong?.khachHang?.sdt}
                  </p>
                </div>
                <div className='form-group mb-3'>
                  <label className='form-label'>Ngày nhận phòng: </label>
                  <p>
                    {roomDetail?.thongTinDatPhong?.ngayNhanPhong || ''}
                  </p>
                </div>
                <div className='form-group mb-3'>
                  <label className='form-label'>Ngày trả phòng: </label>
                  <p>
                    {roomDetail?.thongTinDatPhong?.ngayTraPhong}
                  </p>
                </div>
                <div className='form-group mb-3'>
                  <label className='form-label'>Giá đặt: </label>
                  <p>
                    {roomDetail?.thongTinDatPhong?.giaDat} VND
                  </p>
                </div>

              </form>
            </div>
          </div>
        </div>

        {/*Form thông tin dịch vụ sử dụng */}
        <div className='col-md-8'>
          <div className='d-flex flex-wrap' style={{ width: '100%' }}>
            {Array.isArray(ListDVSD) && ListDVSD.length > 0 ? (
              ListDVSD.map((dv) => (
                <div key={dv.id} className='card' style={{ width: '30%', margin: '10px' }}
                  onClick={() => {
                    setSelectedDichVu(dv);
                    setShowFormDetail(true);
                  }}>
                  <div className='card-footer'>
                    <label>Tên dịch vụ:</label>
                    <p>{dv.dichVu?.tenDichVu}</p>
                    <label>Giá sử dụng:</label>
                    <p>{dv.giaSuDung}</p>
                    <label>Số lượng sử dụng:</label>
                    <p>{dv.soLuongSuDung}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>Không tìm thấy thông tin dịch vụ nào.</p>
            )}
          </div>
          <div>
            <button className='btn btn-primary' onClick={()=>{
              setShowFormDetail(true);
              setSelectedDichVu(null);
            }}>
              Thêm dịch vụ
            </button>
          </div>

         
        </div>
        {showFormDetail && <DVSVDetail show={showFormDetail} handleClose={handleCloseFormDetail} data={selectedDichVu} idxp={roomDetail?.id}/>}
      </div>

    </div>
  );
};

export default RoomDetail;
