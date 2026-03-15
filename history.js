document.addEventListener("DOMContentLoaded", () => {

  const historyList = document.getElementById("historyList");

  let history = JSON.parse(localStorage.getItem("history")) || [];

  // Auto delete after 30 days
  const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;
  const now = Date.now();

  history = history.filter(item =>
    item.timestamp && (now - item.timestamp < ONE_MONTH)
  );

  localStorage.setItem("history", JSON.stringify(history));

  historyList.innerHTML = "";

  if (history.length === 0) {
    historyList.innerHTML = "<p>No deleted items yet.</p>";
    return;
  }

  history.forEach((item, index) => {

  const li = document.createElement("li");

  if (item.type === "note") {
    li.innerHTML = `
      <strong>📒 Note:</strong> ${item.title}<br>
      <small>${item.text}</small><br>
      <small>Deleted at: ${item.deletedAt}</small><br>
      <button onclick="deleteHistoryItem(${index})">🗑 Delete</button>
    `;
  } else {
    li.innerHTML = `
      <strong>📝 Task:</strong> ${item.text}<br>
      <small>Deleted at: ${item.deletedAt}</small><br>
      <button onclick="deleteHistoryItem(${index})">🗑 Delete</button>
    `;
  }

  historyList.appendChild(li);
});

});

function clearHistory() {
  localStorage.removeItem("history");
  location.reload();
}

function goBack() {
  window.location.href = "index.html";
}

function deleteHistoryItem(index) {

  let history = JSON.parse(localStorage.getItem("history")) || [];

  history.splice(index, 1);  // remove only that one item

  localStorage.setItem("history", JSON.stringify(history));

  location.reload();  // refresh page
}