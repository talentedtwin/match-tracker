"use client";

import React, { useRef } from "react";
import { usePlayers, useMatches, useTeams } from "../../hooks/useApi";
import CreateTeamPrompt from "../../components/CreateTeamPrompt";
import { StatsPageSkeleton } from "../../components/Skeleton";
import {
  TrendingUp,
  Users,
  Target,
  Award,
  BarChart3,
  Download,
} from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const StatsPage: React.FC = () => {
  const statsRef = useRef<HTMLDivElement>(null);

  const {
    players,
    loading: playersLoading,
    error: playersError,
  } = usePlayers();
  const {
    matches,
    loading: matchesLoading,
    error: matchesError,
  } = useMatches();
  const { teams, loading: teamsLoading, error: teamsError } = useTeams();

  const loading = playersLoading || matchesLoading || teamsLoading;
  const error = playersError || matchesError || teamsError;

  const exportToPDF = async () => {
    if (!statsRef.current) return;

    try {
      // Create a clone of the stats section for PDF generation
      const element = statsRef.current;

      // Temporarily remove any interactive elements that might interfere with PDF generation
      const buttons = element.querySelectorAll("button");
      const originalDisplay = Array.from(buttons).map(
        (btn) => btn.style.display
      );
      buttons.forEach((btn) => (btn.style.display = "none"));

      // Generate canvas from the HTML element with better compatibility
      const canvas = await html2canvas(element, {
        scale: 1.5, // Reduced scale for better compatibility
        useCORS: true,
        allowTaint: false,
        backgroundColor: "#f9fafb",
        logging: false, // Disable logging to reduce console noise
        width: element.scrollWidth,
        height: element.scrollHeight,
        foreignObjectRendering: false, // Disable foreign objects that might cause issues
        removeContainer: true,
        ignoreElements: (element) => {
          // Ignore problematic elements
          const tagName = element.tagName.toLowerCase();
          return (
            tagName === "script" ||
            tagName === "noscript" ||
            tagName === "style" ||
            element.hasAttribute("data-html2canvas-ignore")
          );
        },
        onclone: (clonedDoc) => {
          // Remove any CSS that might contain unsupported color functions
          const styleSheets = clonedDoc.styleSheets;
          for (let i = styleSheets.length - 1; i >= 0; i--) {
            try {
              const sheet = styleSheets[i];
              if (
                sheet.href &&
                (sheet.href.includes("tailwind") || sheet.href.includes("css"))
              ) {
                sheet.disabled = true;
              }
            } catch {
              // Ignore cross-origin stylesheet access errors
            }
          }

          // Add our own safe styles
          const style = clonedDoc.createElement("style");
          style.textContent = `
            body { font-family: system-ui, -apple-system, sans-serif; }
            .bg-white { background-color: #ffffff !important; }
            .bg-gray-50 { background-color: #f9fafb !important; }
            .text-gray-800 { color: #1f2937 !important; }
            .text-gray-600 { color: #4b5563 !important; }
            .text-gray-500 { color: #6b7280 !important; }
            .text-blue-600 { color: #2563eb !important; }
            .text-green-600 { color: #16a34a !important; }
            .text-red-600 { color: #dc2626 !important; }
            .text-yellow-600 { color: #ca8a04 !important; }
            .text-blue-500 { color: #3b82f6 !important; }
            .bg-blue-100 { background-color: #dbeafe !important; }
            .bg-green-100 { background-color: #dcfce7 !important; }
            .bg-red-100 { background-color: #fee2e2 !important; }
            .bg-yellow-100 { background-color: #fef3c7 !important; }
            .rounded-xl { border-radius: 0.75rem !important; }
            .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1) !important; }
            .p-6 { padding: 1.5rem !important; }
            .p-4 { padding: 1rem !important; }
            .mb-8 { margin-bottom: 2rem !important; }
            .mb-4 { margin-bottom: 1rem !important; }
            .mb-2 { margin-bottom: 0.5rem !important; }
            .grid { display: grid !important; }
            .grid-cols-4 { grid-template-columns: repeat(4, 1fr) !important; }
            .grid-cols-3 { grid-template-columns: repeat(3, 1fr) !important; }
            .grid-cols-2 { grid-template-columns: repeat(2, 1fr) !important; }
            .gap-6 { gap: 1.5rem !important; }
            .gap-4 { gap: 1rem !important; }
            .gap-2 { gap: 0.5rem !important; }
            .flex { display: flex !important; }
            .items-center { align-items: center !important; }
            .justify-between { justify-content: space-between !important; }
            .text-center { text-align: center !important; }
            .text-left { text-align: left !important; }
            .text-sm { font-size: 0.875rem !important; }
            .text-lg { font-size: 1.125rem !important; }
            .text-xl { font-size: 1.25rem !important; }
            .text-2xl { font-size: 1.5rem !important; }
            .font-medium { font-weight: 500 !important; }
            .font-semibold { font-weight: 600 !important; }
            .font-bold { font-weight: 700 !important; }
            .uppercase { text-transform: uppercase !important; }
            .tracking-wide { letter-spacing: 0.025em !important; }
            .w-full { width: 100% !important; }
            .overflow-x-auto { overflow-x: auto !important; }
            table { border-collapse: collapse !important; width: 100% !important; }
            th, td { padding: 0.75rem 1rem !important; }
            .border-b { border-bottom: 1px solid #e5e7eb !important; }
            .border-gray-200 { border-color: #e5e7eb !important; }
            .border-gray-100 { border-color: #f3f4f6 !important; }
          `;
          clonedDoc.head.appendChild(style);

          // Remove any elements with potential CSS issues
          const elementsToRemove = clonedDoc.querySelectorAll(
            '[style*="lab("], [style*="lch("], [style*="oklch("]'
          );
          elementsToRemove.forEach((el) => el.removeAttribute("style"));
        },
      });

      // Restore button visibility
      buttons.forEach((btn, index) => {
        btn.style.display = originalDisplay[index];
      });

      // Create PDF
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if content is longer than one page
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Generate filename with current date
      const currentDate = new Date().toISOString().split("T")[0];
      const filename = `team-statistics-${currentDate}.pdf`;

      // Save the PDF
      pdf.save(filename);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  // Calculate team statistics
  const teamStats = React.useMemo(() => {
    if (!matches || matches.length === 0) {
      return {
        totalMatches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        winPercentage: 0,
        avgGoalsFor: 0,
        avgGoalsAgainst: 0,
      };
    }

    // Filter to only include finished matches
    const finishedMatches = matches.filter((match) => match.isFinished);
    const totalMatches = finishedMatches.length;

    if (totalMatches === 0) {
      return {
        totalMatches: 0,
        wins: 0,
        draws: 0,
        losses: 0,
        goalsFor: 0,
        goalsAgainst: 0,
        goalDifference: 0,
        winPercentage: 0,
        avgGoalsFor: 0,
        avgGoalsAgainst: 0,
      };
    }

    let wins = 0;
    let draws = 0;
    let losses = 0;
    let goalsFor = 0;
    let goalsAgainst = 0;

    finishedMatches.forEach((match) => {
      goalsFor += match.goalsFor;
      goalsAgainst += match.goalsAgainst;

      if (match.goalsFor > match.goalsAgainst) {
        wins++;
      } else if (match.goalsFor === match.goalsAgainst) {
        draws++;
      } else {
        losses++;
      }
    });

    const goalDifference = goalsFor - goalsAgainst;
    const winPercentage = totalMatches > 0 ? (wins / totalMatches) * 100 : 0;
    const avgGoalsFor = totalMatches > 0 ? goalsFor / totalMatches : 0;
    const avgGoalsAgainst = totalMatches > 0 ? goalsAgainst / totalMatches : 0;

    return {
      totalMatches,
      wins,
      draws,
      losses,
      goalsFor,
      goalsAgainst,
      goalDifference,
      winPercentage,
      avgGoalsFor,
      avgGoalsAgainst,
    };
  }, [matches]);

  // Calculate player statistics
  const playerStats = React.useMemo(() => {
    if (!players || !matches || matches.length === 0) {
      return [];
    }

    // Filter to only include finished matches
    const finishedMatches = matches.filter((match) => match.isFinished);

    return players
      .map((player) => {
        let totalGoals = 0;
        let totalAssists = 0;
        let matchesPlayed = 0;

        finishedMatches.forEach((match) => {
          // Check if player was in the squad for this match
          if (
            match.selectedPlayerIds &&
            match.selectedPlayerIds.includes(player.id)
          ) {
            matchesPlayed++;

            // Add goals and assists if the player has stats for this match
            const playerStat = match.playerStats?.find(
              (stat) => stat.playerId === player.id
            );
            if (playerStat) {
              totalGoals += playerStat.goals || 0;
              totalAssists += playerStat.assists || 0;
            }
          }
        });

        return {
          ...player,
          totalGoals,
          totalAssists,
          matchesPlayed,
          avgGoalsPerMatch: matchesPlayed > 0 ? totalGoals / matchesPlayed : 0,
          avgAssistsPerMatch:
            matchesPlayed > 0 ? totalAssists / matchesPlayed : 0,
        };
      })
      .sort((a, b) => b.totalGoals - a.totalGoals);
  }, [players, matches]);

  if (loading) {
    return <StatsPageSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <div className="text-red-600 text-lg font-semibold mb-2">
              Error Loading Statistics
            </div>
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  // Show create team prompt if no teams exist
  if (!teams || teams.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
              📈 Team Statistics
            </h1>
            <p className="text-center text-gray-600">
              Analyze your team&apos;s performance and player stats
            </p>
          </div>

          <CreateTeamPrompt
            title="No Team Found"
            message="Create a team and add players to start viewing detailed statistics and performance analytics."
          />
        </div>
      </div>
    );
  }

  if (teamStats.totalMatches === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-blue-500" />
            Team Statistics
          </h1>
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Statistics Available
            </h3>
            <p className="text-gray-500 mb-6">
              Play some matches to see your team statistics and performance
              analytics.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-blue-500" />
            Team Statistics
          </h1>
          {/* <button
            onClick={exportToPDF}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2"
            title="Export statistics as PDF"
          >
            <Download className="w-5 h-5" />
            Export PDF
          </button> */}
        </div>

        <div ref={statsRef} data-stats-container>
          {/* Team Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Total Matches
                  </h3>
                  <p className="text-2xl font-bold text-gray-800">
                    {teamStats.totalMatches}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Win Rate
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {teamStats.winPercentage.toFixed(1)}%
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Goals Scored
                  </h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {teamStats.goalsFor}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                    Goal Difference
                  </h3>
                  <p
                    className={`text-2xl font-bold ${
                      teamStats.goalDifference >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {teamStats.goalDifference > 0 ? "+" : ""}
                    {teamStats.goalDifference}
                  </p>
                </div>
                <div
                  className={`p-3 rounded-full ${
                    teamStats.goalDifference >= 0
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  <TrendingUp
                    className={`w-6 h-6 ${
                      teamStats.goalDifference >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Match Record */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Match Record
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {teamStats.wins}
                </div>
                <div className="text-sm text-gray-500">Wins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">
                  {teamStats.draws}
                </div>
                <div className="text-sm text-gray-500">Draws</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {teamStats.losses}
                </div>
                <div className="text-sm text-gray-500">Losses</div>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Performance Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Average Goals Scored
                </h3>
                <div className="text-2xl font-bold text-blue-600">
                  {teamStats.avgGoalsFor.toFixed(1)}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">
                  Average Goals Conceded
                </h3>
                <div className="text-2xl font-bold text-red-600">
                  {teamStats.avgGoalsAgainst.toFixed(1)}
                </div>
              </div>
            </div>
          </div>

          {/* Top Players */}
          {playerStats.length > 0 && (
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Top Performers
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-500">
                        Player
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">
                        Matches
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">
                        Goals
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">
                        Assists
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">
                        Avg Goals
                      </th>
                      <th className="text-center py-3 px-4 font-medium text-gray-500">
                        Avg Assists
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {playerStats.slice(0, 10).map((player) => (
                      <tr
                        key={player.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="py-3 px-4">
                          <div className="font-medium text-gray-800">
                            {player.name}
                          </div>
                        </td>
                        <td className="text-center py-3 px-4 text-gray-600">
                          {player.matchesPlayed}
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {player.totalGoals}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {player.totalAssists}
                          </span>
                        </td>
                        <td className="text-center py-3 px-4 text-gray-600">
                          {player.avgGoalsPerMatch.toFixed(1)}
                        </td>
                        <td className="text-center py-3 px-4 text-gray-600">
                          {player.avgAssistsPerMatch.toFixed(1)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsPage;
