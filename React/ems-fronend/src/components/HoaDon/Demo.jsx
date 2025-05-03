// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { findCheckOut, checkOut } from '../../services/HoaDonDat';
// import { Box, Button, Container, Input, Stack, Table, Typography } from '@mui/joy';
// import SearchIcon from '@mui/icons-material/Search';
// import { ThemPhuThu } from '../../services/PhuThuService';

// const Demo = () => {
//     const [key, setKey] = useState('');
//     const [traPhong, setTraPhong] = useState([]);
//     const [errorMessage, setErrorMessage] = useState('');
//     const navigate = useNavigate();

//     const FindCheckOut = (key) => {
//         findCheckOut(key)
//             .then((response) => {
//                 console.log(response.data)
//                 setTraPhong(response.data);
//                 setErrorMessage('');
//             })
//             .catch((error) => {
//                 console.error(error);
//                 setErrorMessage('Không tìm thấy thông tin trả phòng.');
//             });
//     };

//     const CheckOut = async () => {
//         try {
//             // Gọi tuần tự thay vì Promise.all
//             for (const item of traPhong) {
//                 await checkOut(item.id);

//                 if (!item.xepPhong) continue;

//                 const ngayTraPhong = new Date(item.xepPhong.ngayTraPhong);
//                 const ngayTraThucTe = new Date(item.ngayTraThucTe);

//                 if (isNaN(ngayTraPhong) || isNaN(ngayTraThucTe)) {
//                     throw new Error(`Ngày không hợp lệ cho phòng ID: ${item.id}`);
//                 }

//                 const gio12Trua = new Date(ngayTraPhong);
//                 gio12Trua.setHours(12, 0, 0, 0);

//                 if (ngayTraThucTe > gio12Trua) {
//                     const phuThuRequest = {
//                         xepPhong: { id: item.xepPhong.id },
//                         tenPhuThu: 'Phụ thu do trả phòng muộn',
//                         tienPhuThu: 70000,
//                         soLuong: 1,
//                         trangThai: true,
//                     };
//                     await ThemPhuThu(phuThuRequest);
//                     alert(`Phụ thu đã được thêm cho phòng ${item.xepPhong.id}`);
//                 }
//             }

//             localStorage.setItem('traPhong', JSON.stringify(traPhong));
//             navigate('/tao-hoa-don');
//         } catch (error) {
//             const message = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi thực hiện thao tác.';
//             setErrorMessage(message);
//         }
//     };

//     const formatDate = (dateString) => {
//         const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
//         return new Date(dateString).toLocaleString('vi-VN', options);
//     };

//     const formatDateTime = (dateString) => {
//         const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
//         return new Date(dateString).toLocaleString('vi-VN', options);
//     };

//     return (
//         <Container>
//             <Box sx={{ padding: 3 }}>
//                 {/* Tìm kiếm */}
//                 <Box sx={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
//                     <Typography level="h4" sx={{ marginBottom: 2 }}>
//                         Tìm kiếm thông tin trả phòng
//                     </Typography>
//                     <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
//                         <Input
//                             fullWidth
//                             placeholder="Nhập mã hoặc từ khóa..."
//                             value={key}
//                             onChange={(e) => setKey(e.target.value)}
//                             startDecorator={<SearchIcon />}
//                             sx={{ maxWidth: 400 }}
//                         />
//                         <Button variant="solid" color="primary" onClick={() => FindCheckOut(key)}>
//                             Tìm kiếm
//                         </Button>
//                     </Stack>
//                 </Box>

//                 {/* Hiển thị thông báo lỗi nếu có */}
//                 {errorMessage && (
//                     <Box sx={{ textAlign: 'center', marginTop: 2 }}>
//                         <Typography level="body1" color="danger">
//                             {errorMessage}
//                         </Typography>
//                     </Box>
//                 )}

//                 {/* Hiển thị danh sách trả phòng */}
//                 <Box sx={{ marginTop: 4 }}>
//                     {traPhong.length === 0 ? (
//                         <Box sx={{ textAlign: 'center', marginTop: 4 }}>
//                             <Typography level="body1" sx={{ marginBottom: 2 }}>
//                                 Không có thông tin trả phòng được tìm thấy.
//                             </Typography>
//                             <Typography level="body2" color="neutral">
//                                 Hãy thử tìm kiếm lại bằng mã hoặc từ khóa khác.
//                             </Typography>
//                         </Box>
//                     ) : (
//                         <Box sx={{ overflowX: 'auto' }}>
//                             <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
//                                 <Typography level="h4">Chi tiết trả phòng</Typography>
//                                 <Button variant="solid" color="success" onClick={CheckOut}>
//                                     Trả phòng
//                                 </Button>
//                             </Box>

