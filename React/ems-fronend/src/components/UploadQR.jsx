import React, { useState, useRef, useEffect } from "react";
import { BrowserQRCodeReader } from "@zxing/browser";

const UploadQR = ({ setQRData }) => {
  const [qrResult, setQrResult] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const imgRef = useRef(null);
  const canvasRef = useRef(null);
  const codeReader = useRef(new BrowserQRCodeReader());

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImagePreview(imageURL);
    }
  };

  useEffect(() => {
    if (imagePreview && imgRef.current) {
      imgRef.current.onload = () => {
        setTimeout(async () => {  // ⚡ Thêm độ trễ để đảm bảo ảnh đã render xong
          try {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");

            // Đảm bảo modal đã render xong trước khi quét
            if (!canvas || !ctx || !imgRef.current) {
              console.error("Canvas hoặc imgRef chưa sẵn sàng.");
              return;
            }

            // Resize ảnh để tăng khả năng nhận diện
            const scaleFactor = 0.5;
            const newWidth = imgRef.current.width * scaleFactor;
            const newHeight = imgRef.current.height * scaleFactor;
            canvas.width = newWidth;
            canvas.height = newHeight;
            ctx.drawImage(imgRef.current, 0, 0, newWidth, newHeight);

            // Chuyển ảnh sang grayscale
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < imageData.data.length; i += 4) {
              const avg = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
              imageData.data[i] = avg; // Red
              imageData.data[i + 1] = avg; // Green
              imageData.data[i + 2] = avg; // Blue
            }
            ctx.putImageData(imageData, 0, 0);

            // ⚡ Thử quét trực tiếp từ ảnh thay vì canvas nếu quét thất bại
            let result;
            try {
              result = await codeReader.current.decodeFromCanvas(canvas);
            } catch (error) {
              console.warn("Quét từ canvas thất bại, thử quét từ ảnh...");
              result = await codeReader.current.decodeFromImageElement(imgRef.current);
            }

            setQrResult(result.getText());
            setQRData=(result.getText());
          } catch (error) {
            console.error("Không thể quét QR Code:", error);
            setQrResult("Không phát hiện QR Code. Hãy thử ảnh khác.");
            setQRData=("Không phát hiện QR Code. Hãy thử ảnh khác.");
          }
        }, 300); // 🕒 Độ trễ 300ms để đảm bảo modal render hoàn tất
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
