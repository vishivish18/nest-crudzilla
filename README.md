# nest-crudzilla
![Designer (2)](https://github.com/vishivish18/nest-crudzilla/assets/3650542/1cbf5082-5bf2-4914-910b-187745c852d6)

`nest-crudzilla` is a powerful NestJS package designed to simplify CRUD (Create, Read, Update, Delete) operations in your application. With `nest-crudzilla`, you can effortlessly build RESTful APIs for your entities while maintaining flexibility and customization options.

## Features

- **CRUD Operations**: Automate CRUD operations for your entities with minimal setup and configuration.
- **Flexible Configuration**: Customize CRUD behavior to fit your application's specific needs, including support for custom DTOs, validation, and error handling.
- **Validation and Error Handling**: Seamlessly integrate with NestJS validation and error handling mechanisms for robustness and reliability.
- **Pagination and Filtering**: Support for pagination and filtering of query results to enhance performance and user experience.
- **ORM**: Currently built for Mongoose ORM only.

## Installation

Install `@vishivish18/nest-crudzilla` via npm or yarn:

```bash
npm install @vishivish18/nest-crudzilla
# or
yarn add @vishivish18/nest-crudzilla
```
# Usage
###  Extend `CrudController` in Your Controller

```typescript
import { Controller } from '@nestjs/common';
import { CrudController } from '@vishivish18/nest-crudzilla';
import { YourModel } from './your-model.model'; // Import your mongoose model

@Controller('your-resource')
export class YourController extends CrudController<YourModel> {
  constructor(private readonly yourService: YourService) {
    super(yourService);
  }
}
```

### Extend `CrudSerice` in Your Service

```typescript
import { CrudService } from '@vishivish18/nest-crudzilla';
import { YourModel } from './your-model.model'; // Import your mongoose model

export class YourService extends CrudService<YourModel> {
    constructor(
    @InjectModel('YourModel', ConnectionName.YourConnection)
    private readonly yourModel: Model<YourModel>,
  ) {
    super(yourModel);
  }
}
```

### Example 
#### Create your DTO (It is optional)
#### You can create both Create and Update DTO

```typescript
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
export class CreateCouponDto {
  @IsOptional()
  @IsString()
  code: string;

  @IsOptional()
  @IsString()
  discountType: string;

  @IsOptional()
  @IsNumber()
  discountValue: number;

  @IsOptional()
  @IsString()
  startDate: Date;

  @IsOptional()
  @IsString()
  endDate: Date;
}
```

#### Create your own usual NestJS controller and extend `CrudController`, pass `Create` and `Update` DTOs in constructor

```typescript
import { Controller,Get,Post, Delete, Body, Patch, Param,} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { Coupon } from 'models/dist/models/coupons.schema';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';
import { CrudController } from '@vishivish18/nest-crudzilla';

@Controller('coupons')
export class CouponsController extends CrudController<Coupon> {
  constructor(
    private readonly couponsService: CouponsService
    ) {
    super(couponsService, CreateCouponDto, UpdateCouponDto);
  }
    // These routes need not be explicitly created as they will be automatically handled by the base class CrudController:
    /**
     *  1.POST /api/coupons
     * 2. GET /api/coupons
     * 3. GET /api/coupons/:id
     * 4. PATCH /api/coupons/:id
     * 5. PUT /api/coupons/:id
     * 6. DELETE /api/coupons/:id 
    /*
 
  // Custom Controller endpoint to apply a coupon with the given code to the current order
  /**
   * Apply a coupon with the given code to the current order.
   *
   * @param couponCode The coupon code to apply.
   * @returns Details of the applied coupon, such as the discount type and value.
   * @throws Error if the provided coupon code is invalid, inactive, or expired.
   */
  @Get(':couponCode/apply')
  applyCoupon(
    @Param('couponCode') couponCode: string,
  ) {
    return this.couponsService.applyCoupon(couponCode);
  }

}
```


#### Create your own usual NestJS service and extend `CrudService`

```typescript
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Coupon } from 'models/dist/models/coupons.schema';
import { ConnectionName } from 'src/utils/connectionName';
import { Model } from 'mongoose';
import { CouponDetailsDto } from './dto/coupon-details.dto';
import { CrudService} from '@vishivish18/nest-crudzilla';

@Injectable()
export class CouponsService extends CrudService {
  constructor(
    @InjectModel('Coupon', ConnectionName.ADMIN)
    private readonly couponModel: Model<Coupon>,
  ) {
    super(couponModel);
  }
 
  /**
  * The CRUD operations such as model.create(), model.find(), etc., need not be explicitly implemented in the service class,
  * as they will be automatically handled by the base class CrudService.
  **/


 /**
   * Public service function to Apply a coupon and calculate the discount.
   * @param couponCode The coupon code to apply.
   * @returns A CouponDetailsDto (Data Transfer Object) containing the details of the applied coupon.
   * @throws Error if the coupon is invalid, inactive, or expired.
   */
  public async applyCoupon(couponCode: string,):Promise<CouponDetailsDto>{
    const coupon = await this.couponModel.findOne({ code: couponCode });
    if (!coupon) {
      throw new Error('Invalid coupon code');
    }
    // check if coupon is active and not expired
    if (!coupon.isActive) {
      throw new Error('Coupon is not active');
    }
    if (coupon.startDate > new Date()) {
      throw new Error('Coupon is not active');
    }
    if (coupon.endDate && coupon.endDate < new Date()) {
      throw new Error('Coupon is expired');
    }
    return {
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
    };
  }
}
```




