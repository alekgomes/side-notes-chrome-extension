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
        if (!db.objectStoreNames.contains("notes")) {
            db.createObjectStore("notes", { autoIncrement: true });
        }
    };
    dbConnection.onsuccess = function (event) {
        db = event.target.result;
    };
    chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
        var _a;
        if (request.type === "saveSelection") {
            var transaction = db.transaction(["notes"], "readwrite");
            transaction.oncomplete = function (event) {
                console.log(event);
            };
            transaction.onerror = function (event) {
                console.log(event);
            };
            var objectStore = transaction.objectStore("notes");
            console.log(window.getSelection());
            var objectStoreRequest = objectStore.add({
                content: (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString(),
                data: Date.now(),
                url: window.location.href,
            });
            objectStoreRequest.onsuccess = function (e) { return console.log(e); };
            objectStoreRequest.onerror = function (e) { return console.log(e); };
        }
        if (request.type === "getData") {
            var transaction = db.transaction(["notes"], "readonly");
            var store = transaction.objectStore("notes");
            var getAllRequest = store.getAll();
            getAllRequest.onsuccess = function (e) {
                console.log(e);
                sendResponse(e.target.result);
            };
            getAllRequest.onerror = function (e) {
                sendResponse(e);
            };
            return true;
        }
        if (request.type === "deleteData") {
            var transaction = db.transaction(["notes"], "readwrite");
            var store = transaction.objectStore("notes");
            var deleteRequest = store.delete(request.payload);
            deleteRequest.onsuccess = function (e) {
                console.log(e);
                sendResponse(e);
            };
            deleteRequest.onerror = function (e) {
                console.log(e);
                sendResponse(e);
            };
            return true;
        }
    });
};
