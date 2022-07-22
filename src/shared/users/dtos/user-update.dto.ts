import {IsEmail, IsNotEmpty} from 'class-validator'
export class UserUpdateDto {
  id?: number

  name?: string

  @IsEmail()
  email: string

  @IsNotEmpty()
  password: string

  job_title?: string

  van_thu_id?: number
  employee_id?: number
}
