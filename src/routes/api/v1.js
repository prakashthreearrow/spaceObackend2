const router = require('express').Router()

const {
    userList, addUser, updateUser, deleteUser
} = require('../../controllers/api/ContactBook');

// contact book
router.get('/user', userList);
router.post('/user', addUser);
router.put('/user', updateUser);
router.delete('/user', deleteUser);

module.exports = router
