/**
 * Half-open stay ranges [check_in, check_out): checkout date is exclusive.
 * Two stays overlap iff check_in_a < check_out_b && check_in_b < check_out_a.
 */
export function stayRangesOverlap(
  checkInA: string,
  checkOutA: string,
  checkInB: string,
  checkOutB: string,
): boolean {
  return checkInA < checkOutB && checkInB < checkOutA;
}
