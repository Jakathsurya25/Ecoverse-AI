"use client";

import React, { useState } from "react";
import { Upload, Scan, CheckCircle2, AlertCircle, ShoppingBag, Zap, Droplet, ArrowRight, ShieldCheck } from "lucide-react";
import { OCRService, OCRScanResult } from "@/services/ocr";

export default function ScanPage() {
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<OCRScanResult | null>(null);

  const simulateScan = (fileName: string) => {
    setIsScanning(true);
    setScanResult(null);
    setSelectedFile(fileName);

    setTimeout(async () => {
      const result = await OCRService.scanFile(null, fileName);
      setScanResult(result);
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header */}
      <div>
        <h1 className="font-display font-bold text-3xl tracking-tight">AI Receipt & Bill Scan</h1>
        <p className="text-neutral-400 text-sm">Upload utility bills, shopping invoices, or item photos to extract sustainability statistics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upload Terminal */}
        <div className="glass-panel p-6 rounded-2xl lg:col-span-1 space-y-6">
          <h3 className="font-bold text-lg">OCR Document Reader</h3>
          
          <div className="border border-dashed border-white/10 rounded-xl p-8 text-center flex flex-col items-center justify-center bg-black/20 hover:border-emerald-500/30 transition-colors">
            <Upload className="w-10 h-10 text-neutral-500 mb-4" />
            <span className="text-sm font-semibold mb-1">Drag and drop file here</span>
            <span className="text-xs text-neutral-500 mb-4">PDF, JPG, PNG up to 10MB</span>
            <input 
              type="file" 
              className="hidden" 
              id="file-upload" 
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) simulateScan(file.name);
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
                onClick={() => simulateScan("grocery_receipt.png")}
                className="p-3 text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all text-xs flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-emerald-400" /> Grocery Receipt
              </button>
              <button 
                onClick={() => simulateScan("electricity_bill_july.pdf")}
                className="p-3 text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all text-xs flex items-center gap-2"
              >
                <Zap className="w-4 h-4 text-yellow-400" /> Electric Bill
              </button>
              <button 
                onClick={() => simulateScan("water_utility_bill.pdf")}
                className="p-3 text-left bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all text-xs flex items-center gap-2"
              >
                <Droplet className="w-4 h-4 text-sky-400" /> Water Invoice
              </button>
              <button 
                onClick={() => simulateScan("recycling_photo.jpg")}
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
            {scanResult && (
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Authenticated via OCR
              </span>
            )}
          </div>

          {isScanning && (
            <div className="py-20 text-center flex flex-col items-center justify-center space-y-4">
              <Scan className="w-12 h-12 text-emerald-400 animate-spin" />
              <div className="flex flex-col">
                <span className="font-semibold text-sm">Processing {selectedFile}...</span>
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
                  <p className="text-base font-bold mt-1 text-white">{scanResult.type}</p>
                </div>
                {scanResult.merchant && (
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-neutral-500">Merchant/Issuer</span>
                    <p className="text-base font-bold mt-1 text-white">{scanResult.merchant}</p>
                  </div>
                )}
                {scanResult.totalAmount !== undefined && (
                  <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                    <span className="text-[10px] uppercase font-bold text-neutral-500">Billing Amount</span>
                    <p className="text-base font-bold mt-1 text-yellow-400">${scanResult.totalAmount}</p>
                  </div>
                )}
              </div>

              {/* Extracted Metrics */}
              {scanResult.extractedMetrics && (
                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl space-y-2">
                  <span className="text-xs font-bold text-emerald-400">Carbon & Resource Summary</span>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    {scanResult.extractedMetrics.kwh !== undefined && (
                      <div>Power Consumed: <span className="font-semibold text-white">{scanResult.extractedMetrics.kwh} kWh</span></div>
                    )}
                    {scanResult.extractedMetrics.liters !== undefined && (
                      <div>Water Consumed: <span className="font-semibold text-white">{scanResult.extractedMetrics.liters} Liters</span></div>
                    )}
                    {scanResult.extractedMetrics.co2Emitted !== undefined && (
                      <div>CO₂ Footprint: <span className="font-semibold text-red-400">{scanResult.extractedMetrics.co2Emitted} kg</span></div>
                    )}
                    {scanResult.extractedMetrics.co2Saved !== undefined && (
                      <div>CO₂ Diverted: <span className="font-semibold text-emerald-400">+{scanResult.extractedMetrics.co2Saved} kg</span></div>
                    )}
                  </div>
                </div>
              )}

              {/* Parsed Items Table */}
              {scanResult.itemsParsed && (
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
                        {scanResult.itemsParsed.map((item, idx) => (
                          <tr key={idx} className="hover:bg-white/5">
                            <td className="p-3 font-medium text-white">{item.name}</td>
                            <td className="p-3 text-neutral-400">{item.category}</td>
                            <td className="p-3 text-right">${item.price.toFixed(2)}</td>
                            <td className="p-3 text-center">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                item.carbonScore === "HIGH" 
                                  ? "bg-red-500/10 text-red-400" 
                                  : "bg-emerald-500/10 text-emerald-400"
                              }`}>
                                {item.carbonScore}
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
                  <div>Instructions: <span className="text-neutral-400">{scanResult.instructions}</span></div>
                </div>
              )}

              {/* AI Alternatives & Action Items */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-neutral-400">AI Coaching Alternatives</span>
                <div className="space-y-2">
                  {scanResult.recommendations.map((rec, idx) => (
                    <div key={idx} className="flex gap-2.5 items-start p-3 bg-white/5 border border-white/5 rounded-xl text-xs text-neutral-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
