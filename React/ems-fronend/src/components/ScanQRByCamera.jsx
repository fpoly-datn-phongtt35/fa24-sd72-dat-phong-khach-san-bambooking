import React, { useState, useEffect, useRef } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";

const ScanQRByCamera = ({ setQRData }) => {
  const [qrResult, setQrResult] = useState("");
  const [devices, setDevices] = useState([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [lastQrData, setLastQrData] = useState(""); // Lưu trữ QR code trước đó để tránh lặp
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  // Lấy danh sách thiết bị camera và chọn camera chính (camera sau nếu có)
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        // Yêu cầu quyền truy cập camera
        await navigator.mediaDevices.getUserMedia({ video: true });

        // Khởi tạo codeReader
        codeReader.current = new BrowserQRCodeReader();
        console.log("Initialized codeReader:", codeReader.current);

        const videoInputDevices =
          await BrowserQRCodeReader.listVideoInputDevices();
        console.log("Available devices:", videoInputDevices);
        setDevices(videoInputDevices);

        if (videoInputDevices.length > 0) {
          // Ưu tiên chọn camera sau
          const backCamera = videoInputDevices.find(
            (device) =>
              device.label.toLowerCase().includes("back") ||
              device.label.toLowerCase().includes("rear")
          );
          setSelectedDeviceId(
            backCamera ? backCamera.deviceId : videoInputDevices[0].deviceId
          );
          console.log(
            "Selected device ID:",
            backCamera ? backCamera.deviceId : videoInputDevices[0].deviceId
          );
        } else {
          setErrorMessage("Không tìm thấy camera. Vui lòng kiểm tra thiết bị.");
          setQrResult("");
          setQRData = "";
        }
      } catch (error) {
        console.error("Không thể lấy danh sách thiết bị camera:", error);
        setErrorMessage(
          "Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập."
        );
        setQrResult("");
        setQRData = "";
      }
    };
    fetchDevices();
  }, [setQRData]);

  // Bắt đầu quét QR code
  const startScanning = async () => {
    if (!selectedDeviceId || !videoRef.current) {
      setErrorMessage("Chưa chọn camera hoặc video element không sẵn sàng.");
      setQrResult("");
      setQRData = "";
      console.error("Start scanning failed: No device or video element");
      return;
    }

    if (!codeReader.current) {
      setErrorMessage("Code reader chưa được khởi tạo.");
      setQrResult("");
      setQRData = "";
      console.error("Start scanning failed: Code reader not initialized");
      return;
    }

    setIsScanning(true);
    setQrResult("");
    setQRData = "";
    setErrorMessage("");
    setLastQrData(""); // Reset lastQrData
    console.log("Starting QR code scanning with device:", selectedDeviceId);

    // Kiểm tra luồng video
    videoRef.current.onloadedmetadata = () => {
      console.log("Video stream loaded:", videoRef.current.srcObject);
    };

    videoRef.current.onerror = () => {
      console.error("Video stream error:", videoRef.current.error);
    };

    try {
      console.log("Video element:", videoRef.current);

      // Dừng quét trước đó nếu có
      if (typeof codeReader.current.stop === "function") {
        codeReader.current.stop();
        console.log("Stopped previous scan");
      } else {
        console.warn("Phương thức stop không tồn tại, bỏ qua...");
      }

      // Bắt đầu quét từ thiết bị camera được chọn
      await codeReader.current.decodeFromVideoDevice(
        selectedDeviceId,
        videoRef.current,
        (result, error) => {
          if (result) {
            const qrData = result.getText();
            // Chỉ xử lý nếu QR code khác với lần trước
            if (qrData !== lastQrData) {
              console.log(
                `QR code detected at ${new Date().toISOString()}:`,
                qrData
              );
              setQrResult(qrData);
              setQRData = qrData;
              setLastQrData(qrData);
              console.log("Assigned setQRData:", setQRData);
            }
          }
          if (error) {
            console.warn("Scan error:", {
              message: error.message || error,
              name: error.name,
            });
          }
        }
      );
      console.log("decodeFromVideoDevice started");
    } catch (error) {
      console.error("Lỗi khi quét QR code từ camera:", error);
      setErrorMessage("Không thể quét QR code. Vui lòng thử lại.");
      setQrResult("");
      setQRData = "";
      stopScanning();
    }
  };

  // Dừng quét và giải phóng camera
  const stopScanning = () => {
    if (codeReader.current && typeof codeReader.current.stop === "function") {
      codeReader.current.stop();
      console.log("Scanning stopped");
    } else {
      console.warn("Phương thức stop không tồn tại, bỏ qua...");
    }
    setIsScanning(false);
    setQrResult("");
    setQRData = "";
    setLastQrData("");
    setErrorMessage("");
  };

  // Xử lý khi thay đổi thiết bị camera
  const handleDeviceChange = (event) => {
    setSelectedDeviceId(event.target.value);
    console.log("Selected new device:", event.target.value);
    if (isScanning) {
      stopScanning();
    }
  };

  // Dọn dẹp khi component unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Quét QR Code bằng Camera
      </Typography>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Chọn Camera</InputLabel>
        <Select
          value={selectedDeviceId}
          onChange={handleDeviceChange}
          label="Chọn Camera"
          disabled={isScanning || devices.length === 0}
        >
          {devices.map((device) => (
            <MenuItem key={device.deviceId} value={device.deviceId}>
              {device.label || `Camera ${device.deviceId}`}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={startScanning}
          disabled={!selectedDeviceId || isScanning}
          startIcon={isScanning ? <CircularProgress size={20} /> : null}
        >
          {isScanning ? "Đang quét..." : "Bắt đầu quét"}
        </Button>
        {isScanning && (
          <Button variant="outlined" color="secondary" onClick={stopScanning}>
            Dừng quét
          </Button>
        )}
      </Box>

      <Box
        sx={{
          maxWidth: "100%",
          border: "1px solid #ccc",
          borderRadius: "4px",
          overflow: "hidden",
          mb: 2,
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: "100%",
            height: "auto",
            display: isScanning ? "block" : "none",
          }}
        />
      </Box>

      <Typography variant="body1">
        <strong>Kết quả QR Code:</strong> {qrResult || "Chưa có kết quả"}
      </Typography>
    </Box>
  );
};

export default ScanQRByCamera;
