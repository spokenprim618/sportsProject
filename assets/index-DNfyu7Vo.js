(function(){const a=document.createElement("link").relList;if(a&&a.supports&&a.supports("modulepreload"))return;for(const s of document.querySelectorAll('link[rel="modulepreload"]'))n(s);new MutationObserver(s=>{for(const t of s)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function o(s){const t={};return s.integrity&&(t.integrity=s.integrity),s.referrerPolicy&&(t.referrerPolicy=s.referrerPolicy),s.crossOrigin==="use-credentials"?t.credentials="include":s.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function n(s){if(s.ep)return;s.ep=!0;const t=o(s);fetch(s.href,t)}})();const w="07dda17efb811c96aba7340d0afd5519",r={BASE_URL:"https://v3.football.api-sports.io",API_KEY:w,DEFAULT_LEAGUE:39,DEFAULT_SEASON:2023,AVAILABLE_SEASONS:[2021,2022,2023]};function T(e){window.location.href=`/sportsProject/team.html?year=${e}`}function y(e,a,o,n){const s=parseInt(o),t=parseInt(n),i=isNaN(s)?r.DEFAULT_LEAGUE:s,c=!isNaN(t)&&r.AVAILABLE_SEASONS.includes(t)?t:r.DEFAULT_SEASON,l=new URLSearchParams({id:e,name:a,leagueId:i,season:c});window.location.href=`/sportsProject/team-details.html?${l.toString()}`}async function I(e){const a=document.getElementById("teams-container");try{const o=new URL("teams",r.BASE_URL);o.searchParams.append("league",r.DEFAULT_LEAGUE),o.searchParams.append("season",e);const s=await(await fetch(o,{method:"GET",headers:{"x-apisports-key":r.API_KEY}})).json();a.innerHTML="",s.response.slice(0,12).forEach(t=>{N(t.team,a,e)})}catch(o){a.innerHTML='<div class="error">Failed to load teams</div>',console.error("Error fetching teams:",o)}}function N(e,a,o){const n=document.createElement("div");n.className="team-card",n.dataset.teamId=e.id,n.innerHTML=`
    <img src="${e.logo}" alt="${e.name}" class="team-logo"
         onerror="this.src='https://via.placeholder.com/150?text=No+Logo'">
    <div class="team-info">
      <div class="team-name">${e.name}</div>
      <div class="team-country">${e.country}</div>
    </div>
  `,n.addEventListener("click",()=>{y(e.id,e.name,r.DEFAULT_LEAGUE,o)}),a.appendChild(n)}function U(){const e=new URLSearchParams(window.location.search),a=e.get("id"),o=e.get("name"),n=e.get("leagueId")||r.DEFAULT_LEAGUE,s=e.get("season")||r.DEFAULT_SEASON;if(!a||!o){window.location.href="/sportsProject/team.html";return}const t=document.createElement("div");t.className="team-details-container",t.innerHTML=`
    <h1>${o}</h1>
    <div class="team-content">
      <img src="https://via.placeholder.com/300?text=Loading+Logo" 
           alt="${o}" id="team-logo" class="detail-logo">
      <div class="team-stats" id="team-stats">
        <p>Loading ${s} season statistics...</p>
      </div>
    </div>
    <a href="/sportsProject/team.html" class="button">Back to teams</a>
  `,document.body.appendChild(t),$(a,n,s)}async function $(e,a,o){const n=parseInt(a),s=parseInt(o),t=isNaN(n)?r.DEFAULT_LEAGUE:n,i=!isNaN(s)&&r.AVAILABLE_SEASONS.includes(s)?s:r.DEFAULT_SEASON;try{const c=new URL(`${r.BASE_URL}/teams/statistics`);c.searchParams.set("team",e),c.searchParams.set("league",t),c.searchParams.set("season",i),console.log("Fetching statistics from:",c.toString());const l=await fetch(c,{headers:{"x-apisports-key":r.API_KEY,Accept:"application/json"}});if(!l.ok)throw new Error(`HTTP error! Status: ${l.status}`);const d=await l.json();if(!(d!=null&&d.response))throw new Error(`No statistics available for team ${e} in ${i}`);P(d.response)}catch(c){console.error("Fetch error:",c),document.getElementById("team-stats").innerHTML=`
      <div class="error">
        <p>Failed to load statistics</p>
        <small>Season ${i} • ${c.message}</small>
      </div>
    `}}function P(e){var n,s,t,i,c,l,d,p,u,h;const a=document.getElementById("team-stats"),o=document.getElementById("team-logo");try{(n=e==null?void 0:e.team)!=null&&n.logo&&(o.src=e.team.logo,o.onerror=()=>{o.src="https://via.placeholder.com/300?text=No+Logo"});const m=e.fixtures||{},g=e.goals||{},L=((s=e.clean_sheet)==null?void 0:s.total)||0,f=((t=m.wins)==null?void 0:t.total)||0,E=((i=m.draws)==null?void 0:i.total)||0,v=((c=m.loses)==null?void 0:c.total)||0,A=((d=(l=g.for)==null?void 0:l.total)==null?void 0:d.total)||0,S=((u=(p=g.against)==null?void 0:p.total)==null?void 0:u.total)||0;a.innerHTML=`
      <h2>${((h=e.team)==null?void 0:h.name)||"Team"} Statistics</h2>
      <div class="stat-grid">
        <div class="stat-item"><span class="stat-value">${f}</span><span class="stat-label">Wins</span></div>
        <div class="stat-item"><span class="stat-value">${E}</span><span class="stat-label">Draws</span></div>
        <div class="stat-item"><span class="stat-value">${v}</span><span class="stat-label">Losses</span></div>
        <div class="stat-item"><span class="stat-value">${A}</span><span class="stat-label">Goals Scored</span></div>
        <div class="stat-item"><span class="stat-value">${S}</span><span class="stat-label">Goals Conceded</span></div>
        <div class="stat-item"><span class="stat-value">${L}</span><span class="stat-label">Clean Sheets</span></div>
      </div>
    `}catch(m){console.error("Display error:",m),a.innerHTML=`
      <div class="error">
        <p>Error displaying statistics</p>
        <small>${m.message}</small>
      </div>
    `}}if(window.location.pathname.includes("team-details.html"))document.addEventListener("DOMContentLoaded",U);else if(window.location.pathname.includes("team.html")){const a=new URLSearchParams(window.location.search).get("year")||r.DEFAULT_SEASON;document.getElementById("season-header").textContent=`Top Football Teams in ${a}`,document.addEventListener("DOMContentLoaded",()=>{I(a)})}window.selectYear=T;
