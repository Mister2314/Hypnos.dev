/**
 * strip-comments.mjs — mənbə fayllarından şərhləri təmizləyir (state machine).
 *
 * Dəstəkləyir: .ts/.tsx (//, /* *\/, string/tpl"), .css (/* *\/), .html (<!-- -->).
 * Qoruyur: string/tpl literal içindəki hər şey (URL, GLSL ${} interpolasiyası).
 * Sətri nömrələri saxlayır: line comment → boşluqla, block → yeni sətir saxlanılır.
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'

function stripTS(src) {
  let out = ''
  let i = 0
  const n = src.length
  let mode = 'code' // code | sq | dq | tpl
  while (i < n) {
    const c = src[i]
    const c2 = src[i + 1]
    if (mode === 'code') {
      if (c === '/' && c2 === '/') {
        while (i < n && src[i] !== '\n') i++
        continue // \n qalır — sətir nömrələri saxlanılır
      }
      if (c === '/' && c2 === '*') {
        i += 2
        while (i < n && !(src[i] === '*' && src[i + 1] === '/')) {
          if (src[i] === '\n') out += '\n' // sətir nömrələri saxlanılır
          i++
        }
        i += 2
        out += ' '
        continue
      }
      if (c === "'") { mode = 'sq'; out += c; i++; continue }
      if (c === '"') { mode = 'dq'; out += c; i++; continue }
      if (c === '`') { mode = 'tpl'; out += c; i++; continue }
      out += c
      i++
      continue
    }
    if (mode === 'sq' || mode === 'dq') {
      if (c === '\\') { out += c + (c2 ?? ''); i += 2; continue }
      if ((mode === 'sq' && c === "'") || (mode === 'dq' && c === '"')) mode = 'code'
      out += c
      i++
      continue
    }
    // tpl — template mətni: ${ → kod rejiminə (stack ilə), ` → bitir
    if (c === '\\') { out += c + (c2 ?? ''); i += 2; continue }
    if (c === '`') { mode = 'code'; out += c; i++; continue }
    if (c === '$' && c2 === '{') {
      // interpolasiya içində şərhləri də təmizlə — alt-maqarina
      let j = i + 2
      let depth = 1
      let inner = '${'
      while (j < n && depth > 0) {
        const ch = src[j]
        if (ch === '{') depth++
        else if (ch === '}') { depth--; if (depth === 0) break }
        else if (ch === "'" || ch === '"' || ch === '`') {
          // interpolasiya içindəki string — sadə keç
          const q = ch
          inner += ch
          j++
          while (j < n && src[j] !== q) {
            if (src[j] === '\\') j++
            inner += src[j]
            j++
          }
        }
        inner += ch
        j++
      }
      out += stripTS(inner)
      i = j
      continue
    }
    if (c === '/' && c2 === '*') {
      i += 2
      while (i < n && !(src[i] === '*' && src[i + 1] === '/')) {
        if (src[i] === '\n') out += '\n'
        i++
      }
      i += 2
      continue
    }
    out += c
    i++
  }
  // artıq boş sətirləri yığ (3+ → 1)
  return out.replace(/\n{3,}/g, '\n\n').replace(/[ \t]+$/gm, '')
}

function stripCSS(src) {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+$/gm, '')
    .trimStart()
}

function stripHTML(src) {
  return src.replace(/<!--[\s\S]*?-->\n?/g, '')
}

const ROOT = process.cwd()
const targets = []

const walk = (dir) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name)
    const st = statSync(p)
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === 'dist' || name === '.git' || name === 'research') continue
      walk(p)
    } else if (/\.(ts|tsx)$/.test(name) || /^global\.css$|^fonts\.css$/.test(name)) {
      targets.push(p)
    }
  }
}
walk('src')
walk('tools')
targets.push('index.html')

let changed = 0
for (const p of targets) {
  const src = readFileSync(p, 'utf8')
  const ext = p.slice(p.lastIndexOf('.'))
  let out
  if (ext === '.css') out = stripCSS(src)
  else out = stripTS(src)
  if (out !== src) {
    writeFileSync(p, out)
    changed++
    console.log('stripped:', p)
  }
}
console.log(`tamam — ${changed} fayl təmizləndi`)
