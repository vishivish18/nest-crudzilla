"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.CrudController = void 0;
const common_1 = require("@nestjs/common");
const crud_service_1 = require("../services/crud.service");
const mongoose_1 = __importDefault(require("mongoose"));
let CrudController = class CrudController {
    constructor(crudService) {
        this.crudService = crudService;
    }
    createOne(document) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.crudService.createOne(document);
        });
    }
    //   @Get()
    //   findAll(
    //     @GenerateORMFilter() ormFilter: ORMFilter,
    //     @PaginationOption() paginationQuery: PaginationQuery,
    //   ) {
    //     return this.crudService.findManyPaginated(ormFilter, paginationQuery);
    //   }
    findOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.crudService.findOneById(id);
        });
    }
    updateOneById(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.crudService.updateOneById(id, update);
        });
    }
    deleteOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.crudService.deleteOneById(id);
        });
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "createOne", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "findOneById", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Types.ObjectId, Object]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "updateOneById", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [mongoose_1.default.Types.ObjectId]),
    __metadata("design:returntype", Promise)
], CrudController.prototype, "deleteOneById", null);
CrudController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [crud_service_1.CrudService])
], CrudController);
exports.CrudController = CrudController;
