import axios from "axios";

const apiImage = 'http://localhost:8080/image/list';

export const listImage = (pageable) => {
    console.log(apiImage);
    
    return axios.get(apiImage, {
        params:{
            page: pageable.page,
            size: pageable.size
        }
    });
};