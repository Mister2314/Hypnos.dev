


import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

export const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches


export type World = {
  id: string
  n: string
  title: string
  bg: string
  text: string
  accent: string
  halo: number
  lx: number
  ly: number
}


export const WORLDS: World[] = [
  { id: 'hero', n: '', title: 'Overture', bg: '#0e100f', text: '#fffce1', accent: '#b08d57', halo: 0.00, lx: 0.50, ly: 0.40 },



  { id: 'leap', n: '01', title: 'The Leap', bg: '#0a0e1e', text: '#fbfbfc', accent: '#00fcfd', halo: 0.5, lx: 0.50, ly: 0.38 },
  { id: 'summer', n: '02', title: 'Summer', bg: '#30312d', text: '#f1f1ea', accent: '#ffc2ae', halo: 0.55, lx: 0.78, ly: 0.26 },
  { id: 'hands', n: '03', title: 'The Hands', bg: '#12100c', text: '#fffce1', accent: '#e0c9a6', halo: 0.42, lx: 0.50, ly: 0.46 },
  { id: 'gap', n: '04', title: 'The Gap', bg: '#0e100f', text: '#fffce1', accent: '#b08d57', halo: 0.06, lx: 0.50, ly: 0.44 },

  { id: 'counterweight', n: '05', title: 'The Counterweight', bg: '#0f0a16', text: '#fffce1', accent: '#cfa9e8', halo: 0.62, lx: 0.50, ly: 0.44 },
  { id: 'sapere', n: '06', title: 'Sapere aude', bg: '#0e100f', text: '#fffce1', accent: '#b08d57', halo: 0.10, lx: 0.62, ly: 0.36 },
  { id: 'speak', n: '07', title: 'Speak or die', bg: '#0c1512', text: '#f1f1ea', accent: '#c9c3a4', halo: 0.28, lx: 0.24, ly: 0.34 },

  { id: 'worlds', n: '08', title: 'Worlds', bg: '#0b0d0c', text: '#fffce1', accent: '#a8b0c0', halo: 0.05, lx: 0.50, ly: 0.40 },
  { id: 'work', n: '09', title: 'Work', bg: '#14150f', text: '#fffce1', accent: '#b08d57', halo: 0.06, lx: 0.50, ly: 0.50 },
  { id: 'questions', n: '10', title: 'Questions', bg: '#101210', text: '#fffce1', accent: '#b08d57', halo: 0.04, lx: 0.50, ly: 0.46 },
  { id: 'contact', n: '11', title: 'Contact', bg: '#0b0c0b', text: '#fffce1', accent: '#b08d57', halo: 0.02, lx: 0.50, ly: 0.42 },
  { id: 'signature', n: '12', title: 'Signature', bg: '#0e100f', text: '#fffce1', accent: '#b08d57', halo: 0.00, lx: 0.50, ly: 0.40 },
]


export const worldState = {
  halo: WORLDS[0].halo,
  lx: WORLDS[0].lx,
  ly: WORLDS[0].ly,
}


type ColorKey = 'bg' | 'text' | 'accent'

const VARS: [ColorKey, string][] = [
  ['bg', '--bg'],
  ['text', '--text'],
  ['accent', '--accent'],
]


export function applyWorld(a: World, b: World, t: number): void {
  const root = document.documentElement.style
  for (const [key, cssVar] of VARS) {
    root.setProperty(cssVar, String(gsap.utils.interpolate(a[key], b[key], t)))
  }
  worldState.halo = gsap.utils.interpolate(a.halo, b.halo, t)
  worldState.lx = gsap.utils.interpolate(a.lx, b.lx, t)
  worldState.ly = gsap.utils.interpolate(a.ly, b.ly, t)
}


export function setWorld(w: World): void {
  applyWorld(w, w, 0)
}


export function getWorld(id: string): World | undefined {
  return WORLDS.find((w) => w.id === id)
}


export function eyebrow(id: string): string {
  const w = getWorld(id)
  if (!w) return ''
  return w.n ? `${w.n} — ${w.title}` : w.title
}


export function ambient(
  target: gsap.TweenTarget,
  vars: gsap.TweenVars = {},
  duration = 7,
): gsap.core.Tween | null {
  if (prefersReducedMotion) return null
  const list = Array.isArray(target) ? target : [target]
  if (list.length === 0 || list[0] === undefined || list[0] === null) return null
  return gsap.to(target, {
    ...vars,
    duration,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  })
}

export { gsap, ScrollTrigger, useGSAP }
