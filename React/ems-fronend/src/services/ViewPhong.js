import axios from "axios";

const apiViewPhong = 'http://localhost:8080/api/view-phong';

export const searchRooms = async (tinhTrang, giaMin, giaMax, keyword) => {
    try {
        const response = await axios.get(apiViewPhong, {
            params: {
                tinhTrang,
                giaMin,
                giaMax,
                keyword,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tìm kiếm phòng:", error);
        throw error;
    }
};
