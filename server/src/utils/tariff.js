export function calcAmount(entryTime, toTime = new Date()) {
  const ms = toTime.getTime() - new Date(entryTime).getTime();
  const minutes = Math.ceil(ms / 60000);
  const billableBlocks = Math.max(0, Math.ceil((minutes - 15) / 15));
  return Number((billableBlocks * 0.5).toFixed(2));
}
