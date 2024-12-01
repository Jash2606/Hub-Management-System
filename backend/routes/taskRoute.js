const express = require('express');
const { createTask , updateTask , deleteTask, getAllTasks , getTask , assignTask , unassign } = require('../controller/taskController');
const { authMiddleware } = require('../middleware/authMiddleware');
const { restrictTo } = require('../middleware/roleMiddleware');
const router = express.Router();

router.post('/create', authMiddleware, restrictTo(['Admin', 'Hub Ops']), createTask);
router.put('/update/:id', authMiddleware, restrictTo(['Admin', 'Hub Ops']), updateTask);
router.delete('/delete/:id', authMiddleware, restrictTo(['Admin']), deleteTask);
router.get('/', authMiddleware, getAllTasks);
router.get('/:id', authMiddleware, getTask);
router.post('/assign/:id', authMiddleware, restrictTo(['Admin', 'Hub Ops']), assignTask);
router.post('/unassign/:id', authMiddleware, restrictTo(['Admin', 'Hub Ops']), unassign);

module.exports = router;