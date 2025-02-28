import React from "react";
import CardComponent from "./MainComponent";

function Card() {
  const mockData = {
    startupName: "TechCorp Solutions",
    website: "https://techcorp.example.com",
    matchScore: 87.5,
    ebitda: 2500000,
    revenue: 10000000,
    growth: 125.5,
    skuCount: 47,
    previousInvestors: ["Sequoia Capital", "Andreessen Horowitz", "Y Combinator"],
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-900 min-h-screen">
      <CardComponent {...mockData} />
    </div>
  );
}

export default Card;
