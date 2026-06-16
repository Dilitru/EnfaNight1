/*
debug switch
*/
const debug = true;
const state = null;

/*
Initialize Firebase
*/
const firebaseConfig = {
  apiKey: "AIzaSyCv6nPwgzTl7qDNSZ1MkpoGAOHyxpkKL4s",
  authDomain: "quizapp-cf724.firebaseapp.com",
  databaseURL: "https://quizapp-cf724-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "quizapp-cf724",
  storageBucket: "quizapp-cf724.firebasestorage.app",
  messagingSenderId: "948696897116",
  appId: "1:948696897116:web:8d8bf48e0b818ace0ef899",
  measurementId: "G-MLNBNFC70Y"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Define Firestore globally
const db = firebase.firestore();
if(db){console.log("Firebase initiation succesful")};
//  END OF INITILIAZE Firebase

/*
Checkpoint system
*/
// 1. Load the system
window.addEventListener('DOMContentLoaded', async () => {
  hideAllCards();

  const storedName = localStorage.getItem('userName');
  const storedTimestamp = localStorage.getItem('userNameTimestamp');

  const cutoff = new Date("2026-06-17T18:00:00").getTime();
  const debug = true; // toggle as needed

  // Step 1: Name check
  if (!storedName) {
    showCard("nameCard");
    return;
  }

  // Step 2: Cutoff check
  if (!debug) {
    if (!storedTimestamp || Number(storedTimestamp) < cutoff) {
      localStorage.removeItem('userName');
      localStorage.removeItem('userNameTimestamp');
      showCard("nameCard");
      return;
    }
  }

  // Step 3: Snapshot listener for remote status
  const docRef = db.collection("status").doc("activeCardDoc");
  docRef.onSnapshot((docSnap) => {
    if (!docSnap.exists) {
      console.error("results/main not found");
      showCard("nameCard");
      return;
    }

    let state = (docSnap.data().activeCard || "").trim();

    // Step 4: foolproofing
    if (state === "commitmentCard") {
      state = "remoteCard";
    }

    if (state == "nameCard"){
		hideAllCards();
		showCard(state);
	}

    // Step 5: round logic
    if (/^round\d+$/.test(state)) {
      const lastAnswer = localStorage.getItem("lastAnswer");

      if (lastAnswer && lastAnswer == state) {
		  hideAllCards();
        showCard("answerSubmittedCard");
        return;
      } else {
        localStorage.setItem("activeRound", state);
		hideAllCards();
		console.log("REMOTECARD LOADED");
		/*if (state == "round3" || state == "round4"){
			changeButtonImage("a-button", "a-blue.png");
			changeButtonImage("b-button", "b-blue.png");
			document.body.style.backgroundImage = "url('background.jpg')";
		} else {
			changeButtonImage("a-button", "a-green.png");
			changeButtonImage("b-button", "b-green.png");
			document.body.style.backgroundImage = "url('background-green.jpg')";
		}
        showCard("remoteCard");*/
        return;
      }
    }

    // Step 6: default
	hideAllCards();
    showCard(state);
  });
});

function changeButtonImage(buttonId, newSrc) {
  const img = document.querySelector(`#${buttonId} img`);
  if (img) {
    img.src = newSrc;
  }
}

async function fetchCurrentStatusCard(){
  hideAllCards();
  const state = await fetchStatus();
  showCard(state);
  console.log(fetchRound());
}

async function fetchStatusString(){
	const state = await fetchStatus();
	return state;
}


// Fetch status from Firestore
async function fetchStatus() {
  try {
    const docRef = db.collection("status").doc("statusDoc");
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      throw new Error("statusDoc not found");
    }

    let state = (docSnap.data().state || "").trim();

    // foolproofing: remap commitmentCard → remoteCard
    if (state === "commitmentCard") {
      return "remoteCard";
    }

    return state; // e.g. "entranceCard", "revealCard", etc.
  } catch (err) {
    console.error("Error fetching status from Firestore:", err);
    return "entranceCard"; // fallback if fetch fails
  }
}
//--- END OF INITIALIZE

