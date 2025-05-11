import authorizedAxiosInstance from "../utils/authorizedAxios";

// export const createPaymentQR = async (requestData) => {
//     try {
//       const response = await authorizedAxiosInstance.post('http://localhost:8080/api/v1/payment/payos/qr', requestData, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });
//       return response.data.data; // Trả về DatCocThanhToanResponse
//     } catch (error) {
//       throw new Error(error.response?.data?.message || 'Lỗi khi tạo QR thanh toán');
//     }
//   };

export const createPaymentQR = async (requestData) => {
    try {
      console.log("Calling API with config:", {
        url: 'http://localhost:8080/api/v1/payment/payos/qr',
        data: requestData,
      });
      const response = await authorizedAxiosInstance.post('http://localhost:8080/api/v1/payment/payos/qr', requestData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log("API response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error in createPaymentQR:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Lỗi khi tạo QR thanh toán');
    }
  };