/**
 * Wrapping "next index" helper — used for both thumbnail and lightbox
 * keyboard navigation.
 * @param {number} currentIndex
 * @param {number} total
 * @returns {number}
 */
export function getNextIndex(currentIndex, total) {
  return (currentIndex + 1) % total;
}

/**
 * Wrapping "previous index" helper — used for both thumbnail and lightbox
 * keyboard navigation.
 * @param {number} currentIndex
 * @param {number} total
 * @returns {number}
 */
export function getPreviousIndex(currentIndex, total) {
  return (currentIndex - 1 + total) % total;
}
