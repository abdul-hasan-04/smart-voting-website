import { currentUser, login } from "./auth.js";
import { set, get } from "./storage.js";

import { getAllElections } from "./elections.js";
import { getAllcandidates } from "./candidates.js";
import { getAllVotes } from "./votes.js";

// select all dom elements on admin.html //

if (!currentUser() || currentUser().role !== "admin") {
    window.location.replace("login.html");
}else {
    document.body.classList.remove("hidden");
}

let electionCreationBtn = document.querySelector(".create-election-btn");
let overlay = document.querySelector(".overlay");
let model = document.querySelector(".modal");
let modelContent = document.querySelector(".modal-content");
let electionContainerList = document.querySelector(".election-container-list");
let alertElement = document.querySelector(".alert");
let messElement = document.querySelector(".message");

// dashbaordmirrors || count span //

let electionCount = document.querySelector(".total-election-count");
let currentOpenCount = document.querySelector(".currently-open-count");
let totalCandidateCount = document.querySelector(".total-candidate-count");
let totalVotesCount = document.querySelector(".total-votes-count");

const countAllElections = () => {
  let currentElections = getAllElections();
  electionCount.textContent = currentElections.length;
};
const countCurrentlyOpenElections = () => {
  let allElections = getAllElections();
  let onlyOpenElections = allElections.filter(el => el.status == "open");

  currentOpenCount.textContent = onlyOpenElections.length;
};
const countAllCandidates = () => {
  let currentCandidates = getAllcandidates();
  totalCandidateCount.textContent = currentCandidates.length;
};
const countVoteCasted = () => {
  let allVotes = getAllVotes();
  currentOpenCount.textContent = allVotes.length;
};

countAllCandidates();
countVoteCasted();
countCurrentlyOpenElections();
countAllElections();

const successAlertMessage = (message) => {
  alertElement.classList.add("active");
  alertElement.classList.remove("error");
  messElement.textContent = message;

  setTimeout(() => {
    alertElement.classList.remove("active");
  }, 2000);
};
const ErrorAlertMessage = (message) => {
  alertElement.classList.add("active");
  alertElement.classList.add("error");
  messElement.textContent = message;

  setTimeout(() => {
    alertElement.classList.remove("active");
  }, 2000);
};
// redirect user from admin pages || authorization//

let currentLiveUser = currentUser();

let userProfilecontainer = document.querySelector(".user-profile");
let userInfoElement = document.querySelector(".user-detailed-info");


let userIcon = document.querySelector("#user-icon");
const electionTitleEl = document.querySelector("#election-title");
const electionDescE = document.querySelector("#election-description");
const electionForm = document.querySelector("#electionCreation");
let userProfilDetailed = document.querySelector(".user-detailed-info");
let electionParentElement = document.querySelector(".election-list");
let electionModel = document.querySelector(".election-model");

userIcon.addEventListener("click", () => {
  userInfoElement.classList.toggle("active");
  userInfoElement.classList.contains("active")
    ? (userIcon.className = "fa-solid fa-close")
    : (userIcon.className = "fa-solid fa-bars");
});

userProfilecontainer.addEventListener("click", (e) => {
  let logoutBtn = e.target.closest("#logoutIcon");
  if (logoutBtn) {
    sessionStorage.removeItem("currentUser");
    location.href = "login.html";
  }
});

const createUserInfo = (liveUserData) => {
  let userDetailedElement = document.querySelector(".user-detailed-info");
  userDetailedElement.innerHTML = `
     <div class="email-section">
        <i class="fa-solid fa-circle-user"></i>
        <span class="email">${liveUserData.name}</span>
    </div>
    <span class="role">Role: <strong>${liveUserData.role}</strong></span>
    <i class="fa-solid fa-arrow-right-from-bracket" id="logoutIcon"></i>
    `;
};

createUserInfo(currentUser());

const useElectionCreationModelContent = () => {
  modelContent.innerHTML = `
    <div class="header-model">
    <span class="election-title-text">New Election</span>
    <i class="fa-solid fa-close" id="close-model"></i>
    </div>
    <form class="election-form">
    <div class="form-group election-title">
    <label for="title">Title</label>
    <input type="text" id="election-title-field" />
    </div>
    <div class="form-group election-description">
    <label for="description">Description</label>
    <input type="text" id="election-description-field"/>
    </div>
    <div class="election-date-container">
    <div class="form-group election-starting-date">
    <label for="starting-date">Start Date</label>
    <input type="date" id="election-start-date-field" required/>
    </div>
    <div class="form-group election-end-date">
    <label for="end-date">End Date</label>
    <input type="date" id="election-title-end-date-field" required/>
    </div>
    </div>
  <button type="submit" class="save-election" id="create-election">
    Save Election
    </button>
</form>

`;
};

