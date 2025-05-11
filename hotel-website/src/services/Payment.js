import authorizedAxiosInstance from "../utils/authorizedAxios";

export const createPaymentQR = async (requestData) => {
    try {
      const response = await authorizedAxiosInstance.post('http://your-backend-url/api/v1/payment/payos/qr', requestData, {
        headers: {
          'Content-Type': 'application/json',
          // Nếu cần xác thực: 'Authorization': `Bearer ${token}`
        },
      });
      return response.data.data; // Trả về DatCocThanhToanResponse
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Lỗi khi tạo QR thanh toán');
    }
  };