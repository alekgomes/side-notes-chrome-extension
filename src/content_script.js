var Actions = {
    SAVE_SELECTION: "SaveSelection",
    GET_DATA: "GetData",
    DELETE_DATA: "DeleteData",
};
var SAVE_SELECTION = Actions.SAVE_SELECTION, GET_DATA = Actions.GET_DATA, DELETE_DATA = Actions.DELETE_DATA;
window.onload = function () {
    console.log("onload from content_script.js");
    var DB_NAME = "side-notes";
    var DB_VERSION = 1;
    var STORE_NOTES = "notes";
    var db;
    var dbConnection = indexedDB.open(DB_NAME, DB_VERSION);
    dbConnection.onerror = function (e) { return console.log("ERROR:", e); };
    dbConnection.onupgradeneeded = function (event) {
        console.log("onupgradeneeded");
        db = event.target.result;
        if (!db.objectStoreNames.contains(STORE_NOTES)) {
            db.createObjectStore(STORE_NOTES, { autoIncrement: true });
        }
    };
    dbConnection.onsuccess = function (event) {
        db = event.target.result;
    };
    chrome.runtime.onMessage.addListener(function (_a, sender, sendResponse) {
        var _b, _c;
        var type = _a.type, payload = _a.payload;
        console.log("ON_MESSAGE", type, SAVE_SELECTION);
        switch (type) {
            case SAVE_SELECTION: {
                console.log("SAVE SELECTION");
                var transaction = db.transaction([STORE_NOTES], "readwrite");
                transaction.oncomplete = function (event) {
                    console.log(event);
                };
                transaction.onerror = function (event) {
                    console.log(event);
                };
                var objectStore = transaction.objectStore(STORE_NOTES);
                var objectStoreRequest = objectStore.add({
                    content: (_b = window.getSelection()) === null || _b === void 0 ? void 0 : _b.toString(),
                    data: Date.now(),
                    url: window.location.href,
                });
                objectStoreRequest.onsuccess = function (e) { return console.log(e); };
                objectStoreRequest.onerror = function (e) { return console.log(e); };
                break;
            }
            case GET_DATA: {
                console.log("GET_DATA");
                var transaction = db.transaction([STORE_NOTES], "readonly");
                var store = transaction.objectStore(STORE_NOTES);
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
            case DELETE_DATA: {
                var transaction = db.transaction([STORE_NOTES], "readwrite");
                var store = transaction.objectStore(STORE_NOTES);
                var deleteRequest = store.delete(payload);
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
            case "NoteDataFromUser": {
                console.log("NoteDataFromUser");
                return sendResponse({
                    content: (_c = window.getSelection()) === null || _c === void 0 ? void 0 : _c.toString(),
                    data: Date.now(),
                    url: window.location.href,
                });
            }
        }
    });
};
