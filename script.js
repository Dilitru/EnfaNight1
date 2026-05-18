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
attachDelayedNavigation('image-button', 'waitPage');
attachDelayedNavigation('yesPlayButton', 'questionCard');
attachDelayedNavigation('yesButton', 'answerSubmittedCard');
attachDelayedNavigation('proceedButton', 'commitmentCard');
attachDelayedNavigation('commitmentYesButton', 'revealCard');

const brainBtn = document.querySelector('.brainButton img');
const instruction = document.querySelector('.entranceInstruction');
const logo = document.querySelector('.bflixLogo');
const entranceCard = document.querySelector('.entranceCard');
const sfx = new Audio('sfx.mp3');

document.querySelector('.brainButton').addEventListener('click', () => {
  // shrink brain
  brainBtn.style.transform = 'scale(0)';
  brainBtn.style.opacity = '0';

  // fade out instruction
  instruction.style.opacity = '0';

  // play sound
  sfx.play();

  // after 0.5s, show logo + background
  setTimeout(() => {
    logo.style.opacity = '1';
    logo.style.bottom = '50%'; // move to center
    logo.style.transform = 'translateY(50%)';
    entranceCard.classList.add('bgActive');
  }, 600);

  // after 4s, switch to splashCard
  setTimeout(() => {
    hideAllCards();
    showCard("splashCard");
  }, 6000);
});
