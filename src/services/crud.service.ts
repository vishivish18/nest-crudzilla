import { ConflictException, NotFoundException } from '@nestjs/common';
import * as mongoose from 'mongoose';

export class CrudService {
  constructor(private readonly rootModel: mongoose.Model<any>) {
    this.rootModel = rootModel;
  }

  async createOne(document: Partial<any>) {
    const newDocument = new this.rootModel(document);
    try {
      return await newDocument.save();
    } catch (e: any) {
      throw new ConflictException(e.message); 
    }    
  }

  async createMany(documents) {
    return await this.rootModel.insertMany(documents);
  }

  async findOne(query: Partial<any>) {
    return await this.rootModel.findOne(query).exec();
  }

  async findOneById(id: mongoose.Types.ObjectId, projection?: any, populate?:{path: string, select: string}) {
    let existingDocument
    if(populate) {
      existingDocument = await this.rootModel.findById(id, projection).populate(populate.path, populate.select).exec();
    } else {
      existingDocument = await this.rootModel.findById(id, projection).exec();
    }
    if (!existingDocument) {
      throw new NotFoundException('Not Found');
    }
    return existingDocument;
  }

  async findMany(query: Partial<any>) {
    return await this.rootModel.find(query).sort({createdAt:-1}).exec();
  }

  async findManyPaginated(ormFilter?: Partial<any>, paginationQuery?: Partial<any>, projection?: Partial<any>, populate?:{path: string, select: string}) {
    let modelQuery
    if(populate) {
        modelQuery = await this.rootModel.find(ormFilter, projection, paginationQuery)
      .lean().populate(populate.path, populate.select)
    } else {
        modelQuery = await this.rootModel.find(ormFilter, projection, paginationQuery)
    .lean()
    }    
    const countQuery = ormFilter ? this.rootModel.countDocuments(ormFilter) : this.rootModel.estimatedDocumentCount();
    const [data, count] = await Promise.all([modelQuery, countQuery])
    return paginationQuery.generatePaginatedResponse(count, data);
  }

  async updateOneById(id: mongoose.Types.ObjectId, update: Partial<any>) {
    const updateResult = await this.rootModel
      .updateOne({ _id: id }, update)
      .exec();
    if (updateResult.matchedCount === 0) {
      throw new ConflictException(`Not Found, Can't Update`);
    }
    return updateResult;
  }

  async replaceOneById(id: mongoose.Types.ObjectId, replacement: Partial<any>) {
    const updateResult = await this.rootModel
      .replaceOne({ _id: id }, replacement)
      .exec();
    if (updateResult.matchedCount === 0) {
      throw new ConflictException(`Not Found, Can't Update`);
    }
    return updateResult;
  }

  async findOneAndUpdate(query: Partial<any>, update: Partial<any>) {
    return await this.rootModel.findOneAndUpdate(query, update).exec();
  }

  async updateManyByIds(ids: mongoose.Types.ObjectId[], update: Partial<any>) {
    return await this.rootModel.updateMany({ _id: { $in: ids } }, update).exec();
  }

  async deleteOne(query: Partial<any>) {
    return await this.rootModel.deleteOne(query).exec();
  }

  async deleteOneById(id: mongoose.Types.ObjectId) {
    const deleteResult = await this.rootModel.deleteOne({ _id: id }).exec();
    if (deleteResult.deletedCount === 0) {
      throw new ConflictException(`Not Found, Can't Delete`);
    }
    return deleteResult;
  }

  async deleteMany(query) {
    return await this.rootModel.deleteMany(query).exec();
  }
}
