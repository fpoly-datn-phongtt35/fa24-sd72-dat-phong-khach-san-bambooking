import { Avatar, Box, Button, Container, FormControl, FormHelperText, FormLabel, Grid, Input, Radio, RadioGroup, Textarea, Typography } from "@mui/joy"
import SvgIcon from '@mui/joy/SvgIcon';
import { styled } from '@mui/joy';
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { getCustomerById, updateCustomer } from "../../apis/customerApi";
import { useEffect, useState } from "react";

const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;
export const DetailCustomer = () => {
    const [customer, setCustomer] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();

    const {
        register,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            gender: "Nam",
        },
    });

    useEffect(() => {
        getCustomer();
    }, []);

    useEffect(() => {
        if (customer) {
            reset({
                firstName: customer?.firstName || '',
                lastName: customer?.lastName || '',
                phoneNumber: customer?.phoneNumber || '',
                address: customer?.address || '',
                gender: customer?.gender || 'Nam',
                email: customer?.email || '',
            });
        }
    }, [customer, reset]);

    const getCustomer = async () => {
        await getCustomerById(id).then((res) => {
            setCustomer(res.data);
        })
    }

    const gender = watch("gender");

    const onSubmit = async (data) => {
        console.log(data);

        const formData = new FormData();
        formData.append('firstName', data.firstName)
        formData.append('lastName', data.lastName)
        formData.append('phoneNumber', data.phoneNumber)
        formData.append('address', data.address)
        formData.append('gender', data.gender)
        formData.append('email', data.email)

        await updateCustomer(formData, id).then(() => {
            navigate('/khach-hang')
        })
    };
    return (
        <Container>
            <Box marginTop={3} component='form' onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid xs={3} sx={{ border: '0.5px solid #d9d9d9' }}>
                        <Box sx={{ marginTop: 5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Avatar sx={{ width: 150, height: 150 }} variant="soft" />
                            </Box>
                            <Box sx={{ marginTop: 2, display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    component="label"
                                    role={undefined}
                                    tabIndex={-1}
                                    variant="outlined"
                                    color="neutral"
                                    startDecorator={
                                        <SvgIcon>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={1.5}
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                                                />
                                            </svg>
                                        </SvgIcon>
                                    }
                                >
                                    Upload a file
                                    <VisuallyHiddenInput type="file" />
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid xs={9} sx={{ border: '0.1px solid #d9d9d9', padding: 2 }}>
                        <Typography level="h4" sx={{ marginBottom: 2 }}>Chi tiết khách hàng</Typography>
                        <Grid container spacing={2}>

                            <Grid container spacing={2} sx={{ width: '100%' }}>
                                <Grid xs={6}>
                                    <FormControl sx={{ width: '100%' }}>
                                        <FormLabel required>Tên tài khoản</FormLabel>
                                        <Input placeholder="Nhập tên tài khoản..." sx={{ width: '400px' }} value={customer?.username || ''} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid xs={6}>
                                    <FormControl sx={{ width: '100%' }}>
                                        <FormLabel required >Mật khẩu</FormLabel>
                                        <Input type="password" placeholder="Nhập mật khẩu..." sx={{ width: '400px' }} value="cannot change" disabled />
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid xs={6}>
                                    <FormControl sx={{ width: '100%' }} error={!!errors?.lastName}>
                                        <FormLabel required>Họ</FormLabel>
                                        <Input placeholder="Nhập họ..." sx={{ width: '400px' }}  {...register("lastName", { required: "Họ không được để trống" })} />
                                        {errors.lastName && (
                                            <FormHelperText>{errors.lastName.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid xs={6}>
                                    <FormControl sx={{ width: '100%' }} error={!!errors?.firstName}>
                                        <FormLabel required>Tên</FormLabel>
                                        <Input placeholder="Nhập tên..." sx={{ width: '400px' }} {...register("firstName", { required: "Tên không được để trống" })} />
                                        {errors.firstName && (
                                            <FormHelperText>{errors.firstName.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid xs={6}>
                                    <FormControl sx={{ width: '100%' }} >
                                        <FormLabel required>Chứng minh nhân dân</FormLabel>
                                        <Input placeholder="Nhập số chứng minh nhân dân..." sx={{ width: '400px' }} value={customer?.idCard || ''} disabled />
                                    </FormControl>
                                </Grid>
                                <Grid xs={6}>
                                    <FormControl sx={{ width: '100%' }} error={!!errors?.gender}>
                                        <FormLabel required>Giới tính</FormLabel>
                                        <RadioGroup
                                            name="gender"
                                            aria-labelledby="gender-group"
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 2,
                                            }}
                                            value={gender}
                                            onChange={(e) => setValue("gender", e.target.value)}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Radio
                                                    value="Nam"
                                                    slotProps={{ input: { "aria-label": "Nam" } }}
                                                />
                                                <Typography>Nam</Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Radio
                                                    value="Nữ"
                                                    slotProps={{ input: { "aria-label": "Nữ" } }}
                                                />
                                                <Typography>Nữ</Typography>
                                            </Box>
                                        </RadioGroup>
                                        {errors.gender && (
                                            <FormHelperText>{errors.gender.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid xs={6}>
                                    <FormControl sx={{ width: '100%' }} error={!!errors?.phoneNumber}>
                                        <FormLabel required>Số điện thoại</FormLabel>
                                        <Input placeholder="Nhập số điện thoại..." sx={{ width: '400px' }} {...register("phoneNumber", { required: "Vui lòng nhập số điện thoại" })} />
                                        {errors.phoneNumber && (
                                            <FormHelperText>{errors.phoneNumber.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid xs={6}>
                                    <FormControl sx={{ width: '100%' }} error={!!errors?.email}>
                                        <FormLabel>Email</FormLabel>
                                        <Input placeholder="Nhập email..." sx={{ width: '400px' }}
                                            {...register('email', {
                                                required: false,
                                                pattern: {
                                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                    message: 'Định dạng email không hợp lệ.',
                                                },
                                            })}
                                        />
                                        {errors.email && (
                                            <FormHelperText>{errors.email.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid xs={12}>
                                    <FormControl error={!!errors?.address}>
                                        <FormLabel required>Địa chỉ</FormLabel>
                                        <Textarea
                                            minRows={3}
                                            maxRows={10}
                                            placeholder="Nhập địa chỉ..."
                                            sx={{ width: '820px' }}
                                            {...register("address", { required: "Vui lòng nhập số điện thoại" })}
                                        ></Textarea>
                                        {errors.address && (
                                            <FormHelperText>{errors.address.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Box sx={{ marginTop: 2 }}>
                                <Button color="danger" sx={{ marginRight: 2 }} type="button" onClick={() => navigate('/khach-hang')}>Hủy</Button>
                                <Button type="submit">Lưu thông tin</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Container >
    )
}