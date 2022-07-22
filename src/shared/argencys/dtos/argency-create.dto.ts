import {IsNotEmpty} from 'class-validator'

export class ArgencyCreateDto {
  @IsNotEmpty()
  title: string
}
