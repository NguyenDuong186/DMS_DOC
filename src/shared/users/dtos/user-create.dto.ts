import {IsEmail, IsNotEmpty, IsString} from 'class-validator'
export class UserDto {
  id?: number

  @IsNotEmpty()
  name: string

  @IsEmail()
  email: string

  @IsNotEmpty()
  @IsString()
  password: string

  job_title?: string

  van_thu_id?: number
  employee_id?: number
}
