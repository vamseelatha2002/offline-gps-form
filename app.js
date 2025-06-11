const form = document.getElementById("activityForm");
const dbName = "activityFormDB";

navigator.serviceWorker.register("sw.js");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));

  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition((pos) => {
      data.latitude = pos.coords.latitude;
      data.longitude = pos.coords.longitude;
      saveToIndexedDB(data);
    }, () => {
      data.latitude = '';
      data.longitude = '';
      saveToIndexedDB(data);
    });
  } else {
    saveToIndexedDB(data);
  }
});

function saveToIndexedDB(data) {
  const openReq = indexedDB.open(dbName, 1);
  openReq.onupgradeneeded = () => {
    openReq.result.createObjectStore("submissions", { autoIncrement: true });
  };
  openReq.onsuccess = () => {
    const db = openReq.result;
    const tx = db.transaction("submissions", "readwrite");
    tx.objectStore("submissions").add(data);
    tx.oncomplete = () => {
      document.getElementById("status").innerText = "✅ Saved locally.";
      form.reset();
    };
  };
}
const request = indexedDB.open("activityFormDB", 1);

request.onsuccess = () => {
  const db = request.result;
  const tx = db.transaction("submissions", "readonly");
  const store = tx.objectStore("submissions");
  const getAllReq = store.getAll();

  getAllReq.onsuccess = () => {
    console.log("📦 IndexedDB Records:", getAllReq.result);
  };
};

