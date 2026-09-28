


export const PERF = {

  canvasDpr: 1,

  narrowBreakpoint: 760,


  decodeAhead: 20,
} as const


export function isNarrow(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < PERF.narrowBreakpoint
}


// v10: adaptiv tier (web.dev "adaptive loading") — zəif şəbəkə və ya
// data-qnaq modunda aşağı tier MÖVCUD olanda onu götür, yoxsa kanonik seçim.
export function pickTierDir(high: string, low: string): string {
  const nav =
    typeof navigator !== 'undefined'
      ? (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
      : null
  const c = nav?.connection
  if (c && (c.saveData || (c.effectiveType && c.effectiveType !== '4g'))) return low
  return isNarrow() ? low : high
}
