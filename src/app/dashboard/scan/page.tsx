"use client";

import React, { useState } from "react";
import { Upload, Scan, CheckCircle2, ShoppingBag, Zap, Droplet, ShieldCheck, AlertCircle } from "lucide-react";

interface ParsedItem {
  name: string;
  category: string;
  price?: number | string;
  carbonScore?: "LOW" | "MEDIUM" | "HIGH";
}

interface ExtractedMetrics {
  kwh?: number;
  liters?: number;
  litres?: number;
  co2Emitted?: number;
  co2Saved?: number;
  plasticAvoided?: number;
}

interface OcrResponse {
  success: boolean;
  documentType?: string;
  type?: string;
  merchantOrIssuer?: string;
  merchant?: string;
  billingAmount?: number;
  totalAmount?: number;
  currency?: string;
  extractedData?: Record<string, any>;
  extractedMetrics?: ExtractedMetrics;
  itemsParsed?: ParsedItem[];
  recyclingCategory?: string;
  instructions?: string;
  sustainability?: Record<string, any>;
  recommendations?: string[];
  confidence?: number;
  message?: string;
}

export default function ScanPage() {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<OcrResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanRealFile = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Maximum supported size is 10 MB.");
      return;
    }

    const lowerName = file.name.toLowerCase();
    const validExts = [".jpg", ".jpeg", ".png", ".pdf"];
    const isValidExt = validExts.some(ext => lowerName.endsWith(ext)) || file.type.includes("image") || file.type.includes("pdf");

    if (!isValidExt) {
      setError("Unsupported file type. Please upload a JPG, PNG, or PDF.");
      return;
    }

    setIsScanning(true);
    setScanResult(null);
    setError(null);
    setSelectedFile(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("http://localhost:8080/api/scan", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || `Server returned HTTP ${res.status}`);
      }

      const data: OcrResponse = await res.json();
      setScanResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to reach Spring Boot AI OCR backend.");
    } finally {
      setIsScanning(false);
    }
  };

  const simulatePresetScan = async (presetType: string, fileName: string) => {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 400;
      canvas.height = 200;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = "#111827";
        ctx.fillRect(0, 0, 400, 200);
        ctx.fillStyle = "#10b981";
        ctx.font = "bold 16px sans-serif";
        ctx.fillText(`${presetType.toUpperCase()} STATEMENT`, 20, 40);
        ctx.fillStyle = "#ffffff";
        ctx.font = "12px sans-serif";
        if (presetType === "electricity") {
          ctx.fillText("Issuer: City Power Grid Ltd", 20, 80);
          ctx.fillText("Units Consumed: 420 kWh", 20, 110);
          ctx.fillText("Total Billing Amount: $145.50", 20, 140);
        } else if (presetType === "water") {
          ctx.fillText("Issuer: Municipal Water Works", 20, 80);
          ctx.fillText("Volume Consumed: 12400 Liters", 20, 110);
          ctx.fillText("Total Billing Amount: $62.40", 20, 140);
        } else if (presetType === "grocery") {
          ctx.fillText("Store: Organic Foods Market", 20, 80);
          ctx.fillText("Purchased: Organic Tomatoes, Ribeye Steak, Oat Milk", 20, 110);
          ctx.fillText("Total Amount Paid: $54.20", 20, 140);
        } else {
          ctx.fillText("Material: PET Plastic Packaging (Code 1)", 20, 80);
          ctx.fillText("Item: Polyethylene Terephthalate Beverage Bottle", 20, 110);
          ctx.fillText("Disposal: Blue Recycling Bin", 20, 140);
        }
      }

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], fileName, { type: "image/png" });
          scanRealFile(file);
        }
      }, "image/png");
    } catch (err) {
      setError("Failed to process preset document.");
    }
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl tracking-tight">AI Receipt & Bill Scan</h1>
        <p className="text-neutral-400 text-sm">Upload utility bills, shopping invoices, or item photos to extract sustainability statistics.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Terminal */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-1 space-y-6">
          <h3 className="font-bold text-lg">OCR Document Reader</h3>
          
          <div 
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files?.[0];
              if (file) scanRealFile(file);
            }}
            className="border border-dashed border-white/10 rounded-xl p-8 text-center flex flex-col items-center justify-center bg-black/20 hover:border-emerald-500/30 transition-colors"
          >
            <Upload className="w-10 h-10 text-neutral-500 mb-4" />
            <span className="text-sm font-semibold mb-1">Drag and drop file here</span>
            <span className="text-xs text-neutral-500 mb-4">PDF, JPG, PNG up to 10MB</span>
            <input 
              type="file" 
              accept=".jpg,.jpeg,.png,.pdf"
              className="hidden" 
              id="file-upload" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) scanRealFile(file);
              }}
            />
            <label 
              htmlFor="file-upload" 
              className="px-4 py-2 bg-white/5 border border-white/10 hover:bg-white/10 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
            >
              Browse Files
            </label>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Simulate Upload Presets</span>
            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={() => simulatePresetScan("grocery", "grocery_receipt.png")}
                className="p-3 text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all text-xs flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400" /> Grocery Receipt
              </button>
              <button 
                onClick={() => simulatePresetScan("electricity", "electricity_bill_july.pdf")}
                className="p-3 text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all text-xs flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-yellow-400" /> Electric Bill
              </button>
              <button 
                onClick={() => simulatePresetScan("water", "water_utility_bill.pdf")}
                className="p-3 text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all text-xs flex items-center gap-2"
              >
                <Droplet className="w-4 h-4 text-sky-400" /> Water Invoice
              </button>
              <button 
                onClick={() => simulatePresetScan("plastic", "recycling_photo.jpg")}
                className="p-3 text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all text-xs flex items-center gap-2"
              >
                <Scan className="w-4 h-4 text-violet-400" /> Plastic Bottle
              </button>
            </div>
          </div>
        </div>

        {/* Processing Panel */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-2 space-y-6">
          <div className="flex justify-between items-center pb-4 border-b border-white/5">
            <h3 className="font-bold text-lg">Extraction Results</h3>
            {scanResult && scanResult.success && (
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Authenticated via Gemini AI OCR
              </span>
            )}
          </div>

          {isScanning && (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
              <Scan className="w-12 h-12 text-emerald-400 animate-spin" />
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Analyzing {selectedFile} via Gemini AI...</span>
                <span className="text-xs text-neutral-500">Extracting line items and calculating carbon load</span>
              </div>
            </div>
          )}

          {!isScanning && !scanResult && (
            <div className="py-20 text-center text-neutral-500 text-sm flex flex-col items-center justify-center">
              <Scan className="w-10 h-10 mb-2 opacity-35" />
              <span>No document scanned yet. Select an upload preset or upload a file.</span>
            </div>
          )}

          {/* Results Display */}
          {!isScanning && scanResult && (
            <div className="space-y-6">
              {/* Metric highlights */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                  <span className="text-[10px] uppercase font-bold text-neutral-500">Document Type</span>
                  <p className="text-base font-bold mt-1 text-white">{scanResult.documentType || scanResult.type || "N/A"}</p>
                </div>
                {(scanResult.merchantOrIssuer || scanResult.merchant) && (
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-neutral-500">Merchant/Issuer</span>
                    <p className="text-base font-bold mt-1 text-white">{scanResult.merchantOrIssuer || scanResult.merchant}</p>
                  </div>
                )}
                {(scanResult.billingAmount !== undefined || scanResult.totalAmount !== undefined) && (
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-neutral-500">Billing Amount</span>
                    <p className="text-base font-bold mt-1 text-yellow-400">
                      {scanResult.currency ? scanResult.currency + " " : "$"}
                      {scanResult.billingAmount ?? scanResult.totalAmount}
                    </p>
                  </div>
                )}
              </div>

              {/* Extracted Metrics */}
              {scanResult.extractedMetrics && (
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-emerald-400">Carbon & Resource Summary</span>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    {scanResult.extractedMetrics.kwh !== undefined && scanResult.extractedMetrics.kwh !== null && (
                      <div>Power Consumed: <span className="font-semibold text-white">{scanResult.extractedMetrics.kwh} kWh</span></div>
                    )}
                    {(scanResult.extractedMetrics.liters !== undefined || scanResult.extractedMetrics.litres !== undefined) && (scanResult.extractedMetrics.liters ?? scanResult.extractedMetrics.litres) !== null && (
                      <div>Water Consumed: <span className="font-semibold text-white">{scanResult.extractedMetrics.liters ?? scanResult.extractedMetrics.litres} Liters</span></div>
                    )}
                    {scanResult.extractedMetrics.co2Emitted !== undefined && scanResult.extractedMetrics.co2Emitted !== null && (
                      <div>CO₂ Footprint: <span className="font-semibold text-red-400">{scanResult.extractedMetrics.co2Emitted} kg</span></div>
                    )}
                    {scanResult.extractedMetrics.co2Saved !== undefined && scanResult.extractedMetrics.co2Saved !== null && (
                      <div>CO₂ Diverted: <span className="font-semibold text-emerald-400">+{scanResult.extractedMetrics.co2Saved} kg</span></div>
                    )}
                  </div>
                </div>
              )}

              {/* Parsed Items Table */}
              {scanResult.itemsParsed && scanResult.itemsParsed.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-neutral-400">Line Item Product Classification</span>
                  <div className="border border-white/5 rounded-xl overflow-hidden text-xs">
                    <table className="w-full text-left">
                      <thead className="bg-white/5 font-semibold">
                        <tr>
                          <th className="p-3">Product Name</th>
                          <th className="p-3">Category</th>
                          <th className="p-3 text-right">Price</th>
                          <th className="p-3 text-center">Carbon Load</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {scanResult.itemsParsed.map((item: ParsedItem, idx: number) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="p-3 font-medium text-white">{item.name}</td>
                            <td className="p-3 text-neutral-400">{item.category}</td>
                            <td className="p-3 text-right">
                              {item.price !== undefined && item.price !== null
                                ? (typeof item.price === "number" ? `$${item.price.toFixed(2)}` : item.price)
                                : "N/A"}
                            </td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.carbonScore === "HIGH" 
                                  ? "bg-red-500/10 text-red-400" 
                                  : "bg-emerald-500/10 text-emerald-400"
                              }`}>
                                {item.carbonScore || "LOW"}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Recycling specifications */}
              {scanResult.recyclingCategory && (
                <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-xs space-y-2">
                  <div>Recycling Material: <span className="font-semibold text-white">{scanResult.recyclingCategory}</span></div>
                  {scanResult.instructions && (
                    <div>Instructions: <span className="text-neutral-400">{scanResult.instructions}</span></div>
                  )}
                </div>
              )}

              {/* AI Alternatives & Action Items */}
              {scanResult.recommendations && scanResult.recommendations.length > 0 && (
                <div className="space-y-3">
                  <span className="text-xs font-bold text-neutral-400">AI Coaching Alternatives</span>
                  <div className="space-y-2">
                    {scanResult.recommendations.map((rec: string, idx: number) => (
                      <div key={idx} className="flex gap-2.5 items-start p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-neutral-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
