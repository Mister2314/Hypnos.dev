/**
 * Line — mətni söz-söz açılan span-lara bölür.
 * `.rv` sinfi transform/opacity animasiyası üçün `inline-block` olmalıdır (CSS-də).
 * Boşluq span-dan KƏNARDA qoyulur — yoxsa inline-block içində yox olur.
 */
import { Fragment } from 'react'

type Props = {
  text: string
  className?: string
  tag?: 'p' | 'h2' | 'h3'
}

export default function Line({ text, className, tag = 'p' }: Props) {
  const words = text.split(' ')
  const inner = words.map((w, i) => (
    <Fragment key={`${w}-${i}`}>
      <span className="rv">{w}</span>
      {i < words.length - 1 ? ' ' : null}
    </Fragment>
  ))

  if (tag === 'h2') return <h2 className={className}>{inner}</h2>
  if (tag === 'h3') return <h3 className={className}>{inner}</h3>
  return <p className={className}>{inner}</p>
}
