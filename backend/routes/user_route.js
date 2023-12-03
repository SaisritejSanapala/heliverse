const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserModel = mongoose.model('UserModel');
const GroupModel = mongoose.model('GroupModel');

router.get('/api/users', (req, res) => {
    UserModel.find({})
        .sort({ userId: 1 })
        .then((users) => {
            res.status(200).json({ result: users })
        })
        .catch((error) => {
            res.status(500).json({ error: error })
        })
})

router.get('/api/users/:id', (req, res) => {
    console.log(req.params.id)

    UserModel.find({ userId: req.params.id })
        .then((user) => {
            res.status(200).json({ result: user })
        })
        .catch((error) => {
            res.status(500).json({ error: error })
        })
})

router.post('/api/users', (req, res) => {

    const user = new UserModel(req.body);
    user.save()
        .then((newUser) => {
            res.status(201).json({ user: newUser });
        })
        .catch((error) => {
            res.status(500).json({ error: error })
        })
})


router.put('/api/users/:id', (req, res) => {

    UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((updatedUser) => {
            if (!updatedUser) {
                return res.status(404).json({ error: 'User not found' });
            }
            res.status(200).json({ user: updatedUser });
        })
        .catch((error) => {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
}); 


router.delete('/api/users/:id', (req, res) => {
    UserModel.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json({ success: "user deleted successfully" });
        })
        .catch((error) => {
            res.status(500).json({ error: error })
        })
})



router.post('/api/addtogroup', (req, res) => {


    const user = new GroupModel(req.body);
    user.save()
        .then((newUser) => {
            res.status(201).json({ user: newUser });
        })
        .catch((error) => {
            res.status(500).json({ error: error })
        })

});


router.get('/api/getgroupusers', (req, res) => {
    GroupModel.find({})
    .then((users) => {
        res.status(201).json({ users: users });
    })
    .catch((error) => {
        res.status(500).json({ error: error })
    })
})
  

router.delete('/api/removegroupuser/:id', (req, res) => {
    GroupModel.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json({ success: "user removed successfully" });
        })
        .catch((error) => {
            res.status(500).json({ error: error })
        })
})

   

module.exports = router;