//                             <Table borderAxis="x" size="md" stickyHeader variant="outlined">
//                                 <thead>
//                                     <tr>
//                                         <th>#</th>
//                                         <th>Tên phòng</th>
//                                         <th>Ngày nhận</th>
//                                         <th>Ngày trả thực tế</th>
//                                         <th>Trạng thái KTP</th>
//                                         <th>Thời gian KTP</th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {traPhong.map((item, index) => (
//                                         <tr key={index}>
//                                             <td>{index + 1}</td>
//                                             <td>{item.tenPhong || 'Không có dữ liệu'}</td>
//                                             <td>{formatDate(item.ngayNhan)}</td>
//                                             <td>{formatDateTime(item.ngayTraThucTe)}</td>
//                                             <td>{item.trangThaiKTP}</td>
//                                             <td>{item.thoiGianKTP ? formatDateTime(item.thoiGianKTP) : "N/A"}</td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </Table>
//                         </Box>
//                     )}
//                 </Box>
//             </Box>
//         </Container>
//     );
// };

// export default Demo;

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { findCheckOut, checkOut } from '../../services/HoaDonDat';
import { Box, Button, Container, Input, Stack, Table, Typography } from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import { ThemPhuThu } from '../../services/PhuThuService';
import { getXepPhongById } from '../../services/XepPhongService';
import Swal from 'sweetalert2';

