const setup = () => {
  let firstCard = undefined;
  let secondCard = undefined;
  let flippedCards = 0; // Keep track of the number of flipped cards
  let clicksCount = 0; // Keep track of the number of clicks
  let timer = 0; // Keep track of the time elapsed
  let timerCreated = false;  // Keep track of whether the timer has been created


  $(".card").on(("click"), function () {
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

    $(this).toggleClass("flip");
    flippedCards += 1;

    //Update click count
    clicksCount += 1;
    $("#clicks").text(`Clicks: ${clicksCount}`);

    //Create timer if timer is not created.
    createTimer();

    if (!firstCard) {
      firstCard = $(this).find(".front_face")[0];
      console.log("logged first card" + firstCard.src);
    } else {
      secondCard = $(this).find(".front_face")[0];
      console.log("logged second card" + secondCard.src);

      console.log(firstCard, secondCard);
      if (firstCard && secondCard && firstCard.src == secondCard.src) {
        console.log("match");
        $(`#${firstCard.id}`).parent().off("click");
        $(`#${firstCard.id}`).parent().addClass("matched"); // Mark the cards as matched
        $(`#${secondCard.id}`).parent().off("click");
        $(`#${secondCard.id}`).parent().addClass("matched");
        firstCard = undefined;
        secondCard = undefined; 
      } else {
        console.log("no match");
        setTimeout(() => {
          $(`#${firstCard.id}`).parent().toggleClass("flip");
          $(`#${secondCard.id}`).parent().toggleClass("flip");
          firstCard = undefined;
          secondCard = undefined; 
        }, 1000);
      }
    }
  });

  // Create singleton timer
  function createTimer() {
    if (!timerCreated) {
      console.log("Timer is created.");
      setInterval(updateTimer, 1000);
      timerCreated = true;
    }
  }

  // Helper to update timer
  function updateTimer() {
    timer++;
    $('#timer').text(`Time: ${timer}s`);
  }
}

$(document).ready(setup);