const recordElection = (elTitle, elDecription, elStartDate, elEndDate) => {
  let electionRecord = {
    id: `el${crypto.randomUUID()}`,
    createdAt: new Date().toDateString(),
    createdBy: currentLiveUser.uId,
    status: electionStatusLogic(new Date(elStartDate).setHours(0,0,0,0), new Date(elEndDate).setHours(23,59,59,999)),
    elTitle,
    elDecription,
    elStartDate: elStartDate,
    elEndDate: elEndDate
  };

  const currentElections = get("elections") || [];
  currentElections.push(electionRecord);
  set("elections", currentElections);
  successAlertMessage("Election Created Successfully.");

  // hide model
  overlayRemoveFn();
  renderAvailableElection();
  countCurrentlyOpenElections();
  countAllElections();
  //start render availbale elections //
};

const implementUpateElectionTask = (id) => {
  let currentElections = getAllElections();
  let editedElection = currentElections.find((el) => el.id == id);
  let electionTitle = modelContent.querySelector("#election-title-field");
  let electionDescription = modelContent.querySelector(
    "#election-description-field",
  );
  let electionStartDate = modelContent.querySelector(
    "#election-start-date-field",
  );
  let electionEndDate = modelContent.querySelector(
    "#election-title-end-date-field",
  );

  editedElection.elTitle = electionTitle.value;
  editedElection.elDecription = electionDescription.value;
  editedElection.elStartDate = electionStartDate.value;
  editedElection.elEndDate = electionEndDate.value;
  editedElection.status = electionStatusLogic(new Date(electionStartDate.value).setHours(0,0,0,0), new Date(electionEndDate.value).setHours(23,59,59,999));


  
  set("elections", currentElections);

  successAlertMessage(`You edited ${editedElection.elTitle} successfully.`);

  overlayRemoveFn();
  renderAvailableElection();
  countCurrentlyOpenElections();
};

const validateFormUpdate = () => {
  let electionTitle = modelContent.querySelector("#election-title-field");
  let electionDescription = modelContent.querySelector(
    "#election-description-field",
  );
  let electionStartDate = modelContent.querySelector(
    "#election-start-date-field",
  );
  let electionEndDate = modelContent.querySelector(
    "#election-title-end-date-field",
  );

  if (!electionTitle || !electionStartDate || !electionEndDate) {
    console.error("One or more form fields were not found in the DOM.");
    return;
  }

  if (!electionTitle.value.trim()) {
    alert("Sorry, elections must have a title");
    return;
  }

  if (!electionDescription.value.trim()) {
    alert("Sorry, elections must also have description");
    return;
  }

  if (electionEndDate.value < electionStartDate.value) {
    alert("Sorry, election end date must be after date of election start");
    return;
  }

  //   display the prvious input records/value //
  implementUpateElectionTask(
    modelContent.querySelector(".election-update-form").getAttribute("dataset"),
  );
};




const validateElectionData = () => {
  let electionTitle = modelContent.querySelector("#election-title-field");
  let electionDescription = modelContent.querySelector(
    "#election-description-field",
  );
  let electionStartDate = modelContent.querySelector(
    "#election-start-date-field",
  );
  let electionEndDate = modelContent.querySelector(
    "#election-title-end-date-field",
  );

  if (!electionTitle || !electionStartDate || !electionEndDate) {
    console.error("One or more form fields were not found in the DOM.");
    return;
  }

  if (!electionTitle.value.trim()) {
    alert("Sorry, elections must have a title");
    return;
  }

  if (!electionDescription.value.trim()) {
    alert("Sorry, elections must also have description");
    return;
  }

  if (electionStartDate.value < new Date().toISOString().slice(0, 10)) {
    alert("sorry, election cannot be past date");
    return;
  }
  if (electionEndDate.value < electionStartDate.value) {
    alert("Sorry, election end date must be after date of election start");
    return;
  }
  recordElection(
    electionTitle.value,
    electionDescription.value,
    electionStartDate.value,
    electionEndDate.value,
  );
};

