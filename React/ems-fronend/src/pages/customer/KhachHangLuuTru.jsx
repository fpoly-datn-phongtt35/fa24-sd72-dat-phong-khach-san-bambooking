import { Box, Container, Input, Option, Select, Sheet, Table, Tooltip, Typography, Button } from '@mui/joy';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import { IconButton, Pagination, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';
import { dsKhachHangLuuTru } from '../../services/KhachHangCheckin';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

export const KhachHangLuuTru = () => {
    const [data, setData] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [keyword, setKeyword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setError(null);
                const response = await dsKhachHangLuuTru(keyword);
                const responseData = Array.isArray(response.data) ? response.data : [];
                console.log('Processed data:', responseData);
                setData(responseData);
            } catch (error) {
                console.error('Lỗi khi lấy danh sách khách lưu trú:', error);
                setData([]);
                setError('Không thể tải danh sách khách lưu trú. Vui lòng thử lại.');
            }
        };

        fetchData();
    }, [keyword]);

    useEffect(() => {
        const startIndex = (pageNo - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedData = Array.isArray(data) ? data.slice(startIndex, endIndex) : [];
        setDisplayData(paginatedData);

        if (paginatedData.length === 0 && pageNo > 1) {
            setPageNo(1);
        }
    }, [data, pageNo, pageSize]);

    const handlePageChange = (event, value) => {
        setPageNo(value);
    };

    const debouncedSearch = debounce((value) => {
        setKeyword(value);
        setPageNo(1);
    }, 300);

    const onChangeSearch = (e) => {
        debouncedSearch(e.target.value);
    };

    const exportToExcel = () => {
        try {
            // Chuyển đổi dữ liệu thành định dạng Excel
            const excelData = data.map((row) => ({
                'Họ và tên': `${row[0].khachHang.ho} ${row[0].khachHang.ten}`,
                'Giới tính': row[0].khachHang.gioiTinh || 'N/A',
                'SĐT': row[0].khachHang.sdt || 'N/A',
                'CMND': row[0].khachHang.cmnd || 'N/A',
                'Phòng': row[1] || 'N/A',
            }));

            // Tạo worksheet
            const worksheet = XLSX.utils.json_to_sheet(excelData);
            // Tạo workbook
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'KhachHangLuuTru');

            // Chuyển workbook thành buffer
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            // Tạo blob từ buffer
            const file = new Blob([excelBuffer], { type: 'application/octet-stream' });
            // Tải file
            saveAs(file, 'DanhSachKhachHangLuuTru.xlsx');
        } catch (error) {
            console.error('Lỗi khi xuất file Excel:', error);
            alert('Đã xảy ra lỗi khi xuất file Excel. Vui lòng thử lại.');
        }
    };

    const totalPage = Math.ceil((Array.isArray(data) ? data.length : 0) / pageSize);

    return (
        <Container>
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginTop: '20px',
                }}
            >
                <Typography level="h3">Danh sách khách hàng lưu trú </Typography>
                
                <Typography
                        color="primary"
                        level="title-sm"
                        variant="plain"
                        sx={{ cursor: 'pointer' }}
                        startDecorator={<DownloadIcon />}
                        onClick={exportToExcel}
                    >
                        Xuất file Excel
                    </Typography>
            </Box>
            <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'space-between', alignContent: 'center' }}>
                <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Input
                        placeholder="Tìm kiếm theo tên, số điện thoại, CMND, mã phòng."
                        startDecorator={<SearchIcon />}
                        sx={{ width: '420px' }}
                        onChange={(e) => onChangeSearch(e)}
                    />
                </Stack>
                <Stack spacing={1} direction="row" sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Typography color="neutral" level="title-md" noWrap variant="plain">
                        Hiển thị:
                    </Typography>
                    <Select
                        value={pageSize}
                        sx={{ width: '80px' }}
                        onChange={(event, value) => setPageSize(value)}
                    >
                        <Option value={5}>5</Option>
                        <Option value={10}>10</Option>
                        <Option value={25}>25</Option>
                        <Option value={50}>50</Option>
                        <Option value={100}>100</Option>
                    </Select>
                </Stack>
            </Box>
            {error && (
                <Typography color="danger" sx={{ textAlign: 'center', mt: 2 }}>
                    {error}
                </Typography>
            )}
            <Sheet sx={{ marginTop: 2, padding: '2px', borderRadius: '5px' }}>
                <Table borderAxis="x" size="lg" stickyHeader variant="outlined">
                    <thead>
                        <tr>
                            <th>Họ và tên</th>
                            <th>Giới tính</th>
                            <th>SĐT</th>
                            <th>CMND</th>
                            <th className="text-center">Phòng</th>
                            <th className="text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {displayData.length === 0 && !error ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center' }}>
                                    <Typography>Không có dữ liệu</Typography>
                                </td>
                            </tr>
                        ) : (
                            displayData.map((row, index) => (
                                <tr key={row[0].id || index}>
                                    <td>{row[0].khachHang.ho + ' ' + row[0].khachHang.ten}</td>
                                    <td>{row[0].khachHang.gioiTinh || 'N/A'}</td>
                                    <td>{row[0].khachHang.sdt || 'N/A'}</td>
                                    <td>{row[0].khachHang.cmnd || 'N/A'}</td>
                                    <td className="text-center">{row[1] || 'N/A'}</td>
                                    <td className="text-center">
                                        <Tooltip title="Xem chi tiết" variant="plain">
                                            <IconButton
                                                color="warning"
                                                onClick={() => navigate(`/update-khach-hang/${row[0].id}`)}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            </Sheet>
            {totalPage >= 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                    <Stack spacing={2}>
                        <Pagination
                            count={totalPage}
                            page={pageNo}
                            onChange={handlePageChange}
                            color="primary"
                        />
                    </Stack>
                </Box>
            )}
        </Container>
    );
};