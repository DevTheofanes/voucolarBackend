import { Router } from "express";
import multer from "multer";

import authMiddleware from "./middlewares/authMiddlewe";
import multerConfig from "./modules/multer";

import UserController from "./controllers/UserController";
import FileController from "./controllers/FileController";
import AuthController from "./controllers/AuthController";
import MarkController from "./controllers/MarkController";
import ModelController from "./controllers/ModelController";
import AddressController from "./controllers/AddressController";
import CategoryController from "./controllers/CategoryController";
import ProductsController from "./controllers/ProductsController";
import AssetsController from "./controllers/AssetsController";
import OrdersController from "./controllers/OrdersController";
import TransactionController from "./controllers/TransactionController";

const routes = Router();
const upload = multer(multerConfig);

//Autenticações na Aplicação
routes.post("/session", AuthController.session);

//Rotas sem Auth
routes.get("/marks", MarkController.index);
routes.get("/marks/:id/models", ModelController.show);
routes.get("/models", ModelController.index);
routes.get("/categories", CategoryController.index);
routes.get("/category/:categoryId/products", ProductsController.show);
routes.get("/products", ProductsController.index);
routes.get("/models/:id/products", ProductsController.showProductsForModel);
routes.get("/product/:id", ProductsController.showProduct);
routes.get("/assets", AssetsController.index);
routes.get("/assets/figure", AssetsController.show);

//Users
routes.post("/users", UserController.create);
routes.use(authMiddleware)
routes.get("/users", UserController.show);
routes.get("/allUsers", UserController.index);
routes.put("/users/:id", UserController.update);
routes.delete("/users/:id", UserController.delete);
routes.patch("/users/:id/avatar", upload.single("avatar"), FileController.createAvatar);

//Mark

routes.patch("/marks", upload.single("image"), MarkController.create)
routes.put("/marks/:id", upload.single("image"), MarkController.update)
routes.put("/marks/put/:id", MarkController.edit)
routes.delete("/marks/:id", MarkController.delete)

//Model

routes.patch("/marks/:id/models", upload.single("image"), ModelController.create)
routes.put("/models/:id", upload.single("image"), ModelController.update)
routes.put("/models/put/:id", ModelController.edit)
routes.delete("/models/:id", ModelController.delete)

//Adress

routes.post("/users/:id/address", AddressController.create)
routes.get("/address", AddressController.index);
routes.put("/users/:id/address/:idAdress", AddressController.update)
routes.delete("/address/:id", AddressController.delete)

//Category

routes.patch("/categories", upload.single("image"), CategoryController.create)
routes.put("/categories/:id", upload.single("image"), CategoryController.update)
routes.put("/categories/put/:id", CategoryController.put)
routes.delete("/categories/:id", CategoryController.delete)

//Products

routes.patch("/category/:categoryId/products", upload.single("image"), ProductsController.create)
routes.put("/products/:id", upload.single("image"), ProductsController.update)
routes.put("/products/put/:id", ProductsController.put)
routes.delete("/products/:id", ProductsController.delete)

//Assets

routes.patch("/assets", upload.single("image"), AssetsController.create)
routes.put("/assets/:id", upload.single("image"), AssetsController.update)
routes.put("/assets/put/:id", AssetsController.put)
routes.delete("/assets/:id", AssetsController.delete)

routes.post("/users/:id/orders", OrdersController.create)
routes.get("/orders", OrdersController.index);
routes.get("/orders/:id", OrdersController.show);
routes.put("/orders/:id", OrdersController.updateStatusToPago)
routes.delete("/orders/:id", OrdersController.delete)

// routes.put("/products/:id", upload.single("image"), ProductsController.update)
// routes.put("/products/put/:id", ProductsController.put)

routes.post("/order/:orderId/transactions", TransactionController.create)

export default routes;
