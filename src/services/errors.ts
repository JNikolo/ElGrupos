export class TabGroupsError extends Error {
  public code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "TabGroupsError";
    this.code = code;
  }
}
