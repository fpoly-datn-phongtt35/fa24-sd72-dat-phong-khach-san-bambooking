import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { createPhong, getLoaiPhong, getOnePhong, updatePhong } from '../../services/PhongService';
import { uploadImage, searchByIDPhong } from '../../services/ImageService';
import Swal from 'sweetalert2';


const Phong = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [maPhong, setMaPhong] = useState('');
    const [tenPhong, setTenPhong] = useState('');
    const [idLoaiPhong, setIdLoaiPhong] = useState('');
    const [lp, setLoaiPhong] = useState([]);
    const [tinhTrang, setTinhTrang] = useState('');
    const [trangThai, setTrangThai] = useState(true);
    const [errors, setErrors] = useState({});
    const [listImage, setlistImage] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        getLoaiPhong().then(response => {

            setLoaiPhong(response.data); //Phân trang thì gọi getContent còn k thì response.data thôi. Mất mẹ 4h.
        }).catch((error) => {
            console.log("Có lỗi khi lấy loại phòng: " + error);
        });


        if (id) {
            getOnePhong(id).then((response) => {
                const { maPhong, tenPhong, idLoaiPhong, tinhTrang, trangThai } = response.data;
                setMaPhong(maPhong);
                setTenPhong(tenPhong);
                setIdLoaiPhong(idLoaiPhong);
                setTinhTrang(tinhTrang);
                // setTrangThai(trangThai === "Hoạt động");
                setTrangThai(trangThai);
            }).catch((error) => {
                console.log("Có lỗi khi lấy phòng: " + error)
            });
        };

        searchByIDPhong(id).then(response => {
            setlistImage(response.data);
        }).catch((error) => {
            console.log("Có lỗi khi lấy ảnh phòng: " + error)
        });

    }, [id]);

    const saveOrUpdate = (e) => {
        e.preventDefault();
    
        const phong = {
            maPhong,
            tenPhong,
            idLoaiPhong,
            tinhTrang: id ? tinhTrang : "available",
            trangThai: trangThai ? "true" : "false"
        };
    
        const formData = new FormData();
        formData.append('file', file);
        formData.append('tenAnh', tenPhong);
        formData.append('idPhong', id);
        formData.append('tinhTrang', id ? tinhTrang : 'available');
        formData.append('trangThai', id ? trangThai : 'true');
    
        const handleError = (error) => {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
                console.error("Lỗi từ API:", error.response.data); // Log dữ liệu lỗi
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Không thể hoàn thành thao tác. Vui lòng kiểm tra lại!',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            } else {
                console.error(error);
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Đã xảy ra lỗi không xác định.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        };
    
        Swal.fire({
            title: id ? 'Xác nhận cập nhật' : 'Xác nhận thêm mới',
            text: id ? 'Bạn có chắc chắn muốn cập nhật thông tin phòng?' : 'Bạn có chắc chắn muốn thêm phòng mới?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: id ? 'Cập nhật' : 'Thêm mới',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                if (id) {
                    // Cập nhật phòng
                    updatePhong(id, phong).then((response) => {
                        console.log("Cập nhật phòng thành công:", response.data.content);
                        uploadImage(formData)
                            .then((response) => {
                                console.log('Upload thành công:', response.data);
                            })
                            .catch((error) => {
                                console.error('Lỗi khi upload:', error);
                            });
                        Swal.fire({
                            title: 'Thành công!',
                            text: 'Thông tin phòng đã được cập nhật.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => navigate('/phong'));
                    }).catch(handleError);
                } else {
                    // Thêm mới phòng
                    createPhong(phong).then((response) => {
                        console.log("Thêm phòng thành công:", response.data.content);
                        Swal.fire({
                            title: 'Thành công!',
                            text: 'Phòng mới đã được thêm.',
                            icon: 'success',
                            confirmButtonText: 'OK'
                        }).then(() => navigate('/phong'));
                    }).catch(handleError);
                }
            }
        });
    };
    

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % listImage.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + listImage.length) % listImage.length);
    };

    return (
        <div className='container'>
            <div className='row'>
                {/* Phần hiển thị ảnh */}
                <div className='col-md-6'>
                    <div className='card'>
                        <h5 className='text-center' style={{ marginTop: '15px' }}>Ảnh phòng</h5>
                        <div className='card-body'>
                            <div className="image-preview">
                                {listImage && listImage.length > 0 ? (
                                    <>
                                        <div className="slide-container">
                                            <button onClick={prevSlide} className="prev-btn">❮</button>
                                            <img
                                                src={listImage[currentIndex].duongDan}
                                                alt={`Ảnh phòng ${currentIndex + 1}`}
                                                style={{ width: '100%' }}
                                            />
                                            <button onClick={nextSlide} className="next-btn">❯</button>
                                        </div>
                                    </>
                                ) : (
                                    <p>Chưa có ảnh</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>


                <div className='col-md-6'>
                    {/* Phần form hiện tại */}
                    <div className='card'>
                        <h5 className='text-center' style={{ marginTop: '15px' }}>{id ? "Cập nhật phòng" : "Thêm phòng"}</h5>
                        <div className='card-body'>
                            <form>
                                <div className='form-group mb-3'>
                                    <label className='form-label'>Mã phòng: </label>
                                    <input
                                        type="text"
                                        placeholder='Nhập mã phòng'
                                        value={maPhong}
                                        name='maPhong'
                                        className={`form-control ${errors.maPhong ? 'is-invalid' : ''}`}
                                        onChange={(e) => setMaPhong(e.target.value)}
                                    />
                                    {errors.maPhong && <div className='invalid-feedback'>{errors.maPhong}</div>}
                                </div>
                                <div className='form-group mb-3'>
                                    <label className='form-label'>Tên phòng: </label>
                                    <input
                                        type="text"
                                        placeholder='Nhập tên phòng'
                                        value={tenPhong}
                                        name='tenPhong'
                                        className={`form-control ${errors.tenPhong ? 'is-invalid' : ''}`}
                                        onChange={(e) => setTenPhong(e.target.value)}
                                    />
                                    {errors.tenPhong && <div className='invalid-feedback'>{errors.tenPhong}</div>}
                                </div>

                                <div className='form-group mb-3'>
                                    <label className='form-label'>Loại phòng</label>
                                    <select
                                        className={`form-select ${errors.idLoaiPhong ? 'is-invalid' : ''}`}
                                        value={idLoaiPhong}
                                        name='idLoaiPhong'
                                        onChange={(e) => setIdLoaiPhong(e.target.value)}
                                    >
                                        <option value="">Chọn loại phòng</option>
                                        {
                                            lp.map((loaiPhong) => (
                                                <option
                                                    key={loaiPhong.id}
                                                    value={loaiPhong.id}
                                                >
                                                    {loaiPhong.tenLoaiPhong}
                                                </option>
                                            ))
                                        }
                                    </select>
                                    {errors.idLoaiPhong && <div className='invalid-feedback'>{errors.idLoaiPhong}</div>}
                                </div>
                                {id && (
                                    <>
                                        <div className='form-group mb-3'>
                                            <label className='form-label'>Tình trạng: </label>
                                            <input
                                                type="text"
                                                placeholder='Nhập tình trạng phòng'
                                                value={tinhTrang}
                                                name='tinhTrang'
                                                className={`form-control ${errors.tinhTrang ? 'is-invalid' : ''}`}
                                                onChange={(e) => setTinhTrang(e.target.value)}
                                            />
                                            {errors.tinhTrang && <div className='invalid-feedback'>{errors.tinhTrang}</div>}
                                        </div>

                                        <div className='form-group mb-3 row'>
                                            <label className='form-label'>Trạng thái</label>
                                            <div className='col-md-9'>
                                                <div className='form-check form-check-inline'>
                                                    <input
                                                        type="radio"
                                                        id='active'
                                                        value={true}
                                                        checked={trangThai === true}
                                                        className={`form-check-input`}
                                                        onChange={() => setTrangThai(true)}
                                                    />
                                                    <label htmlFor="active">Hoạt động</label>
                                                </div>
                                                <div className='form-check form-check-inline'>
                                                    <input
                                                        type="radio"
                                                        id='inactive'
                                                        value={false}
                                                        checked={trangThai === false}
                                                        className={`form-check-input`}
                                                        onChange={() => setTrangThai(false)}
                                                    />
                                                    <label htmlFor="inactive">Ngừng hoạt động</label>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="form-group mb-3">
                                            <label className='form-label'>Chọn Ảnh:</label>
                                            <div className="mb-3">
                                                <input
                                                    type="file"
                                                    className="form-control-file"
                                                    id="file"
                                                    onChange={handleFileChange}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <button className='btn btn-success' onClick={saveOrUpdate}>{id ? "Cập nhật" : "Thêm"}</button>
                                <button className='btn btn-outline-primary' style={{ marginLeft: '10px' }} onClick={() => navigate('/phong')}>Quay lại</button>
                            </form>
                        </div>
                    </div>
                </div>


            </div>

            {/* CSS cho slide */}
            <style jsx>{`
    .slide-container {
        position: relative;
        text-align: center;
    }
    .prev-btn, .next-btn {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background-color: rgba(0, 0, 0, 0.5);
        color: white;
        border: none;
        padding: 10px;
        cursor: pointer;
    }
    .prev-btn {
        left: 0;
    }
    .next-btn {
        right: 0;
    }
`}</style>
        </div>

    )
}

export default Phong;
