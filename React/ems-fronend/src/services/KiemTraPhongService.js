import authorizedAxiosInstance from "../utils/authorizedAxios";

const apiKiemTraPhong = "http://localhost:8080/kiem-tra-phong";
const apiTimKiemXepPhong = "http://localhost:8080/kiem-tra-phong/tim-kiem-xep-phong";

export const findXepPhong = (key) => {
    return authorizedAxiosInstance.get(apiTimKiemXepPhong, {
        params: { key: key }
    });
};

export const hienThiVatTu = (idXepPhong) => {
    return authorizedAxiosInstance.get(`http://localhost:8080/kiem-tra-phong/vat-tu/${idXepPhong}`);
};

export const getAllNhanVien = async () => {
    try {
        const response = await authorizedAxiosInstance.get(
            "http://localhost:8080/kiem-tra-phong/get-all-nhan-vien"
        );
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách nhân viên:", error);
        throw error;
    }
};

export const getListRoomByCondition = async () => {
    try {
        const response = await authorizedAxiosInstance.get(`${apiKiemTraPhong}/get-list-room-by-condition`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy danh sách phòng cần kiểm tra:", error);
        throw error;
    }
};


export const performRoomCheck = async (request) => {
    try {
        const response = await authorizedAxiosInstance.post(`${apiKiemTraPhong}/kiem-tra`, request);
        return response.data;
    } catch (error) {
        console.error("Lỗi: ", error);
        throw error;
    }
};