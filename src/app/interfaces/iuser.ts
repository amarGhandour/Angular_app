export interface IUser {
  id: number,
  name: string,
  email: string,
  roles: Array<{ name: string }>,
  token: string
}
