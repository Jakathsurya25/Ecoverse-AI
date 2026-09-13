export interface AISuggestion {
  id: string;
  category: "ENERGY" | "FOOD" | "WASTE" | "TRANSPORT" | "SHOPPING";
  title: string;
  description: string;
  potentialSavingsCo2: number; // kg
  estimatedSavingsCost: number; // USD
  difficulty: "Easy" | "Medium" | "Hard";
}

export interface ChatMessage {
  sender: "USER" | "AI";
  message: string;
  timestamp: string;
}

export class AISustainabilityEngine {
  static async analyzeSpending(items: any[]): Promise<any> {
    // In production, calls OpenAI API to analyze item carbon intensity, plastic content, etc.
    const analyzedItems = items.map(item => {
      const isHighCarbon = item.price > 15 || item.name.toLowerCase().includes("beef") || item.name.toLowerCase().includes("imported");
      const plasticContent = item.name.toLowerCase().includes("bottle") || item.name.toLowerCase().includes("packaged") ? "HIGH" : "LOW";
      return {
        ...item,
        carbonFootprint: isHighCarbon ? (item.price * 0.4) : (item.price * 0.1),
        plasticRisk: plasticContent,
        alternative: isHighCarbon ? `Eco-friendly alternative to ${item.name}` : null
      };
    });

    const totalEmissions = analyzedItems.reduce((acc, curr) => acc + curr.carbonFootprint, 0);
    return {
      items: analyzedItems,
      totalEmissions: Math.round(totalEmissions * 10) / 10,
      plasticItemsCount: analyzedItems.filter(item => item.plasticRisk === "HIGH").length,
      recommendation: totalEmissions > 10 
        ? "Consider buying locally-sourced food to reduce packaging and transportation emissions." 
        : "Excellent cart choices! You avoided major plastic packaging."
    };
  }

  static async predictFutureEmissions(currentMonthlyCo2: number, multiplier: number = 1.0): Promise<any> {
    const years = [1, 5, 10];
    const baseCo2 = currentMonthlyCo2 * 12;
    const baseWater = 150000; // liters per year per person avg
    const baseMoney = 2400; // energy & water bills

    return years.map(yr => {
      const trendFactor = 1.0 + (multiplier - 1.0) * (yr * 0.15); // compounding effect
      return {
        year: yr,
        emissions: Math.round(baseCo2 * yr * trendFactor),
        moneyWasted: Math.round(baseMoney * yr * trendFactor),
        treesLost: Math.round(15 * yr * trendFactor),
        waterWasted: Math.round(baseWater * yr * trendFactor)
      };
    });
  }

  static async generateDailyMissions(userId: string): Promise<any[]> {
    return [
      {
        id: "m-1",
        title: "Zero-Emission Commute",
        description: "Walk, bike, or use public transport for all travel today.",
        category: "TRANSPORT",
        targetValue: 5.0, // km
        coinsReward: 120,
        pointsReward: 50,
        difficulty: "Easy"
      },
      {
        id: "m-2",
        title: "Plant-Based Power",
        description: "Choose a fully vegetarian or vegan meal for lunch and dinner.",
        category: "FOOD",
        targetValue: 2.0, // meals
        coinsReward: 150,
        pointsReward: 60,
        difficulty: "Medium"
      },
      {
        id: "m-3",
        title: "Phantom Load Patrol",
        description: "Unplug 5 unused electronics to prevent stand-by power draw.",
        category: "ENERGY",
        targetValue: 5.0, // devices
        coinsReward: 80,
        pointsReward: 30,
        difficulty: "Easy"
      }
    ];
  }

  static async getAIRecommendations(userId: string): Promise<AISuggestion[]> {
    return [
      {
        id: "rec-1",
        category: "ENERGY",
        title: "Switch to Smart Thermostat",
        description: "Optimize heating and cooling settings automatically. Save up to 10% on energy bills.",
        potentialSavingsCo2: 320,
        estimatedSavingsCost: 180,
        difficulty: "Easy"
      },
      {
        id: "rec-2",
        category: "FOOD",
        title: "Incorporate 'Meatless Mondays'",
        description: "Substituting beef or poultry with legumes once a week cuts food emissions by 15%.",
        potentialSavingsCo2: 210,
        estimatedSavingsCost: 90,
        difficulty: "Easy"
      },
      {
        id: "rec-3",
        category: "WASTE",
        title: "Replace Single-Use Coffee Cups",
        description: "Get a reusable steel tumbler. Avoids average 2.5kg of plastic-coated paper waste per year.",
        potentialSavingsCo2: 12,
        estimatedSavingsCost: 150,
        difficulty: "Easy"
      },
      {
        id: "rec-4",
        category: "TRANSPORT",
        title: "Group Errands Weekly",
        description: "Consolidate driving trips into a single route. Cuts cold-start emissions by 40%.",
        potentialSavingsCo2: 180,
        estimatedSavingsCost: 120,
        difficulty: "Medium"
      }
    ];
  }

  static async chatWithCoach(message: string, history: ChatMessage[]): Promise<string> {
    const lowercaseMsg = message.toLowerCase();
    if (lowercaseMsg.includes("bill") || lowercaseMsg.includes("electricity")) {
      return "Based on your electricity profile, you're experiencing a 15% spike during peak hours (4 PM - 8 PM). Running high-drain appliances (washer, dryer) after 8 PM will reduce strain on the local grid and lower carbon intensity.";
    }
    if (lowercaseMsg.includes("food") || lowercaseMsg.includes("meat") || lowercaseMsg.includes("diet")) {
      return "Transitioning to plant-based items is the single most effective personal choice. Producing 1kg of beef outputs about 27kg of CO2, while 1kg of lentils is just 0.9kg. Let me know if you'd like a quick eco-friendly recipe!";
    }
    if (lowercaseMsg.includes("receipt") || lowercaseMsg.includes("shop") || lowercaseMsg.includes("plastic")) {
      return "I analyzed your scanned receipts. 40% of emissions stem from plastic-packaged processed foods. Buying in bulk and choosing fresh local items will bring down both plastic waste and transport carbon.";
    }
    return "Hi there! I am your EcoVerse Sustainability Coach. I monitor your daily transport, utility bills, and scans to provide suggestions. Ask me anything about reducing your carbon footprint or optimizing utility bills!";
  }
}
