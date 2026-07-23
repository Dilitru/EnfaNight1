// poll.js
// Firestore snapshot listener for results/round1 with timeout
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
    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();


/**
 * Listen to round1 results with a time limit
 * @param {number} ms - duration in milliseconds before unsubscribing
 */
let hideRespondedTimeout; // declare outside listener
let roundTimeout; // global tracker
let roundNameGlobal = ""; //round global

function listenToRound1WithTimeout(ms) {
  const round1Ref = db.collection("results").doc("main");

  const unsubscribe = round1Ref.onSnapshot((docSnap) => {
    if (docSnap.exists) {
      const data = docSnap.data();
      let aVotes = data.A || 0;
      let bVotes = data.B || 0;

      // --- Round tweaks ---
      if (aVotes > 0 || bVotes > 0) {
        if (roundNameGlobal == "round3" && aVotes >= bVotes) {
			
          bVotes = aVotes + 1;
        }
        if (roundNameGlobal == "round4" && bVotes >= aVotes) {
          aVotes = bVotes + 1;
        }
		if (roundNameGlobal == "round1" && bVotes >= aVotes) {
          aVotes = bVotes + 1;
        }
		if (roundNameGlobal == "round2" && aVotes >= bVotes) {
          bVotes = aVotes + 1;
        }if (roundNameGlobal == "round5" && bVotes >= aVotes) {
          aVotes = bVotes + 1;
        }
      }
	  console.log("Round: " + roundNameGlobal);
	  console.log("A: " + aVotes + "| B: " + bVotes); 

      const total = aVotes + bVotes;

      const barA = document.getElementById("barA");
      const barB = document.getElementById("barB");
      const labelA = document.getElementById("labelA");
      const labelB = document.getElementById("labelB");
      const statusDiv = document.querySelector(".poll-status");
      const respondedDiv = document.querySelector(".poll-responded");

      // --- percentages ---
      if (total > 0) {
        const aPercent = ((aVotes / total) * 100).toFixed(0);
        const bPercent = ((bVotes / total) * 100).toFixed(0);

        barA.style.width = aPercent + "%";
        barB.style.width = bPercent + "%";

        labelA.textContent = `A: ${aPercent}%`;
        labelB.textContent = `B: ${bPercent}%`;
      } else {
        barA.style.width = "0%";
        barB.style.width = "0%";
        labelA.textContent = "A: 0%";
        labelB.textContent = "B: 0%";
      }

      // --- status text ---
      statusDiv.textContent = "Receiving responses";

      // --- latest responder ---
      if (data.latestUser && data.latestUser.trim() !== "") {
        respondedDiv.textContent = `${data.latestUser} responded.`;
        respondedDiv.classList.remove("hidden");

        if (hideRespondedTimeout) clearTimeout(hideRespondedTimeout);
        hideRespondedTimeout = setTimeout(() => {
          respondedDiv.classList.add("hidden");
        }, 10000);
      } else {
        respondedDiv.classList.add("hidden");
      }
    } else {
      console.log("No results document for round1 yet.");
    }
  });

  // --- Resettable timer ---
  if (roundTimeout) clearTimeout(roundTimeout);
  roundTimeout = setTimeout(() => {
    const statusDiv = document.querySelector(".poll-status");
    if (statusDiv) {
      statusDiv.textContent = "Poll closed";
    }
    unsubscribe();
    console.log("Stopped listening to round1 after", ms, "ms");
  }, ms);
}



// Run when page loads
window.addEventListener("DOMContentLoaded", () => {
  //listenToRound1WithTimeout(30000); // listen for 30 seconds
});

// Admin control for splashCard button
document.getElementById("splashCard").addEventListener("click", async () => {
  try {
    const statusRef = db.collection("status").doc("activeCardDoc");;
    await statusRef.update({ activeCard: "nameCard" });
    alert("Web App reset to beginning of the program");
  } catch (err) {
    console.error("Error updating state:", err);
    alert("Failed to update state. Please try again.");
  }
});