const Demo = () => {
    const [key, setKey] = useState('');
    const [traPhong, setTraPhong] = useState([]);
    const [selectedTraPhong, setSelectedTraPhong] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const FindCheckOut = (key) => {
        findCheckOut(key)
            .then((response) => {
                console.log(response.data);
                setTraPhong(response.data);
                setSelectedTraPhong([]); // Reset danh sách chọn khi tìm kiếm mới
                setErrorMessage('');
            })
            .catch((error) => {
                console.error(error);
                setErrorMessage('Không tìm thấy thông tin trả phòng.');
            });
    };

    const handleCheckboxChange = (id) => {
        setSelectedTraPhong((prev) =>
            prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
        );
    };

    const CheckOut = async () => {
        if (selectedTraPhong.length === 0) {
            setErrorMessage('Vui lòng chọn ít nhất một phòng để trả.');
            return;
        }

        try {
            const selectedItems = traPhong.filter((item) => selectedTraPhong.includes(item.id));

            for (const item of selectedItems) {
                await checkOut(item.id);

                if (!item.xepPhong) {
                    const response = await getXepPhongById(item.idXepPhong);
                    item.xepPhong = response.data;

                    console.log('xepPhong data:', response.data);

                }

                const ngayTraPhong = new Date(item.xepPhong.ngayTraPhong);
                const ngayTraThucTe = new Date(item.ngayTraThucTe);

                if (isNaN(ngayTraPhong) || isNaN(ngayTraThucTe)) {
                    throw new Error(`Ngày không hợp lệ cho phòng ID: ${item.id}`);
                }

                const gio12Trua = new Date(ngayTraPhong);
                gio12Trua.setHours(12, 0, 0, 0);

                const diffMinutes = (ngayTraThucTe - gio12Trua) / (1000 * 60);
                console.log(`Phòng ID: ${item.id}`);
                console.log(`- Ngày trả dự kiến: ${gio12Trua}`);
                console.log(`- Ngày trả thực tế: ${ngayTraThucTe}`);
                console.log(`- Số phút trả muộn: ${diffMinutes}`);

                let tienPhuThu = 0;
                let tenPhuThu = '';

                if (diffMinutes <= 15) {
                    console.log('- Trả muộn <= 15 phút -> Không phụ thu');
                    continue;
                } else if (diffMinutes <= 59) {
                    tienPhuThu = 100000;
                    tenPhuThu = 'Phụ thu trả phòng muộn 1 tiếng đầu tiên';
                } else if (diffMinutes <= 180) { // 1-3 giờ
                    tienPhuThu = item.xepPhong.thongTinDatPhong.giaDat * 0.3;
                    tenPhuThu = 'Phụ thu trả phòng muộn (3 giờ) 30% giá phòng';
                } else if (diffMinutes <= 600) { // 4-10 giờ
                    tienPhuThu = item.xepPhong.thongTinDatPhong.giaDat * 0.5;
                    tenPhuThu = 'Phụ thu trả phòng muộn (10 giờ) 50% giá phòng';
                } else {
                    tienPhuThu = item.xepPhong.thongTinDatPhong.giaDat;
                    tenPhuThu = 'Phụ thu trả phòng muộn (>10 giờ)';
                }

                console.log(`- Áp dụng phụ thu: ${tenPhuThu}, số tiền: ${tienPhuThu.toLocaleString('vi-VN')} VND`);

                const phuThuRequest = {
                    xepPhong: { id: item.xepPhong.id },
                    tenPhuThu,
                    tienPhuThu,
                    soLuong: 1,
                    trangThai: false,
                };

                await ThemPhuThu(phuThuRequest);
                Swal.fire("Thành công",`Đã tạo phụ thu do trả phòng muộn cho phòng ${item.xepPhong.phong.tenPhong}`, "success");
            }

            localStorage.setItem('traPhong', JSON.stringify(selectedItems));
            navigate('/tao-hoa-don');
        } catch (error) {
            const message = error.response?.data?.message || error.message || 'Đã xảy ra lỗi khi thực hiện thao tác.';
            setErrorMessage(message);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return new Date(dateString).toLocaleString('vi-VN', options);
    };

    const formatDateTime = (dateString) => {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(dateString).toLocaleString('vi-VN', options);
    };

    // Kiểm tra xem có phòng nào đã kiểm tra không
    const hasCheckedRoom = traPhong.some((item) => item.trangThaiKTP === 'Đã kiểm tra');

    return (
        <Container>
            <Box sx={{ padding: 3 }}>
                {/* Tìm kiếm */}
                <Box sx={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
                    <Typography level="h4" sx={{ marginBottom: 2 }}>
                        Tìm kiếm thông tin trả phòng
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                        <Input
                            fullWidth
                            placeholder="Nhập mã hoặc từ khóa..."
                            value={key}
                            onChange={(e) => setKey(e.target.value)}
                            startDecorator={<SearchIcon />}
                            sx={{ maxWidth: 400 }}
                        />
                        <Button variant="solid" color="primary" onClick={() => FindCheckOut(key)}>
                            Tìm kiếm
                        </Button>
                    </Stack>
                </Box>

                {/* Hiển thị thông báo lỗi nếu có */}
                {errorMessage && (
                    <Box sx={{ textAlign: 'center', marginTop: 2 }}>
                        <Typography level="body1" color="danger">
                            {errorMessage}
                        </Typography>
                    </Box>
                )}

                {/* Hiển thị danh sách trả phòng */}
                <Box sx={{ marginTop: 4 }}>
                    {traPhong.length === 0 ? (
                        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
                            <Typography level="body1" sx={{ marginBottom: 2 }}>
                                Không có thông tin trả phòng được tìm thấy.
                            </Typography>
                            <Typography level="body2" color="neutral">
                                Hãy thử tìm kiếm lại bằng mã hoặc từ khóa khác.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ overflowX: 'auto' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                                <Typography level="h4">Chi tiết trả phòng</Typography>
                                <Button
                                    variant="solid"
                                    color="success"
                                    onClick={CheckOut}
                                    disabled={selectedTraPhong.length === 0}
                                >
                                    Trả phòng
                                </Button>
                            </Box>

                            <Table borderAxis="x" size="md" stickyHeader variant="outlined">
                                <thead>
                                    <tr>
                                        <th style={{ width: '50px' }}>
                                            <input
                                                type="checkbox"
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setSelectedTraPhong(
                                                            traPhong
                                                                .filter((item) => item.trangThaiKTP === 'Đã kiểm tra')
                                                                .map((item) => item.id)
                                                        );
                                                    } else {
                                                        setSelectedTraPhong([]);
                                                    }
                                                }}
                                                checked={
                                                    selectedTraPhong.length ===
                                                    traPhong.filter((item) => item.trangThaiKTP === 'Đã kiểm tra').length &&
                                                    traPhong.length > 0
                                                }
                                                disabled={!hasCheckedRoom} // Vô hiệu hóa nếu không có phòng nào đã kiểm tra
                                            />
                                        </th>
                                        <th>Tên phòng</th>
                                        <th>Ngày nhận</th>
                                        <th>Ngày trả thực tế</th>
                                        <th>Trạng thái KTP</th>
                                        <th>Thời gian KTP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {traPhong.map((item) => (
                                        <tr key={item.id}>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedTraPhong.includes(item.id)}
                                                    onChange={() => handleCheckboxChange(item.id)}
                                                    disabled={item.trangThaiKTP !== 'Đã kiểm tra'}
                                                />
                                            </td>
                                            <td>{item.tenPhong || 'Không có dữ liệu'}</td>
                                            <td>{formatDate(item.ngayNhan)}</td>
                                            <td>{formatDateTime(item.ngayTraThucTe)}</td>
                                            <td>{item.trangThaiKTP}</td>
                                            <td>{item.thoiGianKTP ? formatDateTime(item.thoiGianKTP) : "N/A"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Box>
                    )}
                </Box>
            </Box>
        </Container>
    );
};

export default Demo;