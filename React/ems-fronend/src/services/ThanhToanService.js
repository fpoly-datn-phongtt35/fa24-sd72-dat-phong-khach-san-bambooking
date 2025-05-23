import authorizedAxiosInstance from "../utils/authorizedAxios";

const apiHoaDon = "http://localhost:8080/hoa-don";
const apiThanhToan = "http://localhost:8080/thanh-toan"

export const getHoaDonById = (idHoaDon) => {
    return authorizedAxiosInstance.get(`${apiHoaDon}/${idHoaDon}`);
};

export const createThanhToan = (data) => {
    return authorizedAxiosInstance.post(`${apiThanhToan}`, data, {
        headers: {
            'Content-Type': 'application/json',
        },
    });
};

export const updateThanhToan = async (id, data) => {
    try {
        const response = await authorizedAxiosInstance.put(`${apiThanhToan}?id=${id}`, data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi cập nhật Thanh Toán:", error.response?.data || error.message);
        throw error;
    }
};

