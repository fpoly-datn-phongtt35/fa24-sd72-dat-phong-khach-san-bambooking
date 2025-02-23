import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

const QRScannerManual = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [qrCodeData, setQrCodeData] = useState('');

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Yêu cầu truy cập camera
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        video.srcObject = stream;
        video.setAttribute('playsinline', true); // Cần cho iOS
        video.play();
        requestAnimationFrame(tick);
      })
      .catch((err) => {
        console.error('Không thể truy cập camera:', err);
      });

    // Hàm xử lý từng khung hình
    const tick = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height, {
          inversionAttempts: 'dontInvert',
        });
        if (code) {
          setQrCodeData(code.data);
          console.log('QR Code được quét:', code.data);
        }
      }
      requestAnimationFrame(tick);
    };
  }, []);

  return (
    <div>
      <h2>QR Code Scanner (Manual)</h2>
      {/* Phần tử video hiển thị luồng camera */}
      <video ref={videoRef} style={{ width: '100%' }} />
      {/* Canvas dùng để xử lý ảnh (ẩn đi) */}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <p>Kết quả: {qrCodeData}</p>
    </div>
  );
};

export default QRScannerManual;
