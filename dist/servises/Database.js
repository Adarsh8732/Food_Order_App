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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.set('strictQuery', false);
    try {
        yield mongoose_1.default.connect(config_1.MONGO_URL, {
        // useNewUrlParser:true,
        // useUnifiedTopology:true,
        // useCreateIndex:true
        });
        console.log("db Connected");
    }
    catch (error) {
        console.log("err" + error);
    }
});
//# sourceMappingURL=Database.js.map