/*
nameInput Card functions
*/
document.getElementById("nameSubmit").addEventListener("click", () => {
  const input = document.getElementById("nameInput").value.trim();

  if (input) {
    // Save name and timestamp
    localStorage.setItem("userName", input);
    localStorage.setItem("userNameTimestamp", Date.now().toString());

    // Hide all cards, then show splashCard
    hideAllCards();
    showCard("entranceCard");
  } else {
    alert("Please enter your name first.");
  }
});



const commitBtn = document.querySelector('.commitmentYesButton');
commitBtn.addEventListener('click', () => {
  commitBtn.classList.add('clicked');
});

// Helper: hide all cards
function hideAllCards() {
  document.querySelectorAll('.card').forEach(card => {
    card.classList.add('hidden');
  });
}

// Show a specific card by ID
function showCard(className) {
  const card = document.querySelector('.' + className);
  if (card) card.classList.remove('hidden');
}


// Utility: attach delayed navigation
function attachDelayedNavigation(className, targetId) {
  document.querySelectorAll('.' + className).forEach(btn => {
    btn.addEventListener('click', () => {
      setTimeout(() => {
        hideAllCards();
        showCard(targetId);
      }, 1500); // 2s delay
    });
  });
}

// Bind buttons to their destinations
//attachDelayedNavigation('yesPlayButton', 'remoteCard');
//attachDelayedNavigation('yesButton', 'answerSubmittedCard');
//attachDelayedNavigation('proceedButton', 'remoteCard');
//attachDelayedNavigation('yes_commitment_2', 'revealCard');
//attachDelayedNavigation('image-button', 'remoteCard');

const brainBtn = document.querySelector('.brainButton img');
const instruction = document.querySelector('.entranceInstruction');
const logo = document.querySelector('.bflixLogo');
const bgImage = document.querySelector('.bgImage');
const sfx = new Audio('sfx.mp3');

document.querySelector('.brainButton').addEventListener('click', () => {
  // shrink brain
  brainBtn.style.transform = 'scale(0)';
  brainBtn.style.opacity = '0';

  // fade out instruction
  instruction.style.opacity = '0';

  // play sound
  sfx.play();

  let start = null;
	function animateBg(timestamp) {
	  if (!start) start = timestamp;
	  const elapsed = timestamp - start;

	  // progress for horizontal movement (0 → 1 over 5s)
	  const progress = Math.min(elapsed / 5000, 1);
	  const distance = progress * 600; // move 400px to the right
	  bgImage.style.transform = `translateX(${distance}px)`;

	  // progress for opacity (0 → 1 over 1s)
	  const fadeProgress = Math.min(elapsed / 1000, 1);
	  bgImage.style.opacity = fadeProgress.toString();

	  if (progress < 1) {
		requestAnimationFrame(animateBg);
	  }
	}
	requestAnimationFrame(animateBg);

  // after 0.5s, show logo
  setTimeout(() => {
    logo.style.opacity = '1';
    logo.style.bottom = '60%';
    logo.style.transform = 'translateY(50%)';
  }, 600);

  // after 4s, switch to splashCard
  setTimeout(() => {
    hideAllCards();
    showCard("splashCard");
  }, 4000);
});


const btn = document.querySelector('.image-button');
const btnImg = btn.querySelector('img');

const pingSound = new Audio('pingSound.mp3');

