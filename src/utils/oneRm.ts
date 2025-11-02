export function estimateOneRm(weight: number, reps: number) {
  if (!weight || !reps) return 0;
  const oneRm = weight * (1 + reps / 30);
  return +oneRm.toFixed(1);
}

export function percentageOfOneRm(oneRm: number, percentage: number) {
  if (!oneRm || !percentage) return 0;
  return +((oneRm * percentage) / 100).toFixed(1);
}
