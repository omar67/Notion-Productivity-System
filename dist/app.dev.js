"use strict";

var BASE_URL = "https://api.notion.com";
var AUTH = "secret_tvUojiX9aw3XnPNYBwGdFgOx2NaAA7gPtKdSTCDFZLM";
var ARHEIVE_DB = "40536486479844ab941d4eb117be34b2";
var SYNC_BLOCK_ID = "8b289880-8d7b-4493-a3ae-22f3c93aa70c";

function clear() {
  var apiUrl, headers, options;
  return regeneratorRuntime.async(function clear$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          apiUrl = "".concat(BASE_URL, "/v1/blocks/").concat(SYNC_BLOCK_ID, "/children?page_size=100");
          headers = new Headers();
          headers.append("Authorization", "Bearer ".concat(AUTH));
          headers.append("Notion-Version", "2022-02-22");
          options = {
            method: "GET",
            headers: headers
          };
          fetch(apiUrl, options).then(function (response) {
            if (!response.ok) {
              throw new Error("API request failed with status ".concat(response.status));
            }

            return response.json();
          }).then(function (data) {
            var blocks = data.results.map(function (it) {
              return it.id;
            });
            console.log("Deleting:", blocks);
            blocks.map(function (blockId) {
              deleteBlock(blockId);
            });
          })["catch"](function (error) {
            console.error("API Request Error:", error);
          });

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}

function deleteBlock(blockId) {
  var apiUrl, headers, options;
  return regeneratorRuntime.async(function deleteBlock$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          apiUrl = BASE_URL + "/v1/blocks/" + blockId;
          headers = new Headers();
          headers.append("Authorization", "Bearer ".concat(AUTH));
          headers.append("Notion-Version", "2022-02-22");
          options = {
            method: "DELETE",
            headers: headers
          };
          fetch(apiUrl, options).then(function (response) {
            if (!response.ok) {
              throw new Error("API request failed with status ".concat(response.status));
            }

            return response.json();
          }).then(function (data) {
            console.log("API Response:", data);
          })["catch"](function (error) {
            console.error("API Request Error:", error);
          });

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}
/**
 * Archive the document into Archive DB
 */


function archive() {
  var pageId, syncBlock, cloneResp;
  return regeneratorRuntime.async(function archive$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(createPage());

        case 2:
          pageId = _context3.sent.id;
          console.log(pageId);
          _context3.next = 6;
          return regeneratorRuntime.awrap(getSyncBlock());

        case 6:
          syncBlock = _context3.sent;
          console.log(syncBlock);
          _context3.next = 10;
          return regeneratorRuntime.awrap(cloneSyncBlock(syncBlock, pageId));

        case 10:
          cloneResp = _context3.sent;
          console.log("cloneResp", cloneResp);

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function cloneSyncBlock(syncBlock, pageId) {
  var apiUrl, headers, body, options;
  return regeneratorRuntime.async(function cloneSyncBlock$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          apiUrl = "".concat(BASE_URL, "/v1/blocks/").concat(pageId, "/children");
          headers = new Headers();
          headers.append("Authorization", "Bearer ".concat(AUTH));
          headers.append("Notion-Version", "2022-02-22");
          headers.append("Content-Type", "application/json");
          body = {
            "children": syncBlock
          };
          options = {
            method: "PATCH",
            headers: headers,
            body: JSON.stringify(body)
          };
          _context4.t0 = regeneratorRuntime;
          _context4.next = 10;
          return regeneratorRuntime.awrap(fetch(apiUrl, options));

        case 10:
          _context4.t1 = _context4.sent.json();
          _context4.next = 13;
          return _context4.t0.awrap.call(_context4.t0, _context4.t1);

        case 13:
          return _context4.abrupt("return", _context4.sent);

        case 14:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function getSyncBlock() {
  var apiUrl, headers, options;
  return regeneratorRuntime.async(function getSyncBlock$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          apiUrl = "".concat(BASE_URL, "/v1/blocks/").concat(SYNC_BLOCK_ID, "/children?page_size=100");
          headers = new Headers();
          headers.append("Authorization", "Bearer ".concat(AUTH));
          headers.append("Notion-Version", "2022-02-22");
          options = {
            method: "GET",
            headers: headers
          };
          _context5.t0 = regeneratorRuntime;
          _context5.next = 8;
          return regeneratorRuntime.awrap(fetch(apiUrl, options));

        case 8:
          _context5.t1 = _context5.sent.json();
          _context5.next = 11;
          return _context5.t0.awrap.call(_context5.t0, _context5.t1);

        case 11:
          return _context5.abrupt("return", _context5.sent.results);

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  });
}

function createPage() {
  var apiUrl, headers, requestBody, options;
  return regeneratorRuntime.async(function createPage$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          apiUrl = BASE_URL + "/v1/pages/";
          headers = new Headers();
          headers.append("Authorization", "Bearer ".concat(AUTH));
          headers.append("Notion-Version", "2022-02-22");
          headers.append("Content-Type", "application/json");
          requestBody = {
            parent: {
              database_id: "40536486479844ab941d4eb117be34b2"
            },
            properties: {
              Name: {
                title: [{
                  text: {
                    content: "".concat(getTodayDate(), " Archive")
                  }
                }]
              }
            }
          };
          options = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(requestBody)
          };
          _context6.t0 = regeneratorRuntime;
          _context6.next = 10;
          return regeneratorRuntime.awrap(fetch(apiUrl, options));

        case 10:
          _context6.t1 = _context6.sent.json();
          _context6.next = 13;
          return _context6.t0.awrap.call(_context6.t0, _context6.t1);

        case 13:
          return _context6.abrupt("return", _context6.sent);

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  });
}

function getTodayDate() {
  var today = new Date();
  var day = String(today.getDate()).padStart(2, "0");
  var month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based

  var year = today.getFullYear();
  return "".concat(day, "/").concat(month, "/").concat(year);
}

var express = require('express');

var app = express();

var cors = require("cors");

var port = 7251; // or any other port you prefer

app.use(cors());
app.get('/clear', function _callee(req, res) {
  return regeneratorRuntime.async(function _callee$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(archive());

        case 2:
          _context7.next = 4;
          return regeneratorRuntime.awrap(clear());

        case 4:
          res.status(200).json({
            status: "success"
          });

        case 5:
        case "end":
          return _context7.stop();
      }
    }
  });
});
app.listen(port, '127.0.0.1', function () {
  console.log("Server is running at http://localhost:".concat(port, "/"));
});