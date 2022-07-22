import {IsNotEmpty} from 'class-validator'

export class TagCreateDto {
  id?: number
  @IsNotEmpty()
  title: string

  tien_to_sinh_ma?: string

  phan_nhom_van_ban?: string
}
