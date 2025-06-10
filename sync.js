const backendURL = "https://script.google.com/a/macros/datail.in/s/AKfycbw4fymgtBoaXbVJgIdrfww6WBdO1Y3CrkLZT2gZq97mWcLrUo2pCw9d_0uteq9tkLE/exec";
console.log("Sync function started.");

window.addEventListener("online", syncToServer);
fetch(url, requestOptions)
  .then(response => response.json())
  .then(data => console.log("Google Forms Response:", data))
  .catch(error => console.error("Error syncing data:", error));
console.error("Something went wrong:", error);

function syncToServer() {
  const openReq = indexedDB.open("activityFormDB", 1);
  openReq.onsuccess = () => {
    const db = openReq.result;
    const tx = db.transaction("submissions", "readwrite");
    const store = tx.objectStore("submissions");

    const allData = store.getAll();
    allData.onsuccess = async () => {
      const records = allData.result;
      for (const data of records) {
        const res = await fetch(backendURL, {
          method: "POST",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" }
        });
        if (res.ok) {
          store.clear(); // Clear only after successful sync
          document.getElementById("status").innerText = "✅ Synced to server!";
        }
      }
    };
  };
}
