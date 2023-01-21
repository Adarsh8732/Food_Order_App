"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorRoute = void 0;
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const multer_1 = __importDefault(require("multer"));
const Router = express_1.default.Router();
exports.VendorRoute = Router;
const imageStorage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + "_" + Date.now() + "_" + file.originalname);
    }
});
const images = (0, multer_1.default)({ storage: imageStorage }).array('images', 10);
Router.post('/login', controllers_1.VendorLogin);
Router.use(middlewares_1.Authenticate);
Router.get('/profile', controllers_1.GetVendorProfile);
Router.patch('/profile', controllers_1.UpdateVendorProfile);
Router.patch('/coverImage', images, controllers_1.UpdateVendorCoverImage);
Router.patch('/service', controllers_1.UpdateVendorService);
Router.post('/food', images, controllers_1.AddFood);
// Router.post('/food',AddFood);
Router.get('/foods', controllers_1.GetFood);
Router.get('/', (req, res, next) => {
    return res.json({ "message": "Hello from vendor route" });
});
//# sourceMappingURL=VendorRoutes.js.map