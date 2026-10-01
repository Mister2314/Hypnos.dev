

type Props = {
  text: string
  className?: string
  tag?: 'p' | 'h2' | 'h3'
}

export default function Line({ text, className, tag = 'p' }: Props) {
  // v25: boşluqlar qorunur — `split(' ')` ikiqat boşluğu və sətir keçidini
  // sükutla itirirdi. `(\s+)` bölgüsü onları ayrı hissə kimi saxlayır.
  const inner = text.split(/(\s+)/).map((p, i) =>
    p.trim() === '' ? (
      p
    ) : (
      <span className="rv" key={i}>
        {p}
      </span>
    ),
  )

  if (tag === 'h2') return <h2 className={className}>{inner}</h2>
  if (tag === 'h3') return <h3 className={className}>{inner}</h3>
  return <p className={className}>{inner}</p>
}
