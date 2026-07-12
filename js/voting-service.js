import { get,set } from "./storage.js";
import { getAllVotes} from "./votes.js";
import { getAllElections } from "./elections.js";
import { getAllcandidates } from "./candidates.js";
import { currentUser } from "./auth.js";

const candidate_container = document.querySelector(".candidates-list-container");
const seeMoreBtn = document.querySelector(".show-more-btn");
let overlay = document.querySelector(".overlay");
const candidatesCards = candidate_container.querySelectorAll(".candidate");
const modal = document.querySelector(".modal");
const modalContent = modal.querySelector(".modal-content");
const alertElement = document.querySelector(".alert");
const messAlertElement = document.querySelector(".message");

let currentElectionTitle = document.querySelector(".current-ele-title");
let currentElectionDescription = document.querySelector(".current-ele-desc");

seeMoreBtn.addEventListener("click", () => {
    candidate_container.classList.toggle("more");
    seeMoreBtn.textContent = candidate_container.classList.contains("more") ? "see less" : "see more";
})

if([...candidatesCards].length > 9){
    seeMoreBtn.classList.add("active");
}


// candidate logic and workin with voting //

// 1. Get the current election in query parameter //
// 2. Display only that election'info > candidates > vote cast logic 

const currentElectionIdGen = () => {
    let url = new URLSearchParams(window.location.search);
    const id = url.get("id");

    return id;
}


const getCurrentElection = () => {
  let currentElectionId = currentElectionIdGen();
  let currentElection = getAllElections().find(el => el.id == currentElectionId);

  return currentElection;
};


currentElectionTitle.textContent = `${getCurrentElection().elTitle} (Election)`;
currentElectionDescription.textContent = `${getCurrentElection().elDecription}`;


// alerts and message notifcation logic //

const showMessages = (message) => {
    alertElement.classList.add("active");
    messAlertElement.textContent = message;
}

const loadReadyForVoteCandidates = () => {
    let candidates = getAllcandidates().filter(can => can.electionId == currentElectionIdGen());

    if(!candidates.length){
        candidate_container.innerHTML = `
         <div class="cand-place-holder">
            <h2 class="notice-title">No candidates have been added on ${getCurrentElection().elTitle}</h2>
            <p> wait till admin adds to list of candididates</p>
         </div>
        
        `
    }else{
        candidates.forEach(candidate => {
            renderCandidates(candidate)
        });
    }
    
}

const handleVotingActions = (id, dom) => {
    let voteBtn = dom.querySelector(".vote-action");
    
    if(voteBtn){
        voteBtn.addEventListener("click", () => {
            openModal();
            setModalContentForVote();
            sessionStorage.setItem("currentCandidateId", id);
        })
    }
}

const renderCandidates = candidate => {
    let candidateElementDom = document.createElement("div");
    candidateElementDom.className = "candidate";
    candidateElementDom.innerHTML = `
    
    <div class="candidate-image">
      <img src="${candidate.candidateImage}" alt="">
    </div>
    <div class="candidate-header-info">
        <h3 class="candidate-name">${candidate.canName}</h3>
        <p class="candidate-bio">${candidate.candBio}</p>
    </div>
    <div class="vote-action"dataset="${candidate.candidateId}">
        <span>Vote</span>
        <i class="fa-solid fa-check-to-slot" id="vote-icon"></i>
    </div>
    `
    candidate_container.append(candidateElementDom);
    handleVotingActions(candidate.candidateId, candidateElementDom);
}


loadReadyForVoteCandidates();



// recording a vote //
const ligibleEmailKeyword = ["email", "userEmail"];
const seesVote = id => {
    const getVotes = getAllVotes();
    const recordVote = {
        userEmail : currentUser().email,
        voteId : `vote${crypto.randomUUID()}`,
        electionId : currentElectionIdGen(),
        candidateId : id
    }

    const isVoteExist = getVotes.find(vt => vt.userEmail == recordVote.userEmail && vt.electionId == recordVote.electionId);

    if(isVoteExist){
        console.log(isVoteExist);
        
        modalContent.innerHTML = `

         <div class="modal-header">
       <h3 class="model-title">Cast Vote</h3>
        <i class="fa-solid fa-close"></i>
    </div>
    <div class="modal-body">
        <div class="error-icon">
        <i class="fa-solid fa-circle-exclamation"></i>
    </div>

    <div class="error-content">
        <p>Sorry, your vote <strong>has been already recorded</strong>, you cannot vote again</p>
    </div>

    </div>
    </div>
    

        `
        return false;
    }

    getVotes.push(recordVote);
    set("votes", getVotes);
    
    modalContent.innerHTML = `

    <div class="modal-header">
       <h3 class="model-title">Cast Vote</h3>
        <i class="fa-solid fa-close"></i>
    </div>
    <div class="modal-body">
        <div class="success-icon">
        <i class="fa-solid fa-circle-check"></i>
    </div>

    <div class="success-content">
        <p>Your vote has been recorded successfully.</p>
    </div>
    </div>
    </div>
    
    
    `
}

// make largeEvents || btns, overlay ///

document.body.addEventListener("click", (e) => {
    let voteBtn = e.target.closest(".vote-action");
    let xBarIcon = e.target.closest(".fa-solid.fa-close");
    let yesBtn = e.target.closest(".yes");
    let noBtn = e.target.closest(".no");
    let overLay = e.target === overlay;

    if(overLay || xBarIcon || noBtn){
        closeModal();
    }

    if(yesBtn){
        seesVote(sessionStorage.getItem("currentCandidateId"));
    }

})





const setModalContentForVote = () => {
    modalContent.innerHTML = `
    <div class="modal-header">
       <h3 class="model-title">Cast Vote</h3>
        <i class="fa-solid fa-close"></i>
    </div>
    <div class="modal-body">
        <p class="ask-text">Are sure to vote , if you click yes vote will be recorded and cannot be restored.</p>
    <div class="permission-btns">
        <div class="yes">Yes</div>
        <div class="no">No</div>
    </div>
    </div>
    
    `
}



const openModal = () => {
  overlay.classList.add("active");
  document.body.classList.add("active");
}
const closeModal = () => {
  overlay.classList.remove("active");
  document.body.classList.remove("active");
}