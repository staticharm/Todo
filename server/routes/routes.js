const express = require('express');
// const { createDB, createTable, createList, showTodos, singleTodo, updateTodo, deleteSingleTodo } = require('../controller/todocontroller');
const router = express.Router();
const {  createTable, createList, showTodos, singleTodo, updateTodo, deleteSingleTodo,completeTodo,showComplete,deleteCompleted,markTodo } = require('../controller/todocontroller_2');




// /api/.../.../
// router.get('/create/database', createDB);
router.get('/create/table', createTable);
router.post('/create/list', createList);
router.get('/show/todos', showTodos);
router.get('/todo/:id', singleTodo);
router.put('/update/todo/:id', updateTodo);
router.delete('/delete/todo/:id', deleteSingleTodo);
router.delete('/delete/Completed/:id',deleteCompleted)
router.put("/complete/todo/:id", completeTodo);
router.get('/show/complete',showComplete)
router.put('/mark/todo/:id',markTodo);




module.exports = router;