import authorizedAxiosInstance from "../utils/authorizedAxios";

export const createPaymentQR = async (requestData) => {
  try {
    console.log("Calling API with config:", {
      url: "http://localhost:8080/api/v1/payment/payos/qr",
      data: requestData,
    });
    const response = await authorizedAxiosInstance.post(
      "http://localhost:8080/api/v1/payment/payos/qr",
      requestData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("API response:", response.data);

    const paymentData = response.data.data;
    if (!paymentData.checkoutUrl || !paymentData.trangThai) {
      throw new Error("Invalid payment response from server: missing required fields");
    }

    paymentData.tienThanhToan = Number(paymentData.tienThanhToan).toFixed(2);
    return paymentData; // { id, idDatPhong, checkoutUrl, trangThai, tienThanhToan, ... }
  } catch (error) {
    console.error("Error in createPaymentQR:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi tạo link thanh toán");
  }
};

export const checkPaymentStatus = async (orderCode) => {
  try {
    console.log("Checking payment status for orderCode:", orderCode);
    const response = await authorizedAxiosInstance.get(
      `http://localhost:8080/api/v1/payment/payos/status/${orderCode}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Payment status response:", response.data);

    const status = response.data.data.trangThai; // Lấy trường trangThai
    const validStatus = ["PAID", "PENDING", "CANCELLED", "FAILED"];
    if (!validStatus.includes(status)) {
      throw new Error(`Invalid payment status: ${status}`);
    }

    return status; // Trả về "PAID", "PENDING", "CANCELLED", or "FAILED"
  } catch (error) {
    console.error("Error in checkPaymentStatus:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi kiểm tra trạng thái thanh toán");
  }
};

export const cancelPayment = async (orderCode) => {
  try {
    const response = await authorizedAxiosInstance.get(
      `http://localhost:8080/api/v1/payment/cancel?orderCode=${orderCode}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in cancelPayment:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Lỗi khi hủy thanh toán");
  }
};