/*
ROUND BUTTONS
*/
// Universal round starter
async function startRound(roundName, color) {
  // Hide SelectCard, show ResultCard
  document.getElementById("SelectCard").classList.add("hidden");
  document.getElementById("ResultCard").classList.remove("hidden");

  // Reset labels and bars
  document.getElementById("labelA").textContent = "A: 0%";
  document.getElementById("labelB").textContent = "B: 0%";
  document.getElementById("barA").style.width = "0%";
  document.getElementById("barB").style.width = "0%";

  // Switch button images depending on color
  document.getElementById("a-button-img").src = `a-${color}.png`;
  document.getElementById("b-button-img").src = `b-${color}.png`;

  // Change background images based on round
  document.querySelector(".poll-left").style.backgroundImage = `url('round-images/bg-a-${roundName}.jpg')`;
  document.querySelector(".poll-right").style.backgroundImage = `url('round-images/bg-b-${roundName}.jpg')`;

/*
	if (color === 'green') {
		document.getElementById('ResultCard').style.backgroundColor = '#003803';
	}
	
	if (color === "green") {
  document.getElementById('barA').style.background = 'linear-gradient(to right, #056e00, #0cba04)';
} else {
  document.getElementById('barA').style.background = 'linear-gradient(to right, #060e80, #000dbf)';
}
*/

  // Question/answer arrays
  const questions = {
    round1: "Based on what parents typically share with you, how do children usually respond in cases like this?",
    round2: "What is the best course of action that you would recommend the mom to do?",
    round3: "How familiar is this scenario in your practice?",
    round4: "What should the parents do?",
    round5: "What interventions do you think should be given to the child?"
  };

  const answers = {
    round1: { A: "Ignore parents and continue watching on their tablet", B: "Child gets irritated or dysregulated" },
    round2: { A: "Mom takes the child to the pediatrician", B: "Mom experiments with more social interactions for her child" },
    round3: { A: "Digestive discomforts such as excessive crying, gassiness and hard stools ARE NOT COMMON", B: "Digestive discomforts such as excessive crying, gassiness and hard stools ARE COMMON" },
    round4: { A: "Seek the help of the Pediatrician", B: "Continue the regular milk knowing that the transition is normal" },
    round5: { A: "Non-Pharmacologic Interventions", B: "Pharmacologic Interventions" }
  };

  // Update question and answers
  document.getElementById("question-text").textContent = questions[roundName] || "";
  document.getElementById("poll-status").textContent = "Receiving responses";
  document.getElementById("answer-text-a").textContent = answers[roundName]?.A || "";
  document.getElementById("answer-text-b").textContent = answers[roundName]?.B || "";

  try {
    const resultsRef = db.collection("results").doc("main");
    await resultsRef.set({
      A: 0,
      B: 0,
      latestUser: ""
      // no activeCard here anymore
    }, { merge: true });

    console.log(`Tallies reset for round ${roundName}`);
  } catch (err) {
    console.error("Error resetting results:", err);
  }

try {
    const statusRef = db.collection("status").doc("activeCardDoc");
    await statusRef.set({
      activeCard: roundName
    }, { merge: true });

    console.log(`Active card set to ${roundName}`);
  } catch (err) {
    console.error("Error setting activeCard:", err);
  }
  roundNameGlobal = roundName;
  listenToRound1WithTimeout(30000);
}

// Attach listeners automatically
["round1", "round2", "round3", "round4", "round5"].forEach(id => {
  const btn = document.getElementById(id);
  btn.addEventListener("click", () => {
    // roundName comes directly from the button’s ID
    // choose color based on round (example mapping)
    const color = (id === "round1" || id === "round2") ? "green" : "blue";
    startRound(id, color);
  });
});

document.getElementById("homeButton").addEventListener("click", () => {
	document.getElementById('ResultCard').style.backgroundColor = 'rgba(1, 16, 41, 1)';
  document.getElementById("SelectCard").classList.remove("hidden");
  document.getElementById("ResultCard").classList.add("hidden");
  
});


