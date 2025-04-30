import authorizedAxiosInstance from '../utils/authorizedAxios';

const apigetTTDPbyidDatPhong = "http://localhost:8080/api/dp/findByidDatPhong"
const apigetTTDPbyidDPandidLP = "http://localhost:8080/api/dp/findByidDPandidLP"
const apigetXPbymaTTDP = "http://localhost:8080/api/ttdp/phong-da-xep"


const apigetTTDPbyidDatPhongTC = "http://localhost:8080/api/tra-cuu/dp/findByidDatPhong"
const apigetTTDPbyidDPandidLPTC = "http://localhost:8080/api/tra-cuu/dp/findByidDPandidLP"
const apigetXPbymaTTDPTC = "http://localhost:8080/api/tra-cuu/ttdp/phong-da-xep"

const apidsTTDPcothehuy = "http://localhost:8080/api/ttdp/TTDP-Co-The-Huy"

const apiHuyTTDP = "http://localhost:8080/api/ttdp/huy-ttdp2"
const apiGuiEmailXacNhanHuyTTDP = "http://localhost:8080/api/ttdp/email-xac-nhan-huy-ttdp"



export const getTTDPByidDatPhong = (idDatPhong) => {
    return authorizedAxiosInstance.get(apigetTTDPbyidDatPhong, {
        params: {
            idDatPhong: idDatPhong,
        }
    });
};

export const getTTDPbyidDPandidLP = (idDatPhong,idLoaiPhong) => {
    return authorizedAxiosInstance.get(apigetTTDPbyidDPandidLP, {
        params: {
            idDatPhong: idDatPhong,
            idLoaiPhong: idLoaiPhong,
        }
    });
};

export const getXPbymaTTDP = (maTTDP) => {
    return authorizedAxiosInstance.get(apigetXPbymaTTDP, {
        params: {
            maThongTinDatPhong: maTTDP,
        }
    });
};

////api không yc xác thực
export const getTTDPByidDatPhongTC = (idDatPhong) => {
    return authorizedAxiosInstance.get(apigetTTDPbyidDatPhongTC, {
        params: {
            idDatPhong: idDatPhong,
        }
    });
};

export const getTTDPbyidDPandidLPTC = (idDatPhong,idLoaiPhong) => {
    return authorizedAxiosInstance.get(apigetTTDPbyidDPandidLPTC, {
        params: {
            idDatPhong: idDatPhong,
            idLoaiPhong: idLoaiPhong,
        }
    });
};

export const getXPbymaTTDPTC = (maTTDP) => {
    return authorizedAxiosInstance.get(apigetXPbymaTTDPTC, {
        params: {
            maThongTinDatPhong: maTTDP,
        }
    });
};

export const TTDPcothehuy = (idDatPhong) => {
    return authorizedAxiosInstance.get(apidsTTDPcothehuy, {
        params: {
            idDatPhong: idDatPhong,
        }
    });
};

export const HuyTTDP = (idTTDP) => {
    return authorizedAxiosInstance.get(apiHuyTTDP, {
        params: {
            idTTDP: idTTDP,
        }
    });
};

export const GuiEmailXacNhanHuyTTDP = (idTTDP) => {
    return authorizedAxiosInstance.get(apiGuiEmailXacNhanHuyTTDP, {
        params: {
            idTTDP: idTTDP,
        }
    });
};

