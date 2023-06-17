window.onload = function () {
    console.log("onload from content_script.js");
    var DB_NAME = "side-notes";
    var DB_VERSION = 1;
    var db;
    var dbConnection = indexedDB.open(DB_NAME, DB_VERSION);
    dbConnection.onerror = function (e) { return console.log("ERROR:", e); };
    dbConnection.onupgradeneeded = function (event) {
        console.log("onupgradeneeded");
        db = event.target.result;
        db.createObjectStore("notes", { keyPath: "id", autoIncrement: true });
    };
    dbConnection.onsuccess = function (event) {
        db = event.target.result;
    };
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        var _a;
        console.log(request);
        if (request.type === "saveSelection") {
            var transaction = db.transaction(["notes"], "readwrite");
            transaction.oncomplete = function (event) {
                console.log(event);
            };
            transaction.onerror = function (event) {
                console.log(event);
            };
            var objectStore = transaction.objectStore("notes");
            var objectStoreRequest = objectStore.add({ content: (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString() });
            objectStoreRequest.onsuccess = function (e) { return console.log(e); };
            objectStoreRequest.onerror = function (e) { return console.log(e); };
        }
    });
};
