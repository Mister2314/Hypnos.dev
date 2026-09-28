


export const PERF = {

  canvasDpr: 1,

  narrowBreakpoint: 760,


  decodeAhead: 20,
} as const


export function isNarrow(): boolean {
  return typeof window !== 'undefined' && window.innerWidth < PERF.narrowBreakpoint
}
