import { Box, Container, Input, Option, Select, Sheet, Switch, Table, Tooltip, Typography, Avatar } from '@mui/joy'
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ListIcon from '@mui/icons-material/List';
import { IconButton, Pagination, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchAllCustomer, updatStatus } from '../../apis/customerApi';
import { useNavigate } from 'react-router-dom';
import debounce from 'lodash/debounce';

export const Customer = () => {
    const [data, setData] = useState(null);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [keyword, setKeyword] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        handleFetchData();
    }, [pageNo, pageSize, keyword]);

    const handleFetchData = async () => {
        const param = { pageNo, pageSize, keyword }
        await fetchAllCustomer(param).then(res => {
            setData(res?.data);
            console.log(res?.data);
        })
    }

    const handleUpdateStatus = async (id, status) => {
        await updatStatus(id, status).then(() => {
            handleFetchData();
        })
    }

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

    return (
        <Container>

            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between', // Giữ tiêu đề bên trái, các nút bên phải
                    marginTop: '20px',
                }}
            >
                <Typography level="h3">Quản lý khách hàng</Typography>
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '25px', // Khoảng cách nhỏ giữa hai nút
                    }}
                >
                    <Typography
                        color="primary"
                        level="title-sm"
                        variant="plain"
                        startDecorator={<ListIcon />}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate('/khach-hang-luu-tru')}
                    >
                        Danh sách khách lưu trú
                    </Typography>
                    <Typography
                        color="primary"
                        level="title-sm"
                        variant="plain"
                        startDecorator={<AddIcon />}
                        sx={{ cursor: 'pointer' }}
                        onClick={() => navigate('/add-khach-hang')}
                    >
                        Thêm khách hàng
                    </Typography>
                </Box>
            </Box>
            <Box sx={{ marginTop: 3, display: 'flex', justifyContent: 'space-between', alignContent: 'center' }} >
                <Stack sx={{
                    justifyContent: "center",
                    alignItems: "center",
                }}>
                    <Input placeholder='Tìm kiếm theo tên đăng nhập, số điện thoại, ...' startDecorator={<SearchIcon />} sx={{ width: '400px' }} onChange={(e) => onChangeSearch(e)} />
                </Stack>
                <Stack
                    spacing={1}
                    direction="row"
                    sx={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Typography color="neutral" level="title-md" noWrap variant="plain">
                        Hiển thị:
                    </Typography>
                    <Select
                        value={pageSize}
                        sx={{ width: "80px" }}
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
            <Sheet sx={{
                marginTop: 2,
                padding: "2px",
                borderRadius: "5px",
            }}>
                <Table
                    borderAxis="x" size="lg" stickyHeader variant="outlined"
                >
                    <thead>
                        <tr>
                            <th>Avatar</th>
                            <th>Tên đăng nhập</th>
                            <th>Họ và tên</th>
                            <th>Giới tính</th>
                            <th>SĐT</th>
                            <th className='text-center'>Trạng thái</th>
                            <th className='text-center'>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data && data?.data.map((value) => (
                                <tr key={value.id}>
                                    <td>
                                        <Avatar src={value?.avatar} />
                                    </td>
                                    <td>{value.username}</td>
                                    <td>{value.fullName}</td>
                                    <td>{value.gender}</td>
                                    <td>{value.phoneNumber}</td>
                                    <td className='text-center'><Switch checked={value.locked} onChange={() => handleUpdateStatus(value.id, !value.locked)
                                    } /></td>
                                    <td className='text-center'>
                                        <Tooltip
                                            title="Xem chi tiết"
                                            variant="plain"
                                        >
                                            <IconButton color='warning' onClick={() => navigate(`/update-khach-hang/${value.id}`)}>
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </Sheet>
            {
                data?.totalPage > 1 && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                        <Stack spacing={2}>
                            <Pagination count={data?.totalPage} page={pageNo} onChange={handlePageChange} variant="outlined" shape="rounded" />
                        </Stack>
                    </Box>
                )
            }
        </Container >
    )
}   