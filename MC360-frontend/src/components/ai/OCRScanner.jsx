import { useState, useRef } from "react";

const OCRScanner = ({ onScanComplete }) => {
  const [preview, setPreview] = useState(null);
  const [scanning, setScanning] = useState(false);
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
  };

  const handleScan = () => {
    if (!preview) return;
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      if (onScanComplete) {
        onScanComplete([
          { name: "Paracetamol", dosage: "500mg", frequency: "TDS", duration: "5 days" },
          { name: "Amoxicillin", dosage: "250mg", frequency: "BD", duration: "7 days" },
        ]);
      }
    }, 2000);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md max-w-md space-y-4">
      <h2 className="text-xl font-bold text-blue-700">OCR Prescription Scanner</h2>
      <div
        onClick={() => fileRef.current.click()}
        className="border-2 border-dashed border-blue-300 rounded-xl p-6 text-center cursor-pointer hover:bg-blue-50 transition"
      >
        {preview ? (
          <img src={preview} alt="preview" className="mx-auto max-h-40 rounded-lg object-contain" />
        ) : (
          <p className="text-gray-400 text-sm">Click to upload prescription image</p>
        )}
      </div>
      <input ref={fileRef} type="file" accept="image/*,application/pdf" className="hidden" onChange={handleFile} />
      <button
        onClick={handleScan}
        disabled={!preview || scanning}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {scanning ? "Scanning..." : "Scan Prescription"}
      </button>
    </div>
  );
};

export default OCRScanner;