import authorizedAxiosInstance from "../utils/authorizedAxios";
const apiHoaDon = "http://localhost:8080/hoa-don"

export const listHoaDon = (pageable, trangThai = "", keyword = "") => {
    return authorizedAxiosInstance.get(apiHoaDon, {
        params: {
            page: pageable.page,
            size: pageable.size,
            trangThai: trangThai || undefined,
            keyword: keyword || undefined,
        },
    }).catch((error) => {
        console.error("Lỗi khi gọi API:", error);
        throw error;
    });
};


export const taoHoaDon = async (idTraPhong) => {
    try {
        const response = await authorizedAxiosInstance.post(
            `${apiHoaDon}/tao-hoa-don`,
            null, // Không gửi dữ liệu trong body
            { params: { idTraPhong } } // Gửi idTraPhong dưới dạng query parameter
        );
        console.log("Tạo hóa đơn thành công:", response.data);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo hóa đơn:", error.response?.data || "Không xác định", error.message);
        throw error;
    }
};
