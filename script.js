/*
  Beginner-friendly drag-and-drop logic.
  This uses the browser's built-in Drag and Drop API.
*/

// Grab all term cards and drop zones from the page.
const termCards = document.querySelectorAll('.term-card');
const dropZones = document.querySelectorAll('.drop-zone');
const scoreText = document.getElementById('score');
const resetButton = document.getElementById('resetButton');
const termBank = document.getElementById('termBank');

// This keeps track of how many correct matches are locked in place.
let correctCount = 0;

// Save the original HTML so we can fully restore on reset.
const originalTermBankHTML = termBank.innerHTML;

// Add drag behavior to each card.
termCards.forEach((card) => {
  card.addEventListener('dragstart', (event) => {
    // Prevent dragging cards that are already locked.
    if (card.classList.contains('locked')) {
      event.preventDefault();
      return;
    }

    // Store the term name and element id in the drag data.
    event.dataTransfer.setData('text/plain', card.dataset.term);
    event.dataTransfer.setData('cardId', card.id);
  });
});

// Add drop behavior to each definition zone.
dropZones.forEach((zone) => {
  zone.addEventListener('dragover', (event) => {
    // Needed so dropping is allowed.
    event.preventDefault();
    zone.classList.add('hovered');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('hovered');
  });

  zone.addEventListener('drop', (event) => {
    event.preventDefault();
    zone.classList.remove('hovered');

    // If already solved, ignore any future drops.
    if (zone.classList.contains('correct')) {
      return;
    }

    const droppedTerm = event.dataTransfer.getData('text/plain');
    const droppedCardId = event.dataTransfer.getData('cardId');
    const droppedCard = document.getElementById(droppedCardId);
    const feedback = zone.querySelector('.feedback');

    // Compare dropped term to the correct answer stored in data-match.
    if (droppedTerm === zone.dataset.match) {
      // Correct: move card into this zone and lock it.
      zone.appendChild(droppedCard);
      droppedCard.setAttribute('draggable', 'false');
      droppedCard.classList.add('locked');
      zone.classList.add('correct');

      feedback.textContent = 'Correct';
      feedback.classList.remove('try-again-text');
      feedback.classList.add('correct-text');

      correctCount += 1;
      updateScore();
    } else {
      // Incorrect: leave card in place and show "Try again".
      feedback.textContent = 'Try again';
      feedback.classList.remove('correct-text');
      feedback.classList.add('try-again-text');
    }
  });
});

// Update score display text.
function updateScore() {
  scoreText.textContent = `${correctCount}/4 correct`;
}

// Reset everything back to the original state.
function resetActivity() {
  correctCount = 0;
  updateScore();

  // Restore term cards to the bank by resetting the original HTML.
  termBank.innerHTML = originalTermBankHTML;

  // Clear all zone states and feedback text.
  dropZones.forEach((zone) => {
    zone.classList.remove('correct', 'hovered');
    const feedback = zone.querySelector('.feedback');
    feedback.textContent = '';
    feedback.classList.remove('correct-text', 'try-again-text');
  });

  // Re-attach dragstart listeners because we replaced termBank HTML.
  const freshCards = document.querySelectorAll('.term-card');
  freshCards.forEach((card) => {
    card.addEventListener('dragstart', (event) => {
      event.dataTransfer.setData('text/plain', card.dataset.term);
      event.dataTransfer.setData('cardId', card.id);
    });
  });
}

resetButton.addEventListener('click', resetActivity);
updateScore();
