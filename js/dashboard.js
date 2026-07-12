import { currentUser } from "./auth.js";
import { get } from "./storage.js";
import { getAllElections} from "./elections.js";
import { getAllVotes } from "./votes.js";


if(!currentUser()){
    location.href = "login.html";
}


let userIcon = document.querySelector("#user-icon");
let userProfilecontainer = document.querySelector(".user-profile");
let electionsContainerParent = document.querySelector(".electionList-container");


userIcon.addEventListener("click", () => {
    document.querySelector(".user-detailed-info").classList.toggle("active");
});


userProfilecontainer.addEventListener("click", (e) =>{
    let logoutBtn = e.target.closest("#logoutIcon");
    if(logoutBtn){
        sessionStorage.removeItem("currentUser");
        location.href = "login.html";
    }
})
  
const createUserInfo = liveUserData => {
    let userDetailedElement = document.querySelector(".user-detailed-info");
    userDetailedElement.innerHTML = `
    
    
    `
}


createUserInfo(currentUser());



// filter status logic //

const filterStatusElements = document.querySelectorAll(".status");


const filterElectionsToAll = () => {
    let allAvailableElections = getAllElections();
    electionsContainerParent.innerHTML = ""
    allAvailableElections.forEach(element => {
        renderElections(element);
    });
}

const filterElectionToOpen = () => {
    let openCurrentElections = getAllElections().filter(el => el.status == "open");
     electionsContainerParent.innerHTML = ""
    openCurrentElections.forEach(element => {
        renderElections(element)
    });
}


const filterElectionsToClosed = () => {
    let closedCurrentElections = getAllElections().filter(el => el.status == "closed");
     electionsContainerParent.innerHTML = ""
    closedCurrentElections.forEach(element => {
        renderElections(element)
    });
}


const filterElectionsToUpcoming = () => {
    let upcomingCurrentElections = getAllElections().filter(el => el.status == "upcoming");
     electionsContainerParent.innerHTML = ""
    upcomingCurrentElections.forEach(element => {
        renderElections(element)
    });
}

[...filterStatusElements].forEach((element,index) => {
    element.addEventListener("click", () => {
        filterStatusElements.forEach(el => el.classList.remove("active"));
        element.classList.add("active");

        if(element.textContent === "All"){
            console.log(element.textContent);
            
            filterElectionsToAll();
            
        }
        if(element.textContent === "Open"){
            console.log(element.textContent);
            filterElectionToOpen();
        }
        if(element.textContent === "Closed"){
            console.log(element.textContent);
            filterElectionsToClosed();
        }
        if(element.textContent === "Upcoming"){
            console.log(element.textContent);
            filterElectionsToUpcoming();
        }
    })
})




// display and rendering elections logic //


const renderElections = el => {
    let electionElementDom = document.createElement("div");
    electionElementDom.className = "Election";

    electionElementDom.innerHTML = `
     <div class="election-header">
                        <span class="election-status ${el.status == "closed" ? "closed" : el.status == "upcoming" ? "upcoming" : "open"}">${el.status == "closed" ? "closed" : el.status == "upcoming" ? "upcoming" : "open"}</span>
                        <div class="election-info">
                        <i class ="${el.status == "upcoming" ? "fa-solid fa-calendar" : el.status == "closed" ? "fa-solid fa-lock" : ""}" id ="status-icon"></i>
                            <h2 class="election-title"><strong>${el.elTitle}</strong></h2>
                            <p class="election-description">${el.elDecription}</p>
                        </div>
                    </div>
                    <div class="election-body">
                        <div class="election-date-container">
                            <i class="fa-solid fa-calendar"></i>
                            <span class="election-date">${el.createdAt}</span>
                        </div>
                    </div>
                    <div class="election-bottom-content">
                        <a href ="vote-candidate.html?id=${el.id}" class="cast-btn">${el.status == "open" ? "vote now" : "Unable to vote"}</a>
                    </div>
    
    `

    electionsContainerParent.append(electionElementDom)

}







const loadElectionsFromLocal = () => {
    let currentElections = getAllElections();

    electionsContainerParent.innerHTML = "";

    if(!currentElections.length) {
        electionsContainerParent.innerHTML = `
         <div class="election-place-holder">
            <h2>No elections yet</h2>
            <p>Check back soon — an administrator hasn't published any elections.</p>
            </div>
    
        `
        return;
    }


    currentElections.forEach(el => {
        renderElections(el);
    })
}


loadElectionsFromLocal();