btn.addEventListener('click', () => {

  pingSound.currentTime = 0; // reset to start if pressed rapidly
  pingSound.play();

  // Grow then shrink back
  btnImg.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(1.2)' },
    { transform: 'scale(1)' }
  ], {
    duration: 400,
    easing: 'ease-in-out'
  });

  // Create ghost copy
  const ghost = btnImg.cloneNode(true);
  ghost.style.position = 'absolute';
  ghost.style.left = '50%';
  ghost.style.top = '50%';
  ghost.style.transform = 'translate(-50%, -50%)';
  ghost.style.pointerEvents = 'none';
  ghost.style.opacity = '1';
  btn.appendChild(ghost);

  // Animate ghost upward + fade out
  ghost.animate([
    { transform: 'translate(-50%, -50%) scale(.5)', opacity: 1 },
    { transform: 'translate(-50%, -150%) scale(.5)', opacity: 0 }
  ], {
    duration: 800,
    easing: 'ease-out'
  });

  // Remove ghost after animation
  setTimeout(() => ghost.remove(), 800);

  // Extra feature: after 2 seconds, hide all cards and show waitPage
  setTimeout(() => {
    hideAllCards();
    showCard("waitPage");
  }, 2000);
});


// helper to spawn particles
function spawnParticles(x, y, parent) {
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    parent.appendChild(particle);

    // random angle + distance
    const angle = Math.random() * 2 * Math.PI;
    const distance = 40 + Math.random() * 40;

    // animate outward + fade
    particle.animate([
      { transform: `translate(${x}px, ${y}px) scale(1)`, opacity: 1 },
      { transform: `translate(${x + Math.cos(angle) * distance}px, ${y + Math.sin(angle) * distance}px) scale(0.5)`, opacity: 0 }
    ], {
      duration: 600,
      easing: 'ease-out'
    });

    // remove after animation
    setTimeout(() => particle.remove(), 600);
  }
}

// preload reveal sound
const reveal = new Audio('reveal.mp3'); // replace with your actual audio file

/*document.querySelector('.yes_commitment_2').addEventListener('click', async () => {
  const status = await fetchStatus(); // get current state string

  if (status !== "revealCard") {
    // do nothing if not revealCard
	const btnImg = document.querySelector('.yes_commitment_2 img');
	  btnImg.animate([
		{ transform: 'scale(1)' },
		{ transform: 'scale(2)' },
	  ], {
		duration: 100
	  });
    return;
  }

  // play sound
  reveal.currentTime = 0;
  reveal.play();

  // grow then shrink animation
  const btnImg = document.querySelector('.yes_commitment_2 img');
  btnImg.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(2)' },
    { transform: 'scale(2)' },
  ], {
    duration: 10000
  });

  // particle explosion centered on button
  const rect = btnImg.getBoundingClientRect();
  const x = 25;   // adjust offsets to taste
  const y = -80;
  spawnParticles(x, y, document.querySelector('.yes_commitment_2'));

  // after 4 seconds, switch to revealCard
  setTimeout(() => {
	  hideAllCards();
    showCard("revealCard");
  }, 3000);
});

document.querySelector('.yes_commitment_2').addEventListener('click', async () => {
  reveal.currentTime = 0;
  reveal.play();
  hideAllCards();
  showCard("answerSubmittedCard");
});*/

const splashCard = document.querySelector('.splashCard');

function animateBackground() {
  let offset = 0;

  function step() {
    offset -= 0.5; // speed of upward scroll (pixels per frame)
    splashCard.style.backgroundPosition = `center ${offset}px`;
    requestAnimationFrame(step);
  }

  step();
}

window.addEventListener('DOMContentLoaded', () => {
  animateBackground();
});

//--- remoteCard ---
// Attach listeners
document.getElementById("a-button").addEventListener("click", () => {
  submitVote("A");
});
document.getElementById("b-button").addEventListener("click", () => {
  submitVote("B");
  
});

