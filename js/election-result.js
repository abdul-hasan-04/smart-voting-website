import {get} from "./storage.js";
import { getAllElections } from "./elections.js";
import {getAllcandidates} from "./candidates.js";
import {getAllVotes} from "./votes.js";

// select dom elements //
const totalVotElement = document.querySelector(".total-votes-count");
const totalCandidates = document.querySelector(".total-candidate-count");
const winnerOfTheElecionsElement = document.querySelector(".election-winner");



const currentElectionIdGen = () => {
    let url = new URLSearchParams(window.location.search);
    const id = url.get("id");

    return id;
}



const calcTotalVotes = () => {
    return getAllVotes().length;
}

const calcTotalCandidates =  () => {
    return getAllcandidates().length;
}
const calcTotalElections =  () => {
    return getAllElections().length;
}

totalVotElement.textContent = calcTotalVotes();
totalCandidates.textContent = calcTotalCandidates();




function getWinningCandidate(votes) {
  const counts = {};

  for (const v of votes) {
    counts[v.candidateId] = (counts[v.candidateId] || 0) + 1;
  }

  let winnerId = null;
  let maxVotes = 0;

  for (const id in counts) {
    if (counts[id] > maxVotes) {
      maxVotes = counts[id];
      winnerId = id;
    }
  }

  return { candidateId: winnerId, voteCount: maxVotes };
}


const seesWinnerOfElection = () => {
    let currentElectionId = currentElectionIdGen();
    let result = getWinningCandidate(getAllVotes());

    let winnerCandidate = getAllcandidates().find(cand => cand.candidateId == result.candidateId);
    winnerOfTheElecionsElement.textContent = winnerCandidate.canName;

    let createCandidateWinnerDom = document.createElement("div");
    let percentageWinning = (result.voteCount / getAllVotes().filter(v => v.electionId == currentElectionId).length * 100);
    createCandidateWinnerDom.className = "election-winner-card";

    createCandidateWinnerDom.innerHTML = `
    
    <div class="left">
                        <div class="candidate-image">
                            <img src="${winnerCandidate.candidateImage}" alt="">
                        </div>
                    </div>
                    <div class="right">
                        <i class="fa-solid fa-medal"></i>
                        <div class="winning-info">
                            <h3 class="win-text">Winner</h3>
                            <h2 class="candidate-name">${winnerCandidate.canName}</h2>
                            <span class="el-name">${getAllElections().find(el => el.id == currentElectionId).elTitle}</span>
                        </div>
                        <div class="vote-count-ui">
                            <span class="vote-count"><strong>${result.voteCount} votes</strong></span>
                            <span class="vote-percentage"><strong>${percentageWinning.toFixed(1)}%</strong></span>
                        </div>
                        <div class="win-progrsess">
                            <div class="progress-parent">
                                <div class="progress-load"></div>
                            </div>
                        </div>
                    </div>
    
    
    `
    document.querySelector(".election-winner-card-container").append(createCandidateWinnerDom)
}


seesWinnerOfElection();


let cands_State = {
    candTotal : 0,
}

const createLeaderBoardDom = candidate => {
    cands_State.candTotal += 1;
    let leaderBoardCandidate = document.createElement("div");
    leaderBoardCandidate.className = "candidate-leader-board";
    let totalVotesOnCandidate = getAllVotes().filter(vt => vt.electionId == currentElectionIdGen() && vt.candidateId == candidate.candidateId).length;
    let percentageWinning = (totalVotesOnCandidate / getAllVotes().filter(vt => vt.electionId == currentElectionIdGen()).length)*100;
    leaderBoardCandidate.innerHTML = `
    
    <div class="left">
        <div class="rank-no">${cands_State.candTotal}</div>
    </div>
        <div class="candidate-rank-detail">
     <div class="top-row">
         <div class="candidate-name">${candidate.canName}</div>
          <div class="candidate-vote-count">
            <span class="vote-count">${totalVotesOnCandidate} ${totalVotesOnCandidate  > 1 ? "votes" : "vote"}</span>
           <span class="vote-percentage"><strong>${percentageWinning.toFixed(1)}%</strong></span>
            </div>
            </div>
        <div class="candidate-rank-progrsess">
            <div class="canididate-rank-progress-parent">
        <div class="canididate-rank-progress-load" style = "width : ${percentageWinning.toFixed(1)}%"></div>
        </div>
        </div>
        </div>
    
    `

    document.querySelector(".candidates-list-leader-board").append(leaderBoardCandidate)
}



const buildLeaderBoard = () => {
    let electionId = currentElectionIdGen();
    let winningVote = getWinningCandidate(getAllVotes());
    let candidatesOfCurrentElection = getAllcandidates().filter(cand => cand.electionId == electionId);

    
    let updatedCandidatesArray = candidatesOfCurrentElection.sort((a, b) => {
        const votesForA = getAllVotes().filter(v => v.candidateId === a.candidateId).length;
        const votesForB = getAllVotes().filter(v => v.candidateId === b.candidateId).length;
        
        return votesForB - votesForA;
    });
    
    updatedCandidatesArray.forEach(candidate => {
        createLeaderBoardDom(candidate);        
    });
    
}

buildLeaderBoard();