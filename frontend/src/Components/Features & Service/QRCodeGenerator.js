import { useState } from "react";

const QRCodeGenerator = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState("");

  const generateQRCode = async () => {
    const response = await fetch("http://localhost:5000/api/v2/generate-qr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        upiId: "aniket9936279984@cnrb",  // Replace with the saved UPI ID from state
        amount: 1,              // Example fixed amount
      }),
    });

    const data = await response.json();
    if (data.qrCodeUrl) {
      setQrCodeUrl(data.qrCodeUrl);
    }
  };

  return (
    <div>
    <button className="px-4 py-2 bg-slate-500 text-white " onClick={generateQRCode}>Generate QR Code</button>
    {qrCodeUrl && <img src={qrCodeUrl} alt="UPI QR Code" />}
  </div>
  );
};

export default QRCodeGenerator;
