import { DomainError } from '../../../../primitives'

export enum State {
  PENDING,
  ENABLED,
  DISABLED,
}

export class UserState {
  value: State

  private constructor(value: State) {
    this.value = value
  }

  public static create(value: State): UserState {
    if (value === null) throw new DomainError('The State cannot be null.')

    return new UserState(value)
  }
}
