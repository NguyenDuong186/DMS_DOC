import {IsOptional} from 'class-validator'

export class ArgencyUpdateDto {
  @IsOptional()
  id: number

  @IsOptional()
  title: string
}
