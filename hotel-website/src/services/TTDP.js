import authorizedAxiosInstance from '../utils/authorizedAxios';

const apigetTTDPbyidDatPhong = "http://localhost:8080/api/dp/findByidDatPhong"

export const getTTDPByidDatPhong = (idDatPhong) => {
    return authorizedAxiosInstance.get(apigetTTDPbyidDatPhong, {
        params: {
            idDatPhong: idDatPhong,
        }
    });
};