document.addEventListener("submit", async (e) => {
  let electionForm = e.target.closest(".election-form");
  let updateForm = e.target.closest(".election-update-form");
  let candidateForm = e.target.closest(".candidate-form");
  let updateCandidateForm = e.target.closest(".update-candidate-form");

  if (electionForm) {
    e.preventDefault();
    validateElectionData();
  }

  if (updateForm) {
    e.preventDefault();
    implementUpdatElectionForm();
  }

  if(candidateForm){
    e.preventDefault();
    const candidateImageFile = candidateForm.querySelector('input[type = "file"]');
        function imageToBase64(file) {
          return new Promise((resolve, reject) => {
              const reader = new FileReader();

              reader.readAsDataURL(file);

              reader.onload = () => {
                  resolve(reader.result);
              };

              reader.onerror = (error) => {
                  reject(error);
              };
          });
      }
    const base64ImageFile = await imageToBase64(candidateImageFile.files[0]);
    implementCandidateManagment(base64ImageFile);
  }

  if(updateCandidateForm){
    e.preventDefault();
     const candidateImageFile = updateCandidateForm.querySelector('input[type = "file"]');
          function imageToBase64(file) {
          return new Promise((resolve, reject) => {
              const reader = new FileReader();

              reader.readAsDataURL(file);

              reader.onload = () => {
                  resolve(reader.result);
              };

              reader.onerror = (error) => {
                  reject(error);
              };
          });
      }

    const base64ImageFile = await imageToBase64(candidateImageFile.files[0]);
    implementUpdateCandidateInfo(base64ImageFile);
  }
});

// delete election function//

const implementDeleteElection = (id) => {
  let currentElection = getAllElections();
  let updatedElections = currentElection.filter((el) => el.id !== id);

  set("elections", updatedElections);
  countAllElections();
  // close modal //
  overlayRemoveFn();
  successAlertMessage(
    `you deleted election : ${currentElection.filter((el) => el.id == id).map((e) => e.elTitle)}`,
  );

//   also delete all candidates Related to deleted election and votes also //


let allCandidates = getAllcandidates();
let updatedCandidates = allCandidates.filter(c => c.electionId !== id);
set("candidates", updatedCandidates);

//delete votes realted to this election also //

const allVotes = getAllVotes();
let updatedVotes = allVotes.filter(vt => vt.electionId !== id);

set("votes", updatedVotes);

countAllCandidates();
countVoteCasted();

};
const handleDeleteLogic = (elId) => {
  openOverlayModal();
  modelContent.innerHTML = `
    <div class="modal-popup-ask">
        <p>Are you sure to permenently delete this election, <strong>candidates, votes will also be removed</strong></</p>
        <div class ="modal-action-btns">
            <button class ="no-btn" dataset="${elId}">No</button>
            <button class ="yess-btn" dataset="${elId}">Yes</button>
        </div>
    </div>
    
    `;
};

const implementUpdatElectionForm = () => {
  let updateFormElection = modelContent.querySelector(".election-update-form");
  validateFormUpdate();
};

const handleEditLogic = (elId) => {
  openOverlayModal();
  modelContent.innerHTML = `
    <div class="header-model">
  <span class="election-title-text">Update Election</span>
  <i class="fa-solid fa-close"></i>
</div>
<form class="election-update-form" dataset="${elId}">
  <div class="form-group election-title">
    <label for="title">Title</label>
    <input type="text" id="election-title-field" />
  </div>
  <div class="form-group election-description">
    <label for="description">Description</label>
    <input type="text" id="election-description-field" />
  </div>
  <div class="election-date-container">
    <div class="form-group election-starting-date">
      <label for="starting-date">Start Date</label>
      <input type="date" id="election-start-date-field" />
    </div>
    <div class="form-group election-end-date">
      <label for="end-date">End Date</label>
      <input type="date" id="election-title-end-date-field" />
    </div>
  </div>
  <button type="submit" class="update-election" id="update-election">
    Update Election
  </button>
</form>
    
    `;
};

