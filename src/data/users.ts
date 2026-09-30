export interface Credentials {
  username: string;
  password: string;
}

export const users = {
  standard: { username: 'standard_user', password: 'secret_sauce' },
  lockedOut: { username: 'locked_out_user', password: 'secret_sauce' },
  problem: { username: 'problem_user', password: 'secret_sauce' },
} as const satisfies Record<string, Credentials>;
