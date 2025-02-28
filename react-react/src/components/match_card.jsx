import React from "react";

function CardComponent({
  startupName,
  website,
  matchScore,
  ebitda,
  revenue,
  growth,
  skuCount,
  previousInvestors,
}) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-2xl">
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white font-inter">
            {startupName}
          </h2>
          <a
            href={website}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white font-inter text-sm"
          >
            {website}
          </a>
        </div>

        <div className="py-4">
          <div className="text-3xl font-bold text-gray-900 dark:text-white font-inter">
            {formatPercentage(matchScore)}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-400 font-inter">
            Match Score
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="text-xl font-bold text-gray-900 dark:text-white font-inter">
              {formatCurrency(ebitda)}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-400 font-inter">
              EBITDA
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900 dark:text-white font-inter">
              {formatCurrency(revenue)}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-400 font-inter">
              Revenue
            </div>
          </div>
          <div>
            <div className="text-xl font-bold text-gray-900 dark:text-white font-inter">
              {formatPercentage(growth)}
            </div>
            <div className="text-sm text-gray-700 dark:text-gray-400 font-inter">
              Growth
            </div>
          </div>
        </div>

        <div>
          <div className="text-xl font-bold text-gray-900 dark:text-white font-inter">
            {skuCount}
          </div>
          <div className="text-sm text-gray-700 dark:text-gray-400 font-inter">
            SKUs
          </div>
        </div>

        <div>
          <div className="text-sm text-gray-700 dark:text-gray-400 font-inter mb-2">
            Previous Investors
          </div>
          <div className="flex flex-wrap gap-2">
            {previousInvestors.map((investor, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-900 dark:text-white font-inter"
              >
                {investor}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainComponent;
