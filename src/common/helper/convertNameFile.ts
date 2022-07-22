export function convert(str: any) {
  str = str.toLowerCase()
  const add_a = ['à', 'á', 'ạ', 'ả', 'ã', 'â', 'ầ', 'ấ', 'ậ', 'ẩ', 'ẫ', 'ă', 'ằ', 'ắ', 'ặ', 'ẳ', 'ẵ']
  const add_e = ['è', 'é', 'ẹ', 'ẻ', 'ẽ', 'ê', 'ề', 'ế', 'ệ', 'ể', 'ễ']
  const add_i = ['ì', 'í', 'ị', 'ỉ', 'ĩ']
  const add_o = ['ò', 'ó', 'ọ', 'ỏ', 'õ', 'ô', 'ồ', 'ố', 'ộ', 'ổ', 'ỗ', 'ơ', 'ờ', 'ớ', 'ợ', 'ở', 'ỡ']
  const add_u = ['ù', 'ú', 'ụ', 'ủ', 'ũ', 'ư', 'ừ', 'ứ', 'ự', 'ử', 'ữ']
  const add_y = ['ỳ', 'ý', 'ỵ', 'ỷ', 'ỹ']
  const add_d = ['đ']
  add_a.forEach((v) => (str = str.replaceAll(v, 'a')))
  add_e.forEach((v) => (str = str.replaceAll(v, 'e')))
  add_i.forEach((v) => (str = str.replaceAll(v, 'i')))
  add_o.forEach((v) => (str = str.replaceAll(v, 'o')))
  add_u.forEach((v) => (str = str.replaceAll(v, 'u')))
  add_y.forEach((v) => (str = str.replaceAll(v, 'y')))
  add_d.forEach((v) => (str = str.replaceAll(v, 'd')))

  str = str.replaceAll(' ', '_')
  str = str.replaceAll('-', '_')
  return str
}
