const form = document.getElementById("search-form");
const wordInput = document.getElementById("word-input");
const resultsDiv = document.getElementById("results");
const errorDiv = document.getElementById("error-message");
const savedList = document.getElementById("saved-list");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const word = wordInput.value.trim();
  if (!word) return;

  errorDiv.textContent = "";
  resultsDiv.innerHTML = "<p>Loading...</p>";

  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );
    if (!response.ok) throw new Error("Word not found.");
    
    const data = await response.json();
    displayWordData(data[0]);
  } catch (error) {
    errorDiv.textContent = error.message;
    resultsDiv.innerHTML = "";
  }
});

function displayWordData(data) {
  const { word, phonetics, meanings } = data;

  resultsDiv.innerHTML = `
    <h2>${word} (${phonetics[0]?.text || "No pronunciation available"})</h2>
    ${meanings
      .map(
        (meaning) => `
      <div>
        <h3>${meaning.partOfSpeech}</h3>
        <p>${meaning.definitions[0]?.definition || "No definition found."}</p>
        <p><em>${meaning.definitions[0]?.example || ""}</em></p>
      </div>
    `
      )
      .join("")}
    <button onclick="saveWord('${word}')">Save Word</button>
  `;
}

function saveWord(word) {
  const li = document.createElement("li");
  li.textContent = word;
  savedList.appendChild(li);
}
