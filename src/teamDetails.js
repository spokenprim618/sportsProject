import "./style.css";

const API_CONFIG = {
  BASE_URL: "https://v3.football.api-sports.io",
  API_KEY: import.meta.env.VITE_APP_API_KEY,
  DEFAULT_LEAGUE: 39,
  DEFAULT_SEASON: 2023,
  AVAILABLE_SEASONS: [2021, 2022, 2023],
};

function selectYear(year) {
  window.location.href = `/sportsProject/src/team.html?year=${year}`;
}

function handleTeamClick(teamId, teamName, leagueId, season) {
  const parsedLeagueId = parseInt(leagueId);
  const parsedSeason = parseInt(season);

  const validLeagueId = !isNaN(parsedLeagueId)
    ? parsedLeagueId
    : API_CONFIG.DEFAULT_LEAGUE;

  const validSeason =
    !isNaN(parsedSeason) && API_CONFIG.AVAILABLE_SEASONS.includes(parsedSeason)
      ? parsedSeason
      : API_CONFIG.DEFAULT_SEASON;

  const params = new URLSearchParams({
    id: teamId,
    name: teamName,
    leagueId: validLeagueId,
    season: validSeason,
  });

  window.location.href = `/sportsProject/src/team-details.html?${params.toString()}`;
}

async function fetchTeams(year) {
  const container = document.getElementById("teams-container");
  try {
    const url = new URL("teams", API_CONFIG.BASE_URL);
    url.searchParams.append("league", API_CONFIG.DEFAULT_LEAGUE);
    url.searchParams.append("season", year);

    const response = await fetch(url, {
      method: "GET",
      headers: { "x-apisports-key": API_CONFIG.API_KEY },
    });

    const data = await response.json();

    container.innerHTML = "";

    data.response.slice(0, 12).forEach((team) => {
      createTeamCard(team.team, container, year);
    });
  } catch (error) {
    container.innerHTML = '<div class="error">Failed to load teams</div>';
    console.error("Error fetching teams:", error);
  }
}

function createTeamCard(teamData, container, year) {
  const card = document.createElement("div");
  card.className = "team-card";
  card.dataset.teamId = teamData.id;

  card.innerHTML = `
    <img src="${teamData.logo}" alt="${teamData.name}" class="team-logo"
         onerror="this.src='https://via.placeholder.com/150?text=No+Logo'">
    <div class="team-info">
      <div class="team-name">${teamData.name}</div>
      <div class="team-country">${teamData.country}</div>
    </div>
  `;

  card.addEventListener("click", () => {
    handleTeamClick(
      teamData.id,
      teamData.name,
      API_CONFIG.DEFAULT_LEAGUE,
      year
    );
  });

  container.appendChild(card);
}

function loadTeamDetails() {
  const params = new URLSearchParams(window.location.search);
  const teamId = params.get("id");
  const teamName = params.get("name");
  const leagueId = params.get("leagueId") || API_CONFIG.DEFAULT_LEAGUE;
  const season = params.get("season") || API_CONFIG.DEFAULT_SEASON;

  if (!teamId || !teamName) {
    window.location.href = `/sportsProject/src/team.html?year=${season}`;
    return;
  }

  const container = document.createElement("div");
  container.className = "team-details-container";

  container.innerHTML = `
    <h1>${teamName}</h1>
    <div class="team-content">
      <img src="https://via.placeholder.com/300?text=Loading+Logo" 
           alt="${teamName}" id="team-logo" class="detail-logo">
      <div class="team-stats" id="team-stats">
        <p>Loading ${season} season statistics...</p>
      </div>
    </div>
    <a href="/sportsProject/src/team.html?year=${season}" class="button">Back to teams</a>
  `;
  document.body.appendChild(container);
  fetchTeamStatistics(teamId, leagueId, season);
}

