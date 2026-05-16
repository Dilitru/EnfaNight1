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
  showCard("splashCard");
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
