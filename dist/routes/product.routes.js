"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
const validateRequest_1 = require("../middlewares/validateRequest");
const isAdmin_1 = require("../middlewares/isAdmin");
const product_validation_1 = require("../validations/product.validation");
const product_service_1 = require("../services/product.service");
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ dest: 'uploads/' });
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield (0, product_service_1.getAllProducts)();
    res.json(products);
}));
router.get('/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield (0, product_service_1.getProductById)(req.params.id);
    if (!product)
        return res.status(404).json({ error: 'Product not found' });
    res.json(product);
}));
router.post('/', upload.single('photo'), (0, validateRequest_1.validateRequest)(product_validation_1.productSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    let photoUrl = '';
    if (file) {
        const result = yield cloudinary_1.default.uploader.upload(file.path);
        photoUrl = result.secure_url;
    }
    const product = yield (0, product_service_1.createProduct)(Object.assign(Object.assign({}, req.body), { photo: photoUrl }));
    res.status(201).json(product);
}));
router.put('/:id', isAdmin_1.isAdmin, (0, validateRequest_1.validateRequest)(product_validation_1.productSchema), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updated = yield (0, product_service_1.updateProduct)(req.params.id, req.body);
    if (!updated)
        return res.status(404).json({ error: 'Product not found' });
    res.json(updated);
}));
router.delete('/:id', isAdmin_1.isAdmin, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleted = yield (0, product_service_1.deleteProduct)(req.params.id);
    if (!deleted)
        return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
}));
exports.default = router;