async function fetchTeamStatistics(teamId, leagueId, season) {
  const parsedLeagueId = parseInt(leagueId);
  const parsedSeason = parseInt(season);

  const validLeagueId = !isNaN(parsedLeagueId)
    ? parsedLeagueId
    : API_CONFIG.DEFAULT_LEAGUE;

  const validSeason =
    !isNaN(parsedSeason) && API_CONFIG.AVAILABLE_SEASONS.includes(parsedSeason)
      ? parsedSeason
      : API_CONFIG.DEFAULT_SEASON;

  try {
    const url = new URL(`${API_CONFIG.BASE_URL}/teams/statistics`);
    url.searchParams.set("team", teamId);
    url.searchParams.set("league", validLeagueId);
    url.searchParams.set("season", validSeason);


    const response = await fetch(url, {
      headers: {
        "x-apisports-key": API_CONFIG.API_KEY,
        Accept: "application/json",
      },
    });

    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

    const data = await response.json();
    if (!data?.response)
      throw new Error(
        `No statistics available for team ${teamId} in ${validSeason}`
      );

    displayTeamStats(data.response);
  } catch (error) {
    console.error("Fetch error:", error);
    document.getElementById("team-stats").innerHTML = `
      <div class="error">
        <p>Failed to load statistics</p>
        <small>Season ${validSeason} • ${error.message}</small>
      </div>
    `;
  }
}

function displayTeamStats(stats) {
  const statsContainer = document.getElementById("team-stats");
  const logoImg = document.getElementById("team-logo");

  try {
    if (stats?.team?.logo) {
      logoImg.src = stats.team.logo;
      logoImg.onerror = () => {
        logoImg.src = "https://via.placeholder.com/300?text=No+Logo";
      };
    }

    const fixtures = stats.fixtures || {};
    const goals = stats.goals || {};
    const cleanSheets = stats.clean_sheet?.total || 0;

    const wins = fixtures.wins?.total || 0;
    const draws = fixtures.draws?.total || 0;
    const loses = fixtures.loses?.total || 0;
    const goalsFor = goals.for?.total?.total || 0;
    const goalsAgainst = goals.against?.total?.total || 0;

    statsContainer.innerHTML = `
      <h2>${stats.team?.name || "Team"} Statistics</h2>
      <div class="stat-grid">
        <div class="stat-item"><span class="stat-value">${wins}</span><span class="stat-label">Wins</span></div>
        <div class="stat-item"><span class="stat-value">${draws}</span><span class="stat-label">Draws</span></div>
        <div class="stat-item"><span class="stat-value">${loses}</span><span class="stat-label">Losses</span></div>
        <div class="stat-item"><span class="stat-value">${goalsFor}</span><span class="stat-label">Goals Scored</span></div>
        <div class="stat-item"><span class="stat-value">${goalsAgainst}</span><span class="stat-label">Goals Conceded</span></div>
        <div class="stat-item"><span class="stat-value">${cleanSheets}</span><span class="stat-label">Clean Sheets</span></div>
      </div>
    `;
  } catch (error) {
    console.error("Display error:", error);
    statsContainer.innerHTML = `
      <div class="error">
        <p>Error displaying statistics</p>
        <small>${error.message}</small>
      </div>
    `;
  }
}

if (window.location.pathname.includes("team-details.html")) {
  document.addEventListener("DOMContentLoaded", loadTeamDetails);
} else if (window.location.pathname.includes("team.html")) {
  const mainParams = new URLSearchParams(window.location.search);
  const selectedYear = mainParams.get("year") || API_CONFIG.DEFAULT_SEASON;
  document.getElementById(
    "season-header"
  ).textContent = `Top Football Teams in ${selectedYear}`;
  document.addEventListener("DOMContentLoaded", () => {
    fetchTeams(selectedYear);
  });
}

window.API_CONFIG = API_CONFIG;
window.selectYear = selectYear;
window.handleTeamClick = handleTeamClick;