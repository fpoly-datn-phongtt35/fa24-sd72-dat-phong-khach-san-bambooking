import { Box, Button, Container, Input, Sheet, Switch, Table, Tooltip, Typography } from '@mui/joy'
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { IconButton, Pagination, Stack } from '@mui/material';
import { useEffect, useState } from 'react';
import { fetchAllCustomer, updatStatus } from '../../apis/customerApi';
import { useNavigate } from 'react-router-dom';

export const Customer = () => {
    const [data, setData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        handleFetchData();
    }, []);

    const handleFetchData = async () => {
        await fetchAllCustomer().then(res => {
            setData(res?.data);

        })
    }

    const handleUpdateStatus = async (id, status) => {
        await updatStatus(id, status).then(() => {
            handleFetchData();
        })
    }

    return (
        <Container>
            <Typography level='h4'>Quản lý khách hàng</Typography>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '20px'
            }}>
                <Box className="col-9" style={{ display: 'flex', alignItems: 'center', marginBottom: 0, width: '50%' }}>
                    <Input placeholder='Tìm kiếm khách hàng' startDecorator={<SearchIcon />} sx={{ width: '400px' }} />
                </Box>
                <Box className="col-3 text-end">
                    <Button color='primary' startDecorator={<AddIcon />} onClick={() => navigate('/add-khach-hang')}>Thêm khách hàng</Button>
                </Box>
            </Box>
            <Sheet sx={{ marginTop: 3 }}>
                <Typography sx={{ marginBottom: 1 }} level='title-md'>Danh sách khách hàng</Typography>
                <Table
                    stickyHeader
                    stripe="odd"
                    variant="soft"
                    border='both'
                >
                    <thead>
                        <tr>
                            <th className='text-center'>Tên đăng nhập</th>
                            <th className='text-center'>Họ và tên</th>
                            <th className='text-center'>Giới tính</th>
                            <th className='text-center'>SĐT</th>
                            <th className='text-center'>Trạng thái</th>
                            <th className='text-center'>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data && data?.data.map((value) => (
                                <tr key={value.id}>
                                    <td className='text-center'>{value.username}</td>
                                    <td className='text-center'>{value.fullName}</td>
                                    <td className='text-center'>{value.gender}</td>
                                    <td className='text-center'>{value.phoneNumber}</td>
                                    <td className='text-center'><Switch checked={value.locked} onChange={() => handleUpdateStatus(value.id, !value.locked)
                                    } /></td>
                                    <td className='text-center'>
                                        <Tooltip
                                            title="Xem chi tiết"
                                            variant="plain"
                                        >
                                            <IconButton color='primary'>
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
            <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
                <Stack spacing={2}>
                    <Pagination count={data?.totalPage} variant="outlined" shape="rounded" />
                </Stack>
            </Box>
        </Container>
    )
}   