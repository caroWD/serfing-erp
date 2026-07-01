export class UserDto {
  id: string
  handle: string
  firstName: string
  lastName: string
  fullName: string
  emial: string
  avatar: string | null
  roleId: string
  roleName: string
  state: 'pending' | 'enabled' | 'disabled'
  createdAt: string
  updatedAt: string
  deletedAt: string | null

  constructor(
    id: string,
    handle: string,
    firstName: string,
    lastName: string,
    fullName: string,
    email: string,
    avatar: string | null,
    roleId: string,
    roleName: string,
    state: 'pending' | 'enabled' | 'disabled',
    createdAt: string,
    updatedAt: string,
    deletedAt: string | null
  ) {
    this.id = id
    this.handle = handle
    this.firstName = firstName
    this.lastName = lastName
    this.fullName = fullName
    this.emial = email
    this.avatar = avatar
    this.roleId = roleId
    this.roleName = roleName
    this.state = state
    this.createdAt = createdAt
    this.updatedAt = updatedAt
    this.deletedAt = deletedAt
  }
}
