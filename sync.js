const backendURL = "https://script.google.com/a/macros/datail.in/s/AKfycbw4fymgtBoaXbVJgIdrfww6WBdO1Y3CrkLZT2gZq97mWcLrUo2pCw9d_0uteq9tkLE/exec";

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
      console.log("Syncing records:", records);

      if (records.length === 0) {
        console.log("No data to sync.");
        return;
      }

      let allSynced = true;

      for (const data of records) {
        try {
          const res = await fetch(backendURL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          });

          if (res.ok) {
            // Remove the synced item using its key
            store.delete(data.id);
          } else {
            allSynced = false;
            console.error("Failed to sync record:", data);
          }
        } catch (err) {
          allSynced = false;
          console.error("Sync error:", err);
        }
      }

      if (allSynced) {
        document.getElementById("status").innerText = "✅ All data synced!";
      } else {
        document.getElementById("status").innerText = "⚠️ Some data failed to sync.";
      }
    };
  };
}
