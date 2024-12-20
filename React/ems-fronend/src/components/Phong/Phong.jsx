import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { createPhong, getLoaiPhong, getOnePhong, updatePhong } from '../../services/PhongService';
import { uploadImage } from '../../services/ImageService';
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

    }, [id]);

    const saveOrUpdate = (e) => {
        e.preventDefault();

        const phong = {
            maPhong,
            tenPhong,
            idLoaiPhong,
            tinhTrang,
            trangThai: trangThai ? "true" : "false"
        };

        const formData = new FormData();
        formData.append('file', file);
        formData.append('tenAnh', tenPhong);
        formData.append('idPhong', id);

        // Gửi giá trị trạng thái dưới dạng boolean
        formData.append('trangThai', trangThai);

        const handleError = (error) => {
            if (error.response && error.response.data) {
                setErrors(error.response.data);
                console.log("Lỗi từ API:", error.response.data); // Log dữ liệu lỗi
            } else {
                console.log(error);
            }
        };


        if (id) {
            updatePhong(id, phong).then((response) => {
                console.log("Cập nhật phòng thành công: " + response.data.content)
                navigate('/phong');
            }).catch(handleError);

            uploadImage(formData)
                .then((response) => {
                    console.log('Upload thành công:', response.data);
                })
                .catch((error) => {
                    console.error('Lỗi khi upload:', error);
                });
        } else {
            createPhong(phong).then((response) => {
                console.log("Thêm phòng thành công: " + response.data.content);
                navigate('/phong')
            }).catch(handleError);

            uploadImage(formData)
                .then((response) => {
                    console.log('Upload thành công:', response.data);
                })
                .catch((error) => {
                    console.error('Lỗi khi upload:', error);
                });
        };


    }

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className='container'>
            <br /><br />
            <div className='row'>
                <div className='card col-md-6 offset-md-3'>
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
                            <div>
                                {id && (
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
                                )}
                            </div>

                            <button className='btn btn-success' onClick={saveOrUpdate}>{id ? "Cập nhật" : "Thêm"}</button>
                            <button className='btn btn-outline-primary' style={{ marginLeft: '10px' }} onClick={() => navigate('/phong')}>Quay lại</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Phong;
