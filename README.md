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

Install `nest-crudzilla` via npm or yarn:

```bash
npm install nest-crudzilla
# or
yarn add nest-crudzilla
```
# Usage
###  Extend CrudController in Your Controller

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

### Extend CrudSerice in Your Service

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