const putBackFieldvalue = (id) => {
  let electionEdit = getAllElections().find((el) => el.id == id);
  let { elTitle, elDecription, elStartDate, elEndDate } = electionEdit;

  let electionTitle = modelContent.querySelector("#election-title-field");
  let electionDescription = modelContent.querySelector(
    "#election-description-field",
  );
  let electionStartDate = modelContent.querySelector(
    "#election-start-date-field",
  );
  let electionEndDate = modelContent.querySelector(
    "#election-title-end-date-field",
  );

  electionTitle.value = elTitle;
  electionDescription.value = elDecription;
  electionStartDate.value = elStartDate;
  electionEndDate.value = elEndDate;
};

// manage Btn

const handleManageElectionLogic = (id, title) => {
  openOverlayModal();
  modelContent.innerHTML = `
    
    <div class="header-model">
       <div class = "manage-election-header" style ="display:flex; flex-direction:column; gap : 0.5rem">
       <p class="candidate-title"> Manage — <span class="election_name">${title}</span></p>
       <p style ="font-size:0.9rem; font-weight:bold"> Add New Candidate</p>
       </div>
       <i class="fa-solid fa-close"></i>
  </div>
<form class="candidate-form" dataset="${id}">
  <div class="form-group candidate-name">
    <label for="title">Name</label>
    <input type="text" id="candidate-name" required />
  </div>
  <div class="form-group candidate-email">
    <label for="title">Email</label>
    <input type="email" id="candidate-email" required />
  </div>
  <div class="form-group candidate-bio">
    <label for="bio">Brief Bio</label>
    <input type="text" id="candidate-bio-field" required />
  </div>
  <div class="form-group candidate-picture">
    <label for="bio">Upload Candidate Image</label>
    <input type="file" id="candidate-image-field" required />
  </div>
  <button type="submit" class="candidate-add" id="create-candidate">
    Add Candidate
  </button>
</form>

   <ul class="created-candidate-list">

   </ul>
    `;
};


// candidates logic





const recordNewCandidate = (canName, canEmail,candBio, id,candidateImage) => {
    let candidateInfo = {
      candidateId : `can${crypto.randomUUID()}`,
      electionId : id,
      canName,
      canEmail,
      candBio,
      candidateImage  
    }

    // push the candidate to localstorage //
    const allCandidates = getAllcandidates();
    allCandidates.push(candidateInfo);
    set("candidates", allCandidates);

    successAlertMessage(`you added candidat to ${getAllElections().find(e => e.id == id).elTitle}`);

    overlayRemoveFn();
    countAllCandidates();
    renderAvailableElection();
}

const implementCandidateManagment = (base64image) => {
    let id = modelContent.querySelector(".candidate-form").getAttribute("dataset");
    let candidateNameField = modelContent.querySelector("#candidate-name");
    let candidateEmail = modelContent.querySelector("#candidate-email")
    let candidateBio = modelContent.querySelector("#candidate-bio-field");
    let candidateImage = modelContent.querySelector("#candidate-image-field");

    if(!candidateNameField.value.trim()){
        alert("Candidate name is required");
        return;
    }
    if(!candidateBio.value.trim()){
        alert("Candidate bio is required");
        return;
    }

       const allowedFileTypes = ["image/png", "image/jpeg"];

    if(candidateImage.files[0].type.startsWith("image/")){
        if(allowedFileTypes.includes(candidateImage.files[0].type)) {
        }else{
            alert("Image extension must be either jpg or png.");
            return;
        }
    }else{
        alert("please, upload img file.");
        return;
    }
  
    recordNewCandidate(candidateNameField.value, candidateEmail.value, candidateBio.value, id, base64image)
    
}

const putBackCandidateFieldValues = can => {
    let candidateNameField = modelContent.querySelector("#candidate-name");
    let candidateEmailField = modelContent.querySelector("#candidate-email");
    let candidateBioField = modelContent.querySelector("#candidate-bio-field");

    candidateNameField.value = can.canName;
    candidateEmailField.value = can.canEmail;
    candidateBioField.value = can.candBio;
}

