export function isAscending(numbers: number[]): boolean {
  return numbers.every((value, index) => index === 0 || numbers[index - 1] <= value);
}
