import React, { useState, useRef, useEffect } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";

const UploadQR = ({ setQRData }) => {
  const [qrResult, setQrResult] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImagePreview(imageURL);
    }
  };

  useEffect(() => {
    if (imagePreview && imgRef.current) {
      imgRef.current.onload = async () => {
        try {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");

          // **Giảm kích thước ảnh xuống 50% để dễ quét hơn**
          const scaleFactor = 0.5; // Điều chỉnh nếu cần
          const newWidth = imgRef.current.width * scaleFactor;
          const newHeight = imgRef.current.height * scaleFactor;

          canvas.width = newWidth;
          canvas.height = newHeight;
          ctx.drawImage(imgRef.current, 0, 0, newWidth, newHeight);

          // Quét QR Code từ canvas (ảnh đã giảm kích thước)
          const codeReader = new BrowserQRCodeReader();
          const result = await codeReader.decodeFromCanvas(canvas);

          setQrResult(result.getText());
          setQRData=result.getText(); 
        } catch (error) {
          console.error("Không thể quét QR Code:", error);
          setQrResult("Không phát hiện QR Code. Hãy thử ảnh khác.");
          setQRData=("Không phát hiện QR Code. Hãy thử ảnh khác.")
        }
      };
    }
  }, [imagePreview]);

  return (
    <div>
      <h2>Tải lên ảnh chứa QR Code</h2>
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {imagePreview && (
        <div style={{ marginTop: "10px" }}>
          <img ref={imgRef} src={imagePreview} alt="Xem trước ảnh" style={{ maxWidth: "100%", height: "auto" }} />
          <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </div>
      )}

      <p><strong>Kết quả QR Code:</strong> {qrResult}</p>
    </div>
  );
};

export default UploadQR;