const implementUpdateCandidateInfo = (base64can) => {
    let currentCandiateId = modelContent.querySelector(".update-candidate-form").getAttribute("dataset");
    let candidateNameField = modelContent.querySelector("#candidate-name");
    let candidateEmailField = modelContent.querySelector("#candidate-email");
    let candidateBioField = modelContent.querySelector("#candidate-bio-field");

    if(!candidateNameField.value.trim()){
        alert("Candidate Name cannot be empty.");
        return;
    }
    if(!candidateBioField.value.trim()){
        alert("please put some bio about the candidate");
        return;
    }

    let allCandidates = getAllcandidates();

    let editedCandidate = allCandidates.find(can => can.candidateId == currentCandiateId);
    editedCandidate.canName = candidateNameField.value;
    editedCandidate.canEmail = candidateEmailField.value;
    editedCandidate.candBio = candidateBioField.value;
    editedCandidate.candidateImage = base64can;

    set("candidates", allCandidates);

    overlayRemoveFn();
    successAlertMessage("candidate updated successfully.");
    renderAvailableElection();
}

const implementEditCandiateLogic = can => {
    modelContent.innerHTML = `
    <div class="header-model">
       <div class = "manage-election-header" style ="display:flex; flex-direction:column; gap : 0.5rem">
       <p class="candidate-title">Update Candidate Info</p>
       </div>
       <i class="fa-solid fa-close"></i>
  </div>
<form class="update-candidate-form" dataset="${can.candidateId}">
  <div class="form-group candidate-name">
    <label for="title">Name</label>
    <input type="text" id="candidate-name" required />
  </div>
  <div class="form-group candidate-email">
    <label for="title">Email</label>
    <input type="email" id="candidate-email" required />
  </div>
  <div class="form-group candidate-bio">
    <label for="bio">Brief Bio</label>
    <input type="text" id="candidate-bio-field" required />
  </div>
  <div class="form-group candidate-picture">
    <label for="bio">Upload Candidate Image</label>
    <input type="file" id="candidate-image-field" required />
  </div>
  <button type="submit" class="candidate-add" id="create-candidate">
    Save Candidate
  </button>
</form>
    
    
    `

    putBackCandidateFieldValues(can)
}


const deleteCandidateTask = (id) => {
    let allCandidates = getAllcandidates();
    let updatedCandidates = allCandidates.filter(cand => cand.candidateId !== id);

    set("candidates", updatedCandidates);

    overlayRemoveFn();
    successAlertMessage("Deleted Candidate.");


    // delete votes related to this candidate also //

    let votes = getAllVotes();
    let updatedVotes = votes.filter(vote => vote.candidateId !== id);
    set("votes", updatedVotes);

    countAllCandidates();
    countVoteCasted();
    renderAvailableElection();
}

const implementDeleteCandidate = id => {
    modelContent.innerHTML = `

    <div class="modal-popup-ask">
        <p >Are you sure to permenently delete Candidate <strong>${getAllcandidates().find(ca => ca.candidateId == id).canName} and votes casted</strong></</p>
        <div class ="modal-action-btns">
            <button class ="no-btn" dataset="${id}">No</button>
            <button class ="yess-btn" dataset="${id}">Yes</button>
        </div>
    </div>
    
    `

}

const handleEventsOnCandidateList = (can, candidateDom) => {
    let editBtn = candidateDom.querySelector("#edit-candidate");
    let removeBtn = candidateDom.querySelector("#delete-candidate");

    editBtn.addEventListener("click", () => {
        implementEditCandiateLogic(can);
    });

    removeBtn.addEventListener("click", () => {
        implementDeleteCandidate(can.candidateId);
    })
}

const renderCandidate = can => {
    let candidateListItem = document.createElement("li");

    candidateListItem.className = "candidate-list-item";
    candidateListItem.innerHTML = `

    <p class ="can-name">${can.canName}</p>
    <div class ="candidate-control">
        <i class ="fa-solid fa-edit" id ="edit-candidate"></i>
        <i class ="fa-solid fa-trash" id ="delete-candidate"></i>
    </div>
    
    `

    document.querySelector(".created-candidate-list").append(candidateListItem);
    
    handleEventsOnCandidateList(can, candidateListItem);
}

const loadAllCandidates = id => {
    let allCandiatesMatchesElections = getAllcandidates().filter(c => c.electionId == id);
    let candidateListContainer = document.querySelector(".created-candidate-list");

    if(!allCandiatesMatchesElections.length){
        candidateListContainer.innerHTML = `
        <p class ="no-candidate">No candidates recorded here.</p>
        `
        return;
    }


    allCandiatesMatchesElections.forEach(cand => {
        renderCandidate(cand);
    })
}

// elections logic functions //


