const BASE_URL = "https://api.notion.com";

const AUTH = "secret_tvUojiX9aw3XnPNYBwGdFgOx2NaAA7gPtKdSTCDFZLM";

const ARHEIVE_DB = "40536486479844ab941d4eb117be34b2";
const SYNC_BLOCK_ID = "8b289880-8d7b-4493-a3ae-22f3c93aa70c";



async function clear() {
  const apiUrl = `${BASE_URL}/v1/blocks/${SYNC_BLOCK_ID}/children?page_size=100`;

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${AUTH}`);
  headers.append("Notion-Version", "2022-02-22");

  const options = {
    method: "GET",
    headers: headers,
  };

  fetch(apiUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      var blocks = data.results.map((it) => it.id);
      console.log("Deleting:", blocks);

      blocks.map( async (blockId) => {
        await deleteBlock(blockId);
      });
    })
    .catch((error) => {
      console.error("Clear API Request Error:", error);
    });
}
async function deleteBlock(blockId) {
  const apiUrl = BASE_URL + "/v1/blocks/" + blockId;

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${AUTH}`);
  headers.append("Notion-Version", "2022-02-22");

  const options = {
    method: "DELETE",
    headers: headers,
  };
  console.log("Exec:", apiUrl)
  return fetch(apiUrl, options)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      console.log("API Response:", data);
    })
    .catch((error) => {
      console.error("DeleteBlock API Request Error:", error);
      deleteBlock(blockId)
    });
}

/**
 * Archive the document into Archive DB
 */
async function archive() {
  const pageId = (await createPage()).id;
  console.log(pageId);
  const syncBlock = (await getSyncBlock());
  console.log(syncBlock)
  const cloneResp = await cloneSyncBlock(
    syncBlock,
    pageId
  );
  console.log("cloneResp", cloneResp);
}
async function cloneSyncBlock(syncBlock, pageId){
    const apiUrl = `${BASE_URL}/v1/blocks/${pageId}/children`;

    const headers = new Headers();
    headers.append("Authorization", `Bearer ${AUTH}`);
    headers.append("Notion-Version", "2022-02-22");
    headers.append("Content-Type", "application/json");

    const body = {"children": syncBlock }
    const options = {
      method: "PATCH",
      headers: headers,
      body: JSON.stringify(body),
    };

    return (await (await fetch(apiUrl, options)).json());
}
async function getSyncBlock() {
  const apiUrl = `${BASE_URL}/v1/blocks/${SYNC_BLOCK_ID}/children?page_size=100`;

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${AUTH}`);
  headers.append("Notion-Version", "2022-02-22");

  const options = {
    method: "GET",
    headers: headers,
  };

  return (await (await fetch(apiUrl, options)).json()).results;
}

async function createPage() {
  const apiUrl = BASE_URL + "/v1/pages/";

  const headers = new Headers();
  headers.append("Authorization", `Bearer ${AUTH}`);
  headers.append("Notion-Version", "2022-02-22");
  headers.append("Content-Type", "application/json");

  const requestBody = {
    parent: {
      database_id: "40536486479844ab941d4eb117be34b2",
    },
    properties: {
      Name: {
        title: [
          {
            text: {
              content: `${getTodayDate()} Archive`,
            },
          },
        ],
      },
    },
  };

  const options = {
    method: "POST",
    headers: headers,
    body: JSON.stringify(requestBody),
  };

  return await (await fetch(apiUrl, options)).json();
}
function getTodayDate() {
  const today = new Date();

  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

const express = require('express');
const app = express();
const cors = require("cors");
const port = 7251; // or any other port you prefer
app.use(cors());

app.get('/clear', async (req, res) => {
  await archive();
  await clear()
  console.log("Done!");
  res.status(200).json({ status: "success"});
});

app.listen(port, '127.0.0.1', () => {
  console.log(`Server is running at http://localhost:${port}/`);
});