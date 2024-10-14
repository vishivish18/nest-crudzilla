import { Body, Controller, Delete, Get, Param, Post, Put, Patch, Req, UseGuards,HttpException , HttpStatus } from '@nestjs/common';
import { CrudService } from '../services/crud.service';
import mongoose from 'mongoose';
import { GenerateORMFilter, ORMFilter, PaginationOption, PaginationQuery } from '@kartikyathakur/nestjs-query-filter';
import { plainToClass } from 'class-transformer';
import { ValidationError, validateOrReject } from 'class-validator';

@Controller()
export class CrudController<T, CreateDto = any, UpdateDto = any> {
  constructor(
    private readonly crudService: CrudService,
    private readonly createDtoClass?: new () => CreateDto,
    private readonly updateDtoClass?: new () => UpdateDto,
  ) {}

  @Post()
  async createOne(@Body() createDocument: CreateDto) {
    try {
      // Convert plain object to DTO
      const createDto: CreateDto = plainToClass(this.createDtoClass, createDocument);

      // Perform validation
      await validateOrReject(createDto as object);

      // Proceed with creation
      return await this.crudService.createOne(createDto);
    } catch (errors) {
      // Check if the errors are an array of validation errors
      if (Array.isArray(errors)) {
        const validationErrors: ValidationError[] = errors as ValidationError[];
        const errorMessage = validationErrors
          .map(error => Object.values(error.constraints || {})) // Handle the case where constraints might be undefined
          .flat();
        return {
          message: errorMessage,
          error: 'Bad Request',
          statusCode: HttpStatus.BAD_REQUEST,
        };
      }

      // If it's not an array, return the error as a string (in case it's a different type of error)
      return {
        message: errors.toString(),
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }


  @Get()
  findAll(
    @GenerateORMFilter() ormFilter: ORMFilter,
    @PaginationOption() paginationQuery: PaginationQuery,
  ) {
    return this.crudService.findManyPaginated(ormFilter, paginationQuery);
  }

  // @Get(':id')
  // async findOneById(@Param('id') id: mongoose.Types.ObjectId) {
  //   return await this.crudService.findOneById(id);
  // }

  // Fix @Param type
  @Get(':id')
  async findOneById(@Param('id') id: mongoose.Types.ObjectId, @Req() req) {
    return await this.crudService.findOneById(req.params.id);
  }

  @Patch(':id')
  async updateOneById(@Param('id') id: mongoose.Types.ObjectId, @Req() req, @Body() updateDocument: any) {
    try {
      // Convert plain object to DTO
      const updateDto: UpdateDto = plainToClass(this.updateDtoClass, updateDocument);
      
      // Perform validation
      await validateOrReject(updateDto as object);
      
      // Proceed with update
      return await this.crudService.updateOneById(req.params.id, updateDto);
    } catch (errors) {
      // Handle validation errors
      const validationErrors: ValidationError[] = errors as ValidationError[];
      const errorMessage = validationErrors.map(error => Object.values(error.constraints)).flat();      
      return {
        message: errorMessage,
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Put(':id')
  async replaceOneById(@Param('id') id: mongoose.Types.ObjectId, @Req() req, @Body() relacedDocument: any) {
    try {
      // Convert plain object to DTO
      const updateDto: UpdateDto = plainToClass(this.updateDtoClass, relacedDocument);
      
      // Perform validation
      await validateOrReject(updateDto as object);
      
      // Proceed with update
      return await this.crudService.replaceOneById(req.params.id, updateDto);
    } catch (errors) {
      // Handle validation errors
      const validationErrors: ValidationError[] = errors as ValidationError[];
      const errorMessage = validationErrors.map(error => Object.values(error.constraints)).flat();
      
      return {
        message: errorMessage,
        error: 'Bad Request',
        statusCode: HttpStatus.BAD_REQUEST,
      };
    }
  }

  @Delete(':id')
  async deleteOneById(@Param('id') id: mongoose.Types.ObjectId,  @Req() req) {
    return await this.crudService.deleteOneById(req.params.id);
  }
}

