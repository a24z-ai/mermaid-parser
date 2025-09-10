/**
 * Day.js stub for validation-only build
 */

const dayjs = (date?: any) => ({
  format: () => '2024-01-01',
  add: () => dayjs(),
  subtract: () => dayjs(),
  isAfter: () => false,
  isBefore: () => false,
  isSame: () => true,
  diff: () => 0,
  valueOf: () => Date.now(),
});

dayjs.extend = () => {};

export default dayjs;