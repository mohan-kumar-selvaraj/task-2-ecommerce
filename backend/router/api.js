const router = require("express").Router();
const db = require("../db");

// All category
router.get("/", async (req, res) => {
  const sql = `SELECT * FROM category`;
  try {
    db.query(sql, (err, result) => {
      res.status(200).json(result);
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// All product
router.get("/product", async (req, res) => {
  try {
    const pageSize = parseInt(req.query.pageSize) || 5; // Default page size is 10
    const page = parseInt(req.query.page) || 1; // Default page number is 1

    const offset = (page - 1) * pageSize;

    // Construct SQL query to fetch paginated data
    const dataSql = `SELECT t1.CD_ID, t1.CD, t2.STOCK, t2.DATE, t2.PD_ID, t2.PD_NAME,t2.BRAND,t2.MRP, t2.DISCOUNT  
                       FROM category AS t1 
                       JOIN product AS t2 ON t1.CD_ID = t2.CD_ID 
                       LIMIT ?, ?`;

    // Execute the query to fetch paginated data
    db.query(dataSql, [offset, pageSize], (err, result) => {
      if (err) {
        console.error("Error executing MySQL query: " + err.stack);
        res.status(500).send("Internal Server Error");
        return;
      }

      // Construct SQL query to count total number of records
      const countSql = `SELECT COUNT(*) AS total FROM product`;

      // Execute the query to count total number of records
      db.query(countSql, (countErr, countResult) => {
        if (countErr) {
          console.error(
            "Error counting total number of records: " + countErr.stack
          );
          res.status(500).send("Internal Server Error");
          return;
        }

        // Calculate total number of pages
        const totalCount = countResult[0].total;
        const totalPages = Math.ceil(totalCount / pageSize);

        // Return the paginated result along with total number of pages
        res.status(200).json({ page, pageSize, totalPages, result });
      });
    });
  } catch (err) {
    // Handle other errors
    console.error("Error: " + err.message);
    res.status(500).send("Internal Server Error");
  }
});

// Particular product
router.get("/:category", async (req, res) => {
  try {
    const pageSize = parseInt(req.query.pageSize) || 10; // Default page size is 10
    const page = parseInt(req.query.page) || 1; // Default page number is 1

    const offset = (page - 1) * pageSize;

    // Construct SQL query to fetch paginated data
    const dataSql = `SELECT * FROM category AS t1 
                       JOIN product AS t2 ON t1.CD_ID = t2.CD_ID 
                       WHERE t1.CD = ? LIMIT ?, ?`;

    // Execute the query to fetch paginated data
    db.query(
      dataSql,
      [req.params.category, offset, pageSize],
      (err, result) => {
        if (err) {
          console.error("Error executing MySQL query: " + err.stack);
          res.status(500).send("Internal Server Error");
          return;
        }

        // Construct SQL query to count total number of records
        const countSql = `SELECT COUNT(*) AS total 
                          FROM category AS t1 
                          JOIN product AS t2 ON t1.CD_ID = t2.CD_ID 
                          WHERE t1.CD = ?`;

        // Execute the query to count total number of records
        db.query(countSql, [req.params.category], (countErr, countResult) => {
          if (countErr) {
            console.error(
              "Error counting total number of records: " + countErr.stack
            );
            res.status(500).send("Internal Server Error");
            return;
          }

          // Calculate total number of pages
          const totalCount = countResult[0].total;
          const totalPages = Math.ceil(totalCount / pageSize);

          // Return the paginated result along with total number of pages
          res.status(200).json({ page, pageSize, totalPages, result });
        });
      }
    );
  } catch (err) {
    // Handle other errors
    console.error("Error: " + err.message);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
