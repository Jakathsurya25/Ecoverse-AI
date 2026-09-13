export interface OCRScanResult {
  success: boolean;
  type: "RECEIPT" | "ELECTRICITY" | "WATER" | "RECYCLING" | "UNKNOWN";
  merchant?: string;
  totalAmount?: number;
  extractedMetrics?: {
    kwh?: number;
    liters?: number;
    co2Saved?: number;
    co2Emitted?: number;
    plasticAvoided?: number;
  };
  itemsParsed?: Array<{ name: string; category: string; carbonScore: "LOW" | "MEDIUM" | "HIGH"; price: number }>;
  recyclingCategory?: string;
  instructions?: string;
  recommendations: string[];
}

export class OCRService {
  static async scanFile(fileBuffer: any, fileName: string): Promise<OCRScanResult> {
    // In production, uses Tesseract.js / AWS Textract / Cloud Vision API
    const lowerName = fileName.toLowerCase();

    if (lowerName.includes("electricity") || lowerName.includes("bill") || lowerName.includes("utility")) {
      return {
        success: true,
        type: "ELECTRICITY",
        merchant: "City Power Grid Ltd",
        totalAmount: 145.50,
        extractedMetrics: {
          kwh: 420,
          co2Emitted: 168.0, // 0.4kg per kWh avg
        },
        recommendations: [
          "Unplug idle electronics. Standby power accounts for 5-10% of utility bills.",
          "Shift heavy energy usage (laundry, dishwashing) to off-peak hours (after 8 PM)."
        ]
      };
    }

    if (lowerName.includes("water") || lowerName.includes("hydro")) {
      return {
        success: true,
        type: "WATER",
        merchant: "Municipal Water Works",
        totalAmount: 62.40,
        extractedMetrics: {
          liters: 12400,
          co2Emitted: 3.7, // Water processing footprint
        },
        recommendations: [
          "Check faucets for silent leaks. A leaking tap wastes up to 15 liters of water a day.",
          "Consider installing a low-flow aerator on shower heads."
        ]
      };
    }

    if (lowerName.includes("receipt") || lowerName.includes("grocery") || lowerName.includes("invoice") || lowerName.includes("shop")) {
      return {
        success: true,
        type: "RECEIPT",
        merchant: "Organic Foods Market",
        totalAmount: 54.20,
        extractedMetrics: {
          co2Emitted: 8.4,
          plasticAvoided: 1.2
        },
        itemsParsed: [
          { name: "Organic Tomatoes (Local)", category: "FOOD", carbonScore: "LOW", price: 4.50 },
          { name: "Imported Ribeye Steak", category: "FOOD", carbonScore: "HIGH", price: 24.00 },
          { name: "Single-use Water Bottles 6-Pack", category: "SHOPPING", carbonScore: "HIGH", price: 3.99 },
          { name: "Eco Dishwashing Liquid", category: "SHOPPING", carbonScore: "LOW", price: 6.50 },
          { name: "Oat Milk 1L", category: "FOOD", carbonScore: "LOW", price: 4.20 }
        ],
        recommendations: [
          "Swap Imported Ribeye Steak for local chicken or plant protein to slash emissions by 85%.",
          "Ditch bottled water. Invest in a tap filter and reusable thermos to prevent plastic waste."
        ]
      };
    }

    if (lowerName.includes("recycling") || lowerName.includes("photo") || lowerName.includes("waste") || lowerName.includes("bottle")) {
      return {
        success: true,
        type: "RECYCLING",
        recyclingCategory: "PET Plastic (Code 1)",
        instructions: "Rinse container, crush, and place in the Blue Recycling Bin.",
        extractedMetrics: {
          co2Saved: 0.15,
          plasticAvoided: 0.05
        },
        recommendations: [
          "Make sure plastic caps are screwed on tight or recycled appropriately as per municipal rules.",
          "Consider purchasing aluminum canned alternatives where possible, as metal has a 75% higher recycle rate."
        ]
      };
    }

    return {
      success: false,
      type: "UNKNOWN",
      recommendations: ["Unable to auto-detect file type. Please upload a clear receipt, utility bill or waste photograph."]
    };
  }
}
