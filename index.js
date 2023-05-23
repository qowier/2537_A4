const setup = () => {
  let firstCard = undefined;
  let secondCard = undefined;
  let flippedCards = 0; // Keep track of the number of flipped cards
  let clicksCount = 0; // Keep track of the number of clicks
  let timer = 0; // Keep track of the time elapsed
  let timerInterval = null; // Reference to the interval for updating the timer
  let matchedPairs = 0; // Number of matched pairs
  const totalPairs = $(".card").length / 2; // Total number of pairs

  //Start setup with cards unclickable
  $(".card").off("click");
  $("#totalPairs").text(`Total Pairs: ${totalPairs}`);

  $("#start").on("click", function () {
    console.log("start clicked");
    createTimer();
    $(".card").on(("click"), function () {
      // Update the number of flipped cards
      flippedCards += 1;
  
      // Corner case 1: If the user clicks on the same card twice, do nothing
      if ($(this).hasClass("flip")) {
        console.log("clicked on a flipped card");
        return;
      }
  
      // Corner case 2: If the user clicks on a card that is already matched, do nothing
      if ($(this).hasClass("matched")) {
        console.log("clicked on a matched card");
        return;
      }
  
      // Corner case 3: If the user clicks on a card while two cards are already flipped, do nothing
      if (flippedCards > 2) {
        flippedCards = 0;
        return;
      }
  
      // Flip the card
      $(this).toggleClass("flip");
  
      //Update click count
      clicksCount += 1;
      $("#clicks").text(`Clicks: ${clicksCount}`);
  
      // Check if the user has flipped two cards
      if (!firstCard) {
        firstCard = $(this).find(".front_face")[0];
        console.log("logged first card" + firstCard.src);
      } else {
        secondCard = $(this).find(".front_face")[0];
        console.log("logged second card" + secondCard.src);
        checkMatch(firstCard, secondCard);
        firstCard = undefined;
        secondCard = undefined; 
      }
      // Check if all cards have been matched
      if ($(".card.matched").length === $(".card").length) {
        console.log("Win condition checked");
        // All cards have been matched, display win alert
        clearInterval(timerInterval); // Stop the timer
        setTimeout(() => {
          alert(`Congratulations! You won in ${timer} seconds with ${clicksCount} clicks.`);
        }, 750);}
    });
  });

  $("#reset").on("click", function () {
    console.log("reset clicked");
    $(".card").off("click");
    resetGame();
  });

  //Checks if cards are matching
  function checkMatch(firstCard, secondCard) {
    if (firstCard && secondCard && firstCard.src == secondCard.src) {
      console.log("match");
      $(`#${firstCard.id}`).parent().addClass("matched");
      $(`#${secondCard.id}`).parent().addClass("matched");
      matchedPairs = $(".card.matched").length / 2;
      $("#matchedPairs").text(`Matched: ${matchedPairs}`);
    } else {
      console.log("no match");
      setTimeout(() => {
        $(`#${firstCard.id}`).parent().toggleClass("flip");
        $(`#${secondCard.id}`).parent().toggleClass("flip");
      }, 1000);
    }
  }

  // Create singleton timer
  function createTimer() {
    if (!timerInterval) {
      console.log("Timer is created.");
      timerInterval = setInterval(updateTimer, 1000);
    }
  };

  // Helper to update timer
  function updateTimer() {
    timer++;
    $('#timer').text(`Time: ${timer}s`);
  };
  
  // Reset game
  function resetGame() {
    // Clear the timer interval
    clearInterval(timerInterval);

    // Reset all the necessary variables and elements
    firstCard = undefined;
    secondCard = undefined;
    flippedCards = 0;
    clicksCount = 0;
    timer = 0;
    timerInterval = null;
    matchedPairs = 0;

    // Reset cards flips
    $(".card").removeClass("flip");
    $(".card").removeClass("matched");

    // Reset display values of click count and timer
    $("#clicks").text("Clicks: 0");
    $("#timer").text("Time: 0s");
    $("#matchedPairs").text("Matched: 0");
  }
};


$(document).ready(setup);
