import { IsNotEmpty } from "class-validator";

export class CreatePermissionDto {
   @IsNotEmpty({ message: 'Name should not empty' })
   name: string

   @IsNotEmpty({ message: 'API Path should not empty' })
   apiPath: string

   @IsNotEmpty({ message: 'Method should not empty' })
   method: string

   @IsNotEmpty({ message: 'Module should not empty' })
   module: string
}
