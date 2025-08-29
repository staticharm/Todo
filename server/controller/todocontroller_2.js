
const db = require("../db/database.js");

// modified create table 
exports.createTable = (req, res) => {
  let q = `CREATE TABLE todolist2(
      id int AUTO_INCREMENT,
      task VARCHAR(255),
      priority ENUM('low','medium','high') DEFAULT 'low',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY(id)
  )`;
  db.query(q, (err, result) => {
    if (err) throw err;
    return res.status(201).json("TABLE CREATED");
  });
};

// Create completed table 
exports.createCompletedTable = (req, res) => {
  let q = `CREATE TABLE completedTodos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      task VARCHAR(255),
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      completedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )`;
  db.query(q, (err, result) => {
    if (err) throw err;
    return res.status(201).json("completedTodos TABLE CREATED");
  });
};

// ----------------------------------------------------------------------------------------------------------------------------------------------



// Insert  into Todo table
exports.createList = (req, res) => {
  const { task, priority } = req.body;
  const q = "INSERT INTO todolist2 (task, priority) VALUES (?, ?)";
  db.query(q, [task, priority || "low"], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    return res.status(200).json({ success: true, message: "Todo added", data: result });
  });
};

// ----------------------------------------------------------------------------------------------------------------------------------------------


// SHOW TODOS
exports.showTodos = (req, res) => { 
  const q = "SELECT * FROM todolist2 "; 
  db.query(q, (err, result) => {
    if (err) return res.json(err); 
    return res.status(200).json(result);
   });
}

//show completed todo
exports.showComplete = (req, res) => {
  const q = "SELECT * FROM completedTodos";
  db.query(q, (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    return res.status(200).json({ success: true, data: result });
  });
}

// SHOW SINGLE TODO
exports.singleTodo = (req, res) => {
  const q = "SELECT * FROM todolist2 WHERE id = ?";
  db.query(q, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    return res.status(200).json({ success: true, data: result[0] });
  });
};
// ----------------------------------------------------------------------------------------------------------------------------------------------


// UPDATE TODO
exports.updateTodo = (req, res) => {
  const { task, priority } = req.body;
  const q = "UPDATE todolist2 SET task = ?, priority = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?";
  db.query(q, [task, priority, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    return res.status(200).json({ success: true, message: "Todo updated", data: result });
  });
};


// ----------------------------------------------------------------------------------------------------------------------------------------------



// DELETE SINGLE TODO
exports.deleteSingleTodo = (req, res) => {
  const q = "DELETE FROM todolist2 WHERE id = ?";
  db.query(q, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    return res.status(200).json({ success: true, message: "Todo deleted" });
  });
};
// delete complted todo
exports.deleteCompleted = (req, res) => {
  const q = "DELETE FROM completedTodos WHERE id = ?";
  db.query(q, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    return res.status(200).json({ success: true, message: "Completed todo deleted" });
  });
};



// ----------------------------------------------------------------------------------------------------------------------------------------------




// mark completed todos
exports.completeTodo = (req, res) => {
  const { id } = req.params;
  const selectQuery = "SELECT * FROM todolist2 WHERE id = ?";
  db.query(selectQuery, [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!result.length) return res.status(404).json({ success: false, message: "Todo not found" });

    const todo = result[0];
    const insertQuery = "INSERT INTO completedTodos (task, createdAt, completedAt) VALUES (?, ?, CURRENT_TIMESTAMP)";
    db.query(insertQuery, [todo.task, todo.createdAt], (err2) => {
      if (err2) return res.status(500).json({ success: false, error: err2.message });

      const deleteQuery = "DELETE FROM todolist2 WHERE id = ?";
      db.query(deleteQuery, [id], (err3) => {
        if (err3) return res.status(500).json({ success: false, error: err3.message });
        return res.status(200).json({ success: true, message: "Todo marked as completed" });
      });
    });
  });
};

// mark back to - TODO
exports.markTodo = (req, res) => {
  const q1 = "SELECT * FROM completedTodos WHERE id = ?";
  db.query(q1, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ success: false, error: err.message });
    if (!result.length) return res.status(404).json({ success: false, message: "Todo not found" });

    const todo = result[0];
    const insertQuery = "INSERT INTO todolist2 (task, createdAt, updatedAt) VALUES (?, ?, CURRENT_TIMESTAMP)";
    db.query(insertQuery, [todo.task, todo.createdAt], (err2) => {
      if (err2) return res.status(500).json({ success: false, error: err2.message });

      const deleteQuery = "DELETE FROM completedTodos WHERE id = ?";
      db.query(deleteQuery, [req.params.id], (err3) => {
        if (err3) return res.status(500).json({ success: false, error: err3.message });
        return res.status(200).json({ success: true, message: "Task re-marked as todo" });
      });
    });
  });
};