import { Box, Container, Input, Option, Select, Sheet, Switch, Table, Tooltip, Typography } from '@mui/joy'
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, Pagination, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import { fetchAllEmployee, updateStatus } from '../../apis/employeeApi';

export const Employee = () => {
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
        await fetchAllEmployee(param).then(res => {
            setData(res?.data);

        })
    }

    const handleUpdateStatus = async (id, status) => {
        await updateStatus(id, status).then(() => {
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

            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '20px'
            }}>
                <Typography level='h3'>Quản lý Nhân viên</Typography>
                <Typography
                    color="primary"
                    level="title-sm"
                    variant="plain"
                    startDecorator={<AddIcon />}
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate('/add-nhan-vien')}
                >
                    Thêm nhân viên
                </Typography>
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
                                            <IconButton color='warning' onClick={() => navigate(`/update-nhan-vien/${value.id}`)}>
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