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

// On page load: hide everything, then show splashCard
window.addEventListener('DOMContentLoaded', () => {
  hideAllCards();
  showCard("entranceCard");
});

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
attachDelayedNavigation('yes_commitment_2', 'revealCard');
attachDelayedNavigation('image-button', 'remoteCard');

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
});


// attach click handler
document.querySelector('.yes_commitment_2').addEventListener('click', () => {
  // play sound
  pingSound.currentTime = 0; // reset if clicked rapidly
  pingSound.play();

  // grow then shrink animation
  const btnImg = document.querySelector('.yes_commitment_2 img');
  btnImg.animate([
    { transform: 'scale(1)' },
    { transform: 'scale(2)' },
    { transform: 'scale(1)' }
  ], {
    duration: 400,
    easing: 'ease-in-out'
  });
});