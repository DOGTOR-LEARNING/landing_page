import styles from '../app/legal.module.css'

function RichText({ text }) {
  const regex = /(\*\*(.+?)\*\*|\[(.+?)\]\((.+?)\))/g
  const parts = []
  let lastIndex = 0
  let match
  let key = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    if (match[2]) {
      parts.push(<strong key={key++}>{match[2]}</strong>)
    } else if (match[3]) {
      parts.push(
        <a key={key++} href={match[4]} target="_blank" rel="noopener noreferrer">
          {match[3]}
        </a>
      )
    }
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }
  return <>{parts}</>
}

function ContactBlock() {
  return (
    <p className={styles.contactEmail}>
      <strong>Email:</strong>{' '}
      <a href="mailto:dogtor.love.learning@gmail.com">dogtor.love.learning@gmail.com</a>
    </p>
  )
}

function renderBlocks(blocks) {
  return blocks.map((block, i) => {
    if (block.type === 'p') {
      return (
        <p key={i}>
          <RichText text={block.text} />
        </p>
      )
    }
    if (block.type === 'ul') {
      return (
        <ul key={i}>
          {block.items.map((item, j) => (
            <li key={j}>
              <RichText text={item} />
            </li>
          ))}
        </ul>
      )
    }
    if (block.type === 'contact') {
      return <ContactBlock key={i} />
    }
    if (block.type === 'sub') {
      return (
        <div key={i}>
          <h3>{block.heading}</h3>
          {renderBlocks(block.blocks)}
        </div>
      )
    }
    return null
  })
}

export default function LegalContent({ sections }) {
  return sections.map((section, i) => (
    <section key={i} className={styles.section}>
      <h2>{section.heading}</h2>
      {renderBlocks(section.blocks)}
    </section>
  ))
}
