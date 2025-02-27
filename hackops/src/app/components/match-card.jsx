"use client";
import React from "react";

function MatchCard({
  type = "startup",
  logo,
  name,
  matchScore,
  industry,
  location,
  fundingStage,
  checkSize,
  description,
  onInterestClick,
  onScheduleClick,
}) {
  const isStartup = type === "startup";

  return (
    <div className="w-[400px] rounded-xl bg-white p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {logo ? (
            <img
              src={logo}
              alt={`${name} logo`}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <i className="fas fa-building text-gray-400"></i>
            </div>
          )}
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">{location}</p>
          </div>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50">
          <span className="text-sm font-medium text-[#357AFF]">
            {matchScore}%
          </span>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <i className="fas fa-industry text-gray-400"></i>
          <span className="text-sm text-gray-600">{industry}</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fas fa-chart-line text-gray-400"></i>
          <span className="text-sm text-gray-600">
            {isStartup ? fundingStage : `Check size: ${checkSize}`}
          </span>
        </div>
      </div>

      <p className="mb-4 text-sm text-gray-600 line-clamp-2">{description}</p>

      <div className="flex gap-2">
        <button
          onClick={onInterestClick}
          className="flex-1 rounded-lg bg-[#357AFF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2E69DE] focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2"
        >
          Express Interest
        </button>
        <button
          onClick={onScheduleClick}
          className="flex-1 rounded-lg border border-[#357AFF] px-4 py-2 text-sm font-medium text-[#357AFF] transition-colors hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-[#357AFF] focus:ring-offset-2"
        >
          Schedule Meeting
        </button>
      </div>
    </div>
  );
}

function MatchCardStory() {
  return (
    <div className="flex min-h-screen flex-col items-center gap-8 bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div>
        <h3 className="mb-4 text-xl font-semibold">Startup Match Card</h3>
        <MatchCard
          type="investor"
          name="Acme Ventures"
          logo="https://example.com/logo.png"
          matchScore={95}
          industry="Fintech"
          location="San Francisco, CA"
          checkSize="$500K-2M"
          description="Leading early-stage VC firm focused on fintech innovations and digital transformation. Looking for ambitious founders building the future of finance."
          onInterestClick={() => console.log("Interest clicked")}
          onScheduleClick={() => console.log("Schedule clicked")}
        />
      </div>

      <div>
        <h3 className="mb-4 text-xl font-semibold">Investor Match Card</h3>
        <MatchCard
          type="startup"
          name="TechFlow"
          logo="https://example.com/logo.png"
          matchScore={88}
          industry="SaaS"
          location="New York, NY"
          fundingStage="Series A"
          description="B2B SaaS platform revolutionizing workflow automation for enterprise customers. Growing 20% MoM with strong product-market fit."
          onInterestClick={() => console.log("Interest clicked")}
          onScheduleClick={() => console.log("Schedule clicked")}
        />
      </div>
    </div>
  );
}

export default MatchCard;