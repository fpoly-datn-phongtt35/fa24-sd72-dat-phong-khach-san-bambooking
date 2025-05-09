// import axios from "axios";
import authorizedAxiosInstance from "../utils/authorizedAxios";

const apiHoaDon = "http://localhost:8080/hoa-don";
const apiThanhToan = "http://localhost:8080/thanh-toan"
const apiThongKeDT = "http://localhost:8080/thanh-toan/thong-ke-dt"
const apiThongKeLP = "http://localhost:8080/thanh-toan/thong-ke-lp"
const apiThongKeDV = "http://localhost:8080/thanh-toan/thong-ke-dv"

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


export const changeStatusInvoice = (id) => {
    return authorizedAxiosInstance.put(`${apiHoaDon}/${id}/status`); //Front-end không chấp nhận method PATCH nếu chưa được cấu hình
};

export const getThongKeDT = () => {
    return authorizedAxiosInstance.get(apiThongKeDT);
};

export const getThongKeLP = () => {
    return authorizedAxiosInstance.get(apiThongKeLP);
};
export const getThongKeDV = () => {
    return authorizedAxiosInstance.get(apiThongKeDV);
};

