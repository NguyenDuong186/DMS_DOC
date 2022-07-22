export enum Role {
  User = 'User',
  Admin = 'Admin',
  VanThu = 'VanThu',
}

export enum Status {
  Process = 'Đang xử lý',
  Completed = 'Hoàn thành',
}
export enum HISTORY_ACTION {
  BAN_HANH_VAN_BAN = 'Ban hành văn bản',
  CHIA_SE_VAN_BAN = 'Chia sẻ văn bản',
  CHINH_SUA_VAN_BAN = 'Chỉnh sửa văn bản',
  THU_HOI_VAN_BAN = 'Thu hồi chia sẻ văn bản',
  CHUYEN_XU_LY = 'Giao xử lý văn bản',
  HOAN_THANH_XU_LY = 'Hoàn thành xử lý',
}
