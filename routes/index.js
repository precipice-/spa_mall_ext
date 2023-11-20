const Router = require("express");
const authRouter = require("./auth.router.js");
const usersRouter = require("./users.router.js");
const productsRouter = require("./products.router.js");

const apiRouter = Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/products", productsRouter);

module.exports = apiRouter;
