
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
attachDelayedNavigation('yesPlayButton', 'questionCard');
attachDelayedNavigation('yesButton', 'answerSubmittedCard');
attachDelayedNavigation('proceedButton', 'commitmentCard');
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
	if (status == "revealCard") {
    // do nothing if not revealCard
		showCard("revealCard");
    return;
  }
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

document.querySelector('.yes_commitment_2').addEventListener('click', async () => {
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

window.addEventListener('DOMContentLoaded', async () => {
  hideAllCards();
  const state = await fetchStatus();
  showCard(state);
});

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
