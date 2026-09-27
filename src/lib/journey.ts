



let rings = 0
let visited = false

type Listener = (rings: number, visited: boolean) => void
const listeners = new Set<Listener>()


export function markPond(): void {
  if (visited) return
  visited = true
  emit()
}


export function addRings(n: number): void {
  if (n <= 0) return
  rings += n
  emit()
}

function emit(): void {
  for (const fn of listeners) fn(rings, visited)
}


export function onJourney(fn: Listener): () => void {
  listeners.add(fn)
  fn(rings, visited)
  return () => {
    listeners.delete(fn)
  }
}
