// app.js`
const express = require("express");
const app = express();
const cors = require("cors"); //cross orgin resouce sharing - restrict the sharing of resource/domain.
const api = require("./router/api");
//solr
const SolrNode = require("solr-node");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.use("/category", api);

//solr
const solrClient = new SolrNode({
  host: "localhost",
  port: "8983",
  core: "fproduct",
  protocol: "http",
});

function generateSubstrings(input) {
  const words = input.split(/\s+/);
  const substrings = [];

  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j <= words.length; j++) {
      const substring = words.slice(i, j).join(" ");
      if (substring.trim() !== "") {
        substrings.push(substring.toLowerCase());
      }
    }
  }

  return substrings;
}

function processTwo(searchQuery) {
  // Split the search query into individual terms
  let searchTerms = searchQuery.split(" ");
  searchTerms = generateSubstrings(searchQuery);

  // Initialize arrays to store the queries for product name and brand name
  const productQueries = [];
  const brandQueries = [];
  const categoryQueries = [];

  // Loop through each term to construct the queries for product name and brand name
  searchTerms.forEach((term) => {
    productQueries.push(`PD_NAME:*${term}*`);
    brandQueries.push(`BRAND:*${term}*`);
    categoryQueries.push(`CD:*${term}*`);
  });
  // Combine the queries using OR operator for both product name and brand name
  const productQuery = productQueries.join(" ");
  const brandQuery = brandQueries.join(" ");
  const categoryQuery = categoryQueries.join(" ");
  // console.log(productQuery);
  return [productQuery, brandQuery, categoryQuery];
}

function extractNumbersAndKeywords(input) {
  const regex = /\b(from|to|under|above|on|in|at|between|and)\s+(\d+)\b/gi;
  const matches = {};
  const arr = [];

  let match;
  while ((match = regex.exec(input)) !== null) {
    const keyword = match[1].toLowerCase();
    const number = parseInt(match[2]);
    matches[number] = keyword;
    arr.push(number);
  }

  matches.arr = arr;
  return matches;
}
app.get("/category/search/:searchData", (req, res) => {
  const searchQuery = req.params.searchData;
  //1
  const pageSize = parseInt(req.query.pageSize) || 5; // Dsefault page size is 5
  const page = parseInt(req.query.page) || 1; // Default page number is 1
  const offset = (page - 1) * pageSize;

  const [productQuery, brandQuery, categoryQuery] = processTwo(searchQuery);

  const hasNumber = /\d/.test(searchQuery);
  if (!hasNumber) {
    // Construct the final Solr query
    const query = solrClient
      .query()
      .q(`${productQuery} ${brandQuery} ${categoryQuery}`)
      .start(offset) // Set the start offset for pagination
      .rows(pageSize); // Set the number of rows to fetch
    console.log(query);
    solrClient.search(query, (err, result) => {
      if (err) {
        console.error("Error executing Solr query:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      const documents = result.response.docs;
      //3
      const totalPages = Math.ceil(result.response.numFound / pageSize);
      result["page"] = page;
      result["pageSize"] = pageSize;
      result["totalPages"] = totalPages;
      try {
        res.status(200).json(result);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });
  } else {
    let num = extractNumbersAndKeywords(searchQuery);
    let docs = "";
    switch (num[num["arr"][0]]) {
      case "between":
      case "from":
        docs =
          num["arr"].length == 1
            ? `MRP:[${num["arr"][0]} TO *]`
            : `MRP:[${num["arr"][0]} TO ${num["arr"][1]}]`;
        break;
      case "above":
        docs = `MRP:[${num["arr"][0]} TO *]`;
        break;
      case "under":
        docs = `MRP:[* TO ${num["arr"][0]}]`;
        break;
      case "on":
      case "in":
      case "at":
        docs = `MRP:${num["arr"][0]}`;
        break;
      default:
        break;
    }
    const query = solrClient
      .query()
      .q(`(${productQuery} ${brandQuery} ${categoryQuery}) AND ${docs}`)
      .start(offset) // Set the start offset for pagination
      .rows(pageSize); // Set the number of rows to fetch

    solrClient.search(query, (err, result) => {
      if (err) {
        console.error("Error executing Solr query:", err);
        res.status(500).json({ error: "Internal server error" });
        return;
      }

      const documents = result.response.docs;
      result.response.docs = documents;

      //3
      const totalPages = Math.ceil(result.response.numFound / pageSize);
      result["page"] = page;
      result["pageSize"] = pageSize;
      result["totalPages"] = totalPages;
      try {
        res.status(200).json(result);
      } catch (err) {
        res.status(500).send(err.message);
      }
    });
  }
});

app.listen(4000, () => {
  console.log("Server started on port " + 4000);
});
