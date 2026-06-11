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
function listenToRound1WithTimeout(ms) {
  const round1Ref = db.collection("results").doc("round1");

  const unsubscribe = round1Ref.onSnapshot((docSnap) => {
    if (docSnap.exists) {
      const data = docSnap.data();
      const aVotes = data.A || 0;
      const bVotes = data.B || 0;
      const total = aVotes + bVotes;

      const barA = document.getElementById("barA");
      const barB = document.getElementById("barB");
      const labelA = document.getElementById("labelA");
      const labelB = document.getElementById("labelB");

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
    } else {
      console.log("No results document for round1 yet.");
    }
  });

  setTimeout(() => {
    unsubscribe();
    console.log("Stopped listening to round1 after", ms, "ms");
  }, ms);
}


// Run when page loads
window.addEventListener("DOMContentLoaded", () => {
  // Example: listen for 30 seconds (30000 ms)
  listenToRound1WithTimeout(30000);
});