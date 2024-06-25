const { getAll, create, getOne, remove, update, VERIFCI, login } = require('../controlador/user.contoller');
const express = require('express');
const verifyJWT = require('../utils/verifyJWT');

const userRouter = express.Router();




userRouter.use(verifyJWT)

userRouter.route('/user')
    .get(getAll)
    .post(create);

userRouter.route('/user/verify/:c')
    .get(VERIFCI)
userRouter.route('/user/login')
    .post(login)




userRouter.route('/user/:id')
    .get(getOne)
    .delete(remove)
    .put(update);

module.exports = userRouter;