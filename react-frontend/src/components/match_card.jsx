import React from 'react';
import { Calendar, ThumbsUp, ArrowUpRight } from 'lucide-react';

const MatchCard = ({
  type = "startup",
  logo = "",
  name = "Byju's",
  matchScore = 87,
  industry = "EdTech",
  location = "Bangalore, India",
  fundingStage = "Series D",
  checkSize = "$5M-$15M",
  description = "Byju's is a leading educational technology company offering personalized learning programs for students across all age groups.",
  onInterestClick = () => console.log("Interest clicked"),
  onScheduleClick = () => console.log("Schedule meeting clicked"),
}) => {
  const logoSrc = logo || "/api/placeholder/60/60";

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-600";
    if (score >= 60) return "bg-green-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-gray-400";
  };

  return (
    <div className="w-full max-w-md border rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 bg-white">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full overflow-hidden mr-3 bg-gray-100">
            <img src={logoSrc} alt={`${name} logo`} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{name}</h3>
            <p className="text-sm text-gray-500 capitalize">{type}</p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className={`${getScoreColor(matchScore)} text-white font-bold rounded-full w-10 h-10 flex items-center justify-center`}>{matchScore}</div>
          <span className="text-xs mt-1">Match</span>
        </div>
      </div>
      <div className="mb-4">
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="text-sm"><span className="text-gray-500">Industry: </span><span className="font-medium">{industry}</span></div>
          <div className="text-sm"><span className="text-gray-500">Location: </span><span className="font-medium">{location}</span></div>
          <div className="text-sm"><span className="text-gray-500">{type === "startup" ? "Stage: " : "Preferred Stage: "}</span><span className="font-medium">{fundingStage}</span></div>
          <div className="text-sm"><span className="text-gray-500">{type === "startup" ? "Seeking: " : "Check Size: "}</span><span className="font-medium">{checkSize}</span></div>
        </div>
        <p className="text-sm text-gray-700 line-clamp-2">{description}</p>
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={onInterestClick} className="flex items-center text-sm font-medium px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
          <ThumbsUp size={16} className="mr-1" /> Show Interest
        </button>
        <button onClick={onScheduleClick} className="flex items-center text-sm font-medium px-3 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors">
          <Calendar size={16} className="mr-1" /> Schedule Meeting
        </button>
        <button className="flex items-center text-sm text-gray-600 hover:text-blue-600 px-2">
          View Details <ArrowUpRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default MatchCard;