async function submitVote(answer) {
  try {
    // Check 1: Username exists
    const userName = localStorage.getItem("userName");
    if (!userName) {
      throw new Error("No userName found in localStorage.");
    }

    // Check 2: activeCard doesn't match lastAnswer (prevent double-voting)
    const statusSnap = await db.collection("status").doc("activeCardDoc").get();
    if (!statusSnap.exists) {
      throw new Error("Could not retrieve active card status.");
    }
    const activeCard = (statusSnap.data().activeCard || "").trim();
    const lastAnswer = localStorage.getItem("lastAnswer");

	if (activeCard == "round3" || state == "round4"|| state == "round2"){
			changeButtonImage("a-button", "a-blue.png");
			changeButtonImage("b-button", "b-blue.png");
			document.body.style.backgroundImage = "url('background.jpg')";
		} else {
			changeButtonImage("a-button", "a-green.png");
			changeButtonImage("b-button", "b-green.png");
			document.body.style.backgroundImage = "url('background-green.jpg')";
		}

    if (activeCard === lastAnswer) {
      console.warn("Vote already submitted for this round. Skipping.");
	  hideAllCards();
	  document.getElementById("answerSubmittedCardText").textContent = "You already have answered for this round.";
      showCard("answerSubmittedCard");
      return;
    }

    // All checks passed — proceed
    localStorage.setItem("lastAnswer", activeCard);
	document.getElementById("debugMessage").textContent = "" + lastAnswer;
    hideAllCards();
	document.getElementById("answerSubmittedCardText").textContent = "Input received!";
    showCard("answerSubmittedCard");

    // References
    const voteRef = db.collection("submissions").doc(userName);
    const resultsRef = db.collection("results").doc("main");

    // Write the vote
    await voteRef.set({
      userName,
      choice: answer,
      timestamp: Date.now()
    });

    // Increment the tally
    await resultsRef.update({
      [answer]: firebase.firestore.FieldValue.increment(1),
      latestUser: userName
    });

    console.log("Vote submitted successfully!");
  } catch (err) {
    console.error("Error submitting vote:", err);
    alert("There was a problem submitting your vote. Please try again.");
  }
}

async function fetchRound() {
  if (debug) {
    let currentRound = localStorage.getItem("currentRound");
    if (!currentRound) {
      localStorage.setItem("currentRound", "round1");
      currentRound = "round1";
    }
    return currentRound;
  } else {
    return await fetchStatusString();
  }
}

function advanceRound() {
  let currentRound = localStorage.getItem("currentRound");

  if (!currentRound) {
    currentRound = "round1";
  }

  // Extract number from "roundX"
  const match = currentRound.match(/^round(\d+)$/);
  if (match) {
    const nextNum = parseInt(match[1], 10) + 1;
    const nextRound = `round${nextNum}`;
    localStorage.setItem("currentRound", nextRound);
    return nextRound;
  } else {
    // fallback if format is wrong
    localStorage.setItem("currentRound", "round1");
    return "round1";
  }
}

function saveLatestAnswer() {
  const activeRound = localStorage.getItem("activeRound");

  if (activeRound) {
    localStorage.setItem("lastAnswer", activeRound);
    console.log(`Saved latestAnswer: ${activeRound}`);
  } else {
    console.warn("No activeRound found in localStorage.");
  }
}


//--- END OF REMOTE CARD ---



//--- Reset button ---
document.getElementById("resetButton").addEventListener("click", () => {
  localStorage.removeItem("userName");
  localStorage.removeItem("userNameTimestamp");
  localStorage.removeItem("currentRound");
  alert("App has been reset.");
  location.reload();
});
//END OF RESET BUTTON

// ANSWER SUBMITTED CARD
const card = document.querySelector('.answerSubmittedCard');

const observer = new MutationObserver(() => {
  const isVisible = !card.classList.contains('hidden') && card.style.display !== 'none';
  
  if (isVisible) {
    setTimeout(() => {
      card.classList.add('hidden'); // or however you hide it
      showCard("remoteCard");
    }, 5000);
  }
});

observer.observe(card, { attributes: true, attributeFilter: ['class', 'style'] });
//END OF ANSWER SUBMITTED

document.getElementById("yesPlayButton").addEventListener("click", () => {
  document.body.style.backgroundImage = "url('background-green.jpg')";
  hideAllCards();
  showCard("remoteCard");
});