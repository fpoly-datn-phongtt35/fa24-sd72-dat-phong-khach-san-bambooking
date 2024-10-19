import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Upload = () => {
    const [imageURLs, setImageURLs] = useState([]);

    useEffect(() => {
        const form = document.getElementById("demo");
        const file = document.getElementById("file");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            upload(file.files);
        });
    }, []); // Thêm mảng rỗng để tránh useEffect chạy lại nhiều lần

    const upload = async (files) => {
        const CLOUD_NAME = "djk6zvcy5";
        const PRESET_NAME = "DuAnTotNghiep";
        const FOLDER_NAME = "Phòng";
        const api = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
        const uploadPromises = [];

        // Lặp qua từng file và tạo các Promise để upload
        for (const file of files) {
            const formData = new FormData();
            formData.append("upload_preset", PRESET_NAME);
            formData.append("folder", FOLDER_NAME);
            formData.append("file", file);

            // Đẩy các promises vào mảng
            uploadPromises.push(
                axios.post(api, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                })
            );
        }

        // Đợi tất cả các requests hoàn thành và lấy kết quả
        try {
            const responses = await Promise.all(uploadPromises);
            const urls = responses.map(res => res.data.secure_url); // Lấy đường dẫn từ kết quả
            setImageURLs(urls); // Lưu các đường dẫn vào state
        } catch (error) {
            console.error("Lỗi khi upload ảnh:", error);
        }
    };

    return (
        <div>
            <form id='demo'>
                <div>
                    <label>Chọn ảnh</label>
                    <input type="file" multiple id="file" name="anh" />
                </div>
                {/* <div>
                    <button type="submit">Add</button>
                </div> */}
            </form>

            {/* Hiển thị các ảnh đã upload */}
            <div>
                {imageURLs.length > 0 && (
                    <div>
                        <h3>Ảnh đã upload:</h3>
                        <ul>
                            {imageURLs.map((url, index) => (
                                <li key={index}>
                                    <img src={url} alt={`Uploaded ${index}`} width="200" />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Upload;
