const backendURL = "https://github.com/vamseelatha2002/offline-gps-form.git";

window.addEventListener("online", syncToServer);

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
