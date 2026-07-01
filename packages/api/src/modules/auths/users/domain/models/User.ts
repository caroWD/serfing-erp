import {
  Root,
  RootId,
  TempoCreatedAt,
  TempoDeletedAt,
  TempoUpdatedAt,
} from '../../../../primitives'
import type {
  UserAvatar,
  UserEmail,
  UserFirstName,
  UserHandle,
  UserLastName,
  UserPassword,
  UserState,
} from '../value-objects'

export class User extends Root {
  private _handle: UserHandle
  private _firstName: UserFirstName
  private _lastName: UserLastName
  private _fullName: string
  private _email: UserEmail
  private _password: UserPassword
  private _avatar: UserAvatar
  private _roleId: RootId
  private _state: UserState

  constructor(
    id: RootId,
    handle: UserHandle,
    firstName: UserFirstName,
    lastName: UserLastName,
    email: UserEmail,
    password: UserPassword,
    avatar: UserAvatar,
    roleId: RootId,
    state: UserState,
    createdAt: TempoCreatedAt,
    updatedAt: TempoUpdatedAt,
    deletedAt: TempoDeletedAt
  ) {
    super(id, createdAt, updatedAt, deletedAt)
    this._handle = handle
    this._firstName = firstName
    this._lastName = lastName
    this._fullName = `${firstName.value} ${lastName.value}`
    this._email = email
    this._password = password
    this._avatar = avatar
    this._roleId = roleId
    this._state = state
  }

  get handle(): UserHandle {
    return this._handle
  }

  get firstName(): UserFirstName {
    return this._firstName
  }

  get lastName(): UserLastName {
    return this._lastName
  }

  get fullName(): string {
    return this._fullName
  }

  get email(): UserEmail {
    return this._email
  }

  get password(): UserPassword {
    return this._password
  }

  get avatar(): UserAvatar {
    return this._avatar
  }

  get roleId(): RootId {
    return this._roleId
  }

  get state(): UserState {
    return this._state
  }
}
