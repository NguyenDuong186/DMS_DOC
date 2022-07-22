import {IsNotEmpty} from 'class-validator'

export class DepartmentDto {
  @IsNotEmpty()
  title: string

  @IsNotEmpty()
  department_code?: string
}
