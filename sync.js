const backendURL = "https://script.google.com/a/macros/datail.in/s/AKfycbw4fymgtBoaXbVJgIdrfww6WBdO1Y3CrkLZT2gZq97mWcLrUo2pCw9d_0uteq9tkLE/exec";

window.addEventListener("online", syncToServer);


function syncToServer() {
  const openReq = indexedDB.open("activityFormDB", 1);
  openReq.onsuccess = () => {
    const db = openReq.result;
    const tx = db.transaction("submissions", "readwrite");
    const store = tx.objectStore("submissions");
    console.log("Syncing data to Google Forms:", formData);
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
