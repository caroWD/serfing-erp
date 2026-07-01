export class RoleDoesNotHaveThatPermissionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RoleDoesNotHaveThatPermissionError'
  }
}

export class RoleAlreadyHasThatPermissionError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RoleAlreadyHasThatPermissionError'
  }
}
