import { Avatar, Box, Button, Container, FormControl, FormHelperText, FormLabel, Grid, Input, Radio, RadioGroup, Textarea, Typography } from "@mui/joy"
import SvgIcon from '@mui/joy/SvgIcon';
import { styled } from '@mui/joy';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { newEmployee } from "../../apis/employeeApi";
import { useState } from "react";
import Alert from '@mui/material/Alert';

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
export const NewEmployee = () => {
    const navigate = useNavigate();

    const [imagePreview, setImagePreview] = useState(null);
    const [imageObject, setImageObject] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleImageChange = (event) => {
        var file = event.target.files[0];
        var url = URL.createObjectURL(file)
        setImagePreview(url)
        setImageObject(file)
    }

    const onSubmit = async (data) => {
        const formData = new FormData();
        formData.append('username', data.username)
        formData.append('firstName', data.firstName)
        formData.append('lastName', data.lastName)
        formData.append('phoneNumber', data.phoneNumber)
        formData.append('address', data.address)
        formData.append('idCard', data.idCard)
        formData.append('gender', data.gender)
        formData.append('role', data.role)
        formData.append('password', data.password)
        formData.append('email', data.email)
        if (imageObject) {
            formData.append('avatar', imageObject);
        }
        setIsLoading(true);

        await newEmployee(formData)
            .then(() => {
                setShowSuccess(true);
                setTimeout(() => {
                    navigate('/nhan-vien');
                }, 2000);
            })
            .catch(error => {
                console.error('Lỗi khi thêm nhân viên:', error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };
    return (
        <Container>
            {showSuccess && (
                <Alert
                    color="success"
                    sx={{
                        position: 'fixed',
                        top: 20,
                        right: 20,
                        zIndex: 1000,
                        width: '300px'
                    }}
                >
                    Thêm nhân viên thành công!
                </Alert>
            )}
            <Box marginTop={3} component='form' onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid xs={3} sx={{ border: '0.5px solid #d9d9d9' }}>
                        <Box sx={{ marginTop: 5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Avatar sx={{ width: 150, height: 150 }} variant="soft" src={imagePreview} />
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
                                    <VisuallyHiddenInput type="file" onChange={handleImageChange} />
                                </Button>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid xs={9} sx={{ border: '0.1px solid #d9d9d9', padding: 2 }}>
                        <Typography level="h4" sx={{ marginBottom: 2 }}>Thêm nhân viên</Typography>
                        <Grid container spacing={2}>

                            <Grid container spacing={2} sx={{ width: '100%' }}>
                                <Grid xs={6}>
                                    <FormControl sx={{ width: '100%' }} error={!!errors?.username}>
                                        <FormLabel required>Tên tài khoản</FormLabel>
                                        <Input placeholder="Nhập tên tài khoản..." sx={{ width: '400px' }} {...register("username", { required: "Tên tài khoản không được để trống" })} />
                                        {errors.username && (
                                            <FormHelperText>{errors.username.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid xs={6}>
                                    <FormControl sx={{ width: '100%' }} error={!!errors?.password}>
                                        <FormLabel required >Mật khẩu</FormLabel>
                                        <Input type="password" placeholder="Nhập mật khẩu..." sx={{ width: '400px' }}  {...register("password", { required: "Mật khẩu không được để trống" })} />
                                        {errors.password && (
                                            <FormHelperText>{errors.password.message}</FormHelperText>
                                        )}
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
                                        <Input placeholder="Nhập tên..." sx={{ width: '400px' }}  {...register("firstName", { required: "Tên không được để trống" })} />
                                        {errors.firstName && (
                                            <FormHelperText>{errors.firstName.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>

                            <Grid container spacing={2}>
                                <Grid xs={6}>
                                    <FormControl sx={{ width: '100%' }} error={!!errors?.idCard}>
                                        <FormLabel required>Chứng minh nhân dân</FormLabel>
                                        <Input
                                            placeholder="Nhập số chứng minh nhân dân..."
                                            sx={{ width: '400px' }}
                                            {...register("idCard", {
                                                required: "Vui lòng nhập số CMND",
                                                pattern: {
                                                    value: /^\d{12}$/,
                                                    message: "CCCD phải là 12 số"
                                                }
                                            })}
                                        />
                                        {errors.idCard && (
                                            <FormHelperText>{errors.idCard.message}</FormHelperText>
                                        )}
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
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Radio
                                                    value="Nam"
                                                    slotProps={{ input: { "aria-label": "MALE" } }}
                                                    {...register("gender", {
                                                        required: "Giới tính không được để trống",
                                                    })}
                                                />
                                                <Typography>Nam</Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Radio
                                                    value="Nữ"
                                                    slotProps={{ input: { "aria-label": "FEMALE" } }}
                                                    {...register("gender", {
                                                        required: "Giới tính không được để trống",
                                                    })}
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
                                <Grid xs={12}>
                                    <FormControl sx={{ width: '100%' }} error={!!errors?.role}>
                                        <FormLabel required>Chức vụ</FormLabel>
                                        <RadioGroup
                                            name="role"
                                            aria-labelledby="role-group"
                                            sx={{
                                                display: "flex",
                                                flexDirection: "row",
                                                alignItems: "center",
                                                gap: 2,
                                            }}
                                        >
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Radio
                                                    value="1"
                                                    slotProps={{ input: { "aria-label": "Sysadmin" } }}
                                                    {...register("role", {
                                                        required: "Chức vụ không được để trống",
                                                    })}
                                                />
                                                <Typography>Quản lý</Typography>
                                            </Box>
                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                <Radio
                                                    value="2"
                                                    slotProps={{ input: { "aria-label": "Admin" } }}
                                                    {...register("role", {
                                                        required: "Chức vụ không được để trống",

                                                    })}
                                                />
                                                <Typography>Nhân viên</Typography>
                                            </Box>
                                        </RadioGroup>
                                        {errors.role && (
                                            <FormHelperText>{errors.role.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Grid container spacing={2}>
                                <Grid xs={6}>
                                    <FormControl sx={{ width: '100%' }} error={!!errors?.phoneNumber}>
                                        <FormLabel required>Số điện thoại</FormLabel>
                                        <Input
                                            placeholder="Nhập số điện thoại..."
                                            sx={{ width: '400px' }}
                                            {...register("phoneNumber", {
                                                required: "Vui lòng nhập số điện thoại",
                                                pattern: {
                                                    value: /^\d{10}$/,
                                                    message: "Số điện thoại phải là 10 chữ số"
                                                }
                                            })}
                                        />
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
                                <Button loading={isLoading} color="danger" sx={{ marginRight: 2 }} type="button" onClick={() => navigate('/NhanVien')}>Hủy</Button>
                                <Button loading={isLoading} type="submit">Lưu thông tin</Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        </Container >
    )
}