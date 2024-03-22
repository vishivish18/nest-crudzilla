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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrudService = void 0;
const common_1 = require("@nestjs/common");
class CrudService {
    constructor(rootModel) {
        this.rootModel = rootModel;
        this.rootModel = rootModel;
    }
    createOne(document) {
        return __awaiter(this, void 0, void 0, function* () {
            const newDocument = new this.rootModel(document);
            try {
                return yield newDocument.save();
            }
            catch (e) {
                console.log(e);
                throw new common_1.ConflictException(e.message);
            }
        });
    }
    createMany(documents) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rootModel.insertMany(documents);
        });
    }
    findOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rootModel.findOne(query).exec();
        });
    }
    findOneById(id, projection, populate) {
        return __awaiter(this, void 0, void 0, function* () {
            let existingDocument;
            if (populate) {
                existingDocument = yield this.rootModel.findById(id, projection).populate(populate.path, populate.select).exec();
            }
            else {
                existingDocument = yield this.rootModel.findById(id, projection).exec();
            }
            if (!existingDocument) {
                throw new common_1.NotFoundException('Not Found');
            }
            return existingDocument;
        });
    }
    findMany(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rootModel.find(query).sort({ createdAt: -1 }).exec();
        });
    }
    //   async findManyPaginated(ormFilter?: Partial<any>, paginationQuery?: Partial<any>, projection?: Partial<any>, populate?:{path: string, select: string}) {
    //     let modelQuery
    //     if(populate) {
    //         modelQuery = await this.rootModel.find(ormFilter, projection, paginationQuery)
    //       .lean().populate(populate.path, populate.select)
    //     } else {
    //         modelQuery = await this.rootModel.find(ormFilter, projection, paginationQuery)
    //     .lean()
    //     }    
    //     const countQuery = ormFilter ? this.rootModel.countDocuments(ormFilter) : this.rootModel.estimatedDocumentCount();
    //     const [data, count] = await Promise.all([modelQuery, countQuery])
    //     return paginationQuery.generatePaginatedResponse(count, data);
    //   }
    updateOneById(id, update) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResult = yield this.rootModel
                .updateOne({ _id: id }, update)
                .exec();
            if (updateResult.matchedCount === 0) {
                throw new common_1.ConflictException(`Not Found, Can't Update`);
            }
            return updateResult;
        });
    }
    findOneAndUpdate(query, update) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rootModel.findOneAndUpdate(query, update).exec();
        });
    }
    updateManyByIds(ids, update) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rootModel.updateMany({ _id: { $in: ids } }, update).exec();
        });
    }
    deleteOne(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rootModel.deleteOne(query).exec();
        });
    }
    deleteOneById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deleteResult = yield this.rootModel.deleteOne({ _id: id }).exec();
            if (deleteResult.deletedCount === 0) {
                throw new common_1.ConflictException(`Not Found, Can't Delete`);
            }
            return deleteResult;
        });
    }
    deleteMany(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.rootModel.deleteMany(query).exec();
        });
    }
}
exports.CrudService = CrudService;