const electionStatusLogic = (startDate,endDate) => {
    let today = new Date().setHours(0,0,0,0);
    let status;
  if(today < startDate){
    status = "upcoming";
}
else if(today >= startDate && today <= endDate){
    status = "open";
}
else{
    status = "closed";
}

return status;

}


const handleElectionEvents = (electionSourceData, electionDomElement) => {
  let manageBtn = electionDomElement.querySelector(".manage-election");
  let deleteElectionBtn = electionDomElement.querySelector(".delete-election");
  let ediElectionBtn = electionDomElement.querySelector(".edit-election");
  // delete election logic
  deleteElectionBtn.addEventListener("click", () => {
    handleDeleteLogic(electionSourceData.id);
  });

  ediElectionBtn.addEventListener("click", () => {
    handleEditLogic(electionSourceData.id);
    putBackFieldvalue(electionSourceData.id);
  });

  manageBtn.addEventListener("click", () => {
    handleManageElectionLogic(electionSourceData.id,electionSourceData.elTitle);
    loadAllCandidates(electionSourceData.id);
  });
};

const loadAvailableElections = (election) => {
  let electionElementParent = document.createElement("div");
  electionElementParent.className = "election";
  electionElementParent.innerHTML = `
    <div class="election-header">
    <span class="election-status ${election.status == "closed" ? "closed" : election.status == "upcoming" ? "upcoming" : "open"}">${election.status == "closed" ? "closed" : election.status == "upcoming" ? "upcoming" : "open"}</span>
                    <p class="election-title">${election.elTitle}</p>
                    </div>
                <div class="election-body">
                <p class="election-description">${election.elDecription}</p>
                </div>
                <div class="election-bottom">
                <i class ="${election.status == "upcoming" ? "fa-solid fa-calendar" : election.status == "closed" ? "fa-solid fa-lock" : ""}" id ="status-icon"></i>
                <div class="election-detail">
                <span class="ele-date"><i class="fa-solid fa-calendar"></i> ${election.createdAt}</span>
                        <p class="candidates">
                        <i class="fa-solid fa-people-line"></i><span class="cand-count"> ${getAllcandidates().filter(can => can.electionId == election.id).length} </span>Candidates
                        </p>
                        <p class="votes">
                            <i class="fa-solid fa-check-to-slot"> </i><span class="vote-count"> ${getAllVotes().filter(can => can.electionId == election.id).length} </span>votes
                            </p>
                            </div>
                    <div class="election-control">
                        <button class="manage-election el-btn">Manage</button>
                        <button class="edit-election el-btn">Edit</button>
                        <button class="delete-election el-btn">Delete</button>
                    </div>
                    <div class ="view-result-container">
                    <i class="fa-solid fa-square-poll-horizontal"></i>
                    <a href="result.html?id=${election.id}"><strong>View Result</strong></a>
                    </div>
                    </div>
                `;
  electionContainerList.append(electionElementParent);
  handleElectionEvents(election, electionElementParent);
};

// render availbale elections
const renderAvailableElection = () => {
  const elections = getAllElections();
  electionContainerList.innerHTML = "";
  if (!elections.length) {
    electionContainerList.innerHTML = `
            <div class="election-place-holder">
            <h2>No elections yet</h2>
            <p>Create your first election.</p>
            </div>
        `;
    return;
  }
  elections.forEach((element) => {
    loadAvailableElections(element);
  });
};

renderAvailableElection();
// model logic //

electionCreationBtn.addEventListener("click", () => {
  overlay.classList.add("active");
  document.body.classList.add("active");
  useElectionCreationModelContent();
});

const overlayRemoveFn = () => {
  overlay.classList.remove("active");
  document.body.classList.remove("active");
};

modelContent.addEventListener("click", (e) => {
  let closeModelIcon = e.target.closest(".fa-solid.fa-close");
  let yessBtn = e.target.closest(".yess-btn");
  let noBtn = e.target.closest(".no-btn");

  if (closeModelIcon || noBtn) {
    overlayRemoveFn();
  }

  if (yessBtn) {
    implementDeleteElection(yessBtn.getAttribute("dataset"));
    deleteCandidateTask(yessBtn.getAttribute("dataset"));    

  }

});

window.onclick = (e) => {
  if (e.target == overlay) {
    overlayRemoveFn();
  }
};

const openOverlayModal = () => {
  overlay.classList.add("active");
  document.body.classList.add("active");
};


