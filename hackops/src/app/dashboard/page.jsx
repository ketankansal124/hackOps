"use client";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import MatchCard from "../components/match-card";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [role, setRole] = useState(null);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("matchScore");
  const [filterIndustry, setFilterIndustry] = useState("all");

  // Update role once session is available
  useEffect(() => {
    if (session?.user) {
      setRole(session.user.role || "startup");
    }
  }, [session]);

  // Fetch matches when role is set
  useEffect(() => {
    if (role) {
      const fetchMatches = async () => {
        try {
          const response = await fetch("/api/get-matches", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query: { role } }),
          });

          if (!response.ok) {
            throw new Error("Failed to fetch matches");
          }

          const data = await response.json();
          setMatches(data.matches || []);
        } catch (err) {
          console.error(err);
          setError("Failed to load matches");
        }
      };

      fetchMatches();
    }
  }, [role]);

  const handleSignOut = async () => {
    try {
      await signOut({
        callbackUrl: "/account/signin",
        redirect: true,
      });
    } catch (err) {
      console.error("Failed to sign out:", err);
      setError("Failed to sign out. Please try again.");
    }
  };

  // Show loading state while session is being determined
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-xl font-medium text-gray-600">Loading...</div>
      </div>
    );
  }

  // Redirect unauthenticated users
  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="mb-4 text-xl font-medium text-gray-600">
            Please sign in to view your dashboard
          </div>
          <a
            href="/auth/signin"
            className="text-[#357AFF] hover:text-[#2E69DE]"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  const user = session.user;

  // Filter and sort matches
  const filteredMatches = matches
    .filter(
      (match) => filterIndustry === "all" || match.industry === filterIndustry
    )
    .sort((a, b) => {
      if (sortBy === "matchScore") return b.matchScore - a.matchScore;
      if (sortBy === "recent")
        return new Date(b.createdAt) - new Date(a.createdAt);
      return 0;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            {role === "startup" ? "Startup Dashboard" : "Investor Dashboard"}
          </h1>
          <button
            onClick={handleSignOut}
            className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200"
          >
            Sign Out
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="col-span-1 space-y-6">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <h2 className="mb-4 text-xl font-semibold text-gray-800">
                {role === "startup" ? "Company Profile" : "Investment Profile"}
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-gray-100">
                    <i className="fas fa-building text-gray-400"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
                <button
                  onClick={() => (window.location.href = "/onboarding")}
                  className="w-full rounded-lg border border-[#357AFF] px-4 py-2 text-sm font-medium text-[#357AFF] transition-colors hover:bg-blue-50"
                >
                  Edit Profile
                </button>
              </div>
            </div>

            {role === "investor" && (
              <div className="rounded-xl bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                  Deal Flow Metrics
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Matches</span>
                    <span className="font-medium text-gray-800">
                      {matches.length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">High Potential</span>
                    <span className="font-medium text-gray-800">
                      {matches.filter((m) => m.matchScore >= 90).length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="col-span-1 lg:col-span-2">
            <div className="rounded-xl bg-white p-6 shadow-lg">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold text-gray-800">
                  {role === "startup" ? "Investor Matches" : "Startup Matches"}
                </h2>
                <div className="flex flex-wrap gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
                  >
                    <option value="matchScore">Sort by Match Score</option>
                    <option value="recent">Sort by Recent</option>
                  </select>
                  <select
                    value={filterIndustry}
                    onChange={(e) => setFilterIndustry(e.target.value)}
                    className="rounded-lg border border-gray-200 px-4 py-2 text-sm"
                  >
                    <option value="all">All Industries</option>
                    <option value="SaaS">SaaS</option>
                    <option value="Fintech">Fintech</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="E-commerce">E-commerce</option>
                    <option value="AI/ML">AI/ML</option>
                  </select>
                </div>
              </div>

              {error && (
                <div className="mb-6 rounded-lg bg-red-50 p-3 text-sm text-red-500">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 gap-6">
                {filteredMatches.map((match) => (
                  <MatchCard
                    key={match.id}
                    type={role === "startup" ? "investor" : "startup"}
                    logo={match.logo}
                    name={match.name}
                    matchScore={match.matchScore}
                    industry={match.industry}
                    location={match.location}
                    fundingStage={match.fundingStage}
                    checkSize={match.checkSize}
                    description={match.description}
                    onInterestClick={() => console.log("Interest in", match.id)}
                    onScheduleClick={() => console.log("Schedule with", match.id)}
                  />
                ))}
                {filteredMatches.length === 0 && (
                  <div className="text-center text-gray-500">
                    No matches found. Try adjusting your filters.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
