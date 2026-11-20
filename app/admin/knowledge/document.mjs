import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import { unified } from 'unified'

const markdown = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkStringify, { bullet: '-', fences: true })
const plainText = node => node.value ?? (node.children || []).map(plainText).join('')
const articleTitle = node => node?.type === 'heading' ? plainText(node) : ''

export function documentSections(content) {
  const nodes = markdown.parse(content).children
  const headings = nodes.filter(node => node.type === 'heading' && node.depth <= 3)
  const boundaries = [{ offset: 0, heading: null }]
  for (const heading of headings) {
    const offset = heading.position.start.offset
    if (offset === 0 || (heading === headings[0] && heading.depth === 1 &&
        nodes.slice(0, nodes.indexOf(heading)).every(node => node.type === 'html' && node.value.startsWith('<!--')))) {
      boundaries[0].heading = heading
    } else {
      boundaries.push({ offset, heading })
    }
  }

  return boundaries.map(({ offset, heading }, index) => ({
    id: String(index),
    level: heading?.depth ?? 1,
    title: articleTitle(heading),
    content: content.slice(offset, boundaries[index + 1]?.offset),
  }))
}

export function sectionHeading(content, fallbackLevel) {
  const heading = markdown.parse(content).children.find(node => node.type === 'heading' && node.depth <= 3)
  return { title: articleTitle(heading), level: heading?.depth ?? fallbackLevel }
}

export function addDocumentSection(sections, parentId, id, title) {
  const parent = sections.find(section => section.id === parentId)
  const level = parent?.level === 2 ? 3 : 2
  let index = sections.length
  if (level === 3) {
    index = sections.findIndex((section, position) =>
      position > sections.indexOf(parent) && section.level <= 2)
    if (index < 0) index = sections.length
  }
  const heading = { type: 'heading', depth: level, children: [{ type: 'text', value: title }] }
  const added = { id, level, title, content: markdown.stringify({ type: 'root', children: [heading] }) + '\n' }
  return [...sections.slice(0, index), added, ...sections.slice(index)]
}

export function documentContent(sections) {
  return sections.reduce((content, section) => {
    if (!content || !section.content) return content + section.content
    const separator = content.endsWith('\n') ? '' : '\n\n'
    return content + separator + section.content
  }, '')
}

const elements = {
  paragraph: 'p', strong: 'strong', emphasis: 'em', delete: 's',
  listItem: 'li', blockquote: 'blockquote', inlineCode: 'code', break: 'br',
  thematicBreak: 'hr', link: 'a',
}

function editorNode(node, source, dom, original) {
  if (node.type === 'text') return dom.createTextNode(node.value)
  if (node.type === 'html' && node.value.startsWith('<!--')) return dom.createComment('source')
  const tag = node.type === 'heading' ? `h${node.depth}`
    : node.type === 'list' ? (node.ordered ? 'ol' : 'ul') : elements[node.type]
  if (!tag) {
    const el = dom.createElement('pre')
    el.contentEditable = 'false'
    el.textContent = source.slice(node.position.start.offset, node.position.end.offset)
    original.set(el, { node, html: el.outerHTML })
    return el
  }
  const el = dom.createElement(tag)
  if (node.type === 'link') {
    el.dataset.url = node.url
    if (node.title) el.dataset.title = node.title
  }
  if (node.type === 'list' && node.ordered) el.start = node.start || 1
  if (node.type === 'listItem' && node.checked != null) el.dataset.checked = String(node.checked)
  if (node.type === 'inlineCode') el.textContent = node.value
  for (const child of node.children || []) el.append(editorNode(child, source, dom, original))
  return el
}

export function loadEditor(editor, content) {
  const original = new WeakMap()
  const dom = editor.ownerDocument
  editor.replaceChildren()
  for (const node of markdown.parse(content).children) {
    const element = editorNode(node, content, dom, original)
    original.set(element, {
      node, html: element.outerHTML,
      source: content.slice(node.position.start.offset, node.position.end.offset),
    })
    editor.append(element)
  }
  return { content, original, html: editor.innerHTML }
}

const inlineTags = { B: 'strong', STRONG: 'strong', I: 'emphasis', EM: 'emphasis', S: 'delete', STRIKE: 'delete', DEL: 'delete' }
const blockTag = /^(P|DIV|H[1-6]|UL|OL|LI|BLOCKQUOTE|PRE|HR)$/

function inlineNodes(nodes, original) {
  return Array.from(nodes).flatMap(node => {
    if (node.nodeType === 3) return [{ type: 'text', value: node.nodeValue.replace(/\u00a0/g, ' ') }]
    if (node.nodeType !== 1) return []
    const previous = original.get(node)
    if (previous?.html === node.outerHTML) return [previous.node]
    const children = () => inlineNodes(node.childNodes, original)
    if (node.tagName === 'BR') return [{ type: 'break' }]
    if (node.tagName === 'CODE') return [{ type: 'inlineCode', value: node.textContent }]
    if (node.tagName === 'A' && node.dataset.url) {
      return [{ type: 'link', url: node.dataset.url, title: node.dataset.title, children: children() }]
    }
    const type = inlineTags[node.tagName]
    return type ? [{ type, children: children() }] : children()
  })
}

function blockNodes(nodes, original) {
  const blocks = []
  let pending = []
  function flush() {
    if (pending.length) {
      const children = inlineNodes(pending, original)
      if (children.some(node => node.type !== 'break')) blocks.push({ type: 'paragraph', children })
      pending = []
    }
  }
  for (const node of nodes) {
    if (!blockTag.test(node.tagName)) {
      pending.push(node)
      continue
    }
    flush()
    const previous = original.get(node)
    if (previous?.html === node.outerHTML) {
      blocks.push(previous.node)
      continue
    }
    const tag = node.tagName
    if (tag === 'DIV') blocks.push(...blockNodes(node.childNodes, original))
    else if (/^H[1-6]$/.test(tag)) {
      const children = inlineNodes(node.childNodes, original).filter(child => child.type !== 'break')
      if (children.length) blocks.push({ type: 'heading', depth: Number(tag[1]), children })
    } else if (tag === 'UL' || tag === 'OL') {
      const children = []
      for (const child of blockNodes(node.children, original)) {
        if (child.type === 'listItem') children.push(child)
        if (child.type === 'list') {
          const previous = children.pop()
          children.push({ type: 'listItem', ...previous, children: [...(previous?.children || []), child] })
        }
      }
      if (children.length) blocks.push({ type: 'list', ordered: tag === 'OL', start: node.start, spread: false, children })
    } else if (tag === 'LI') {
      const children = blockNodes(node.childNodes, original)
      const checked = node.dataset.checked
      blocks.push({ type: 'listItem', spread: false, ...(checked && { checked: checked === 'true' }), children })
    } else if (tag === 'BLOCKQUOTE') {
      blocks.push({ type: 'blockquote', children: blockNodes(node.childNodes, original) })
    } else if (tag === 'HR') {
      blocks.push({ type: 'thematicBreak' })
    } else {
      pending.push(...node.childNodes)
      flush()
    }
  }
  flush()
  return blocks
}

export function readEditor(editor, initial) {
  if (editor.innerHTML === initial.html) return initial.content
  const chunks = []
  let pending = []
  function flush() {
    const children = blockNodes(pending, initial.original)
    if (children.length) chunks.push(markdown.stringify({ type: 'root', children }).trimEnd())
    pending = []
  }
  for (const node of editor.childNodes) {
    const previous = initial.original.get(node)
    if (previous && previous.html === node.outerHTML) {
      flush()
      chunks.push(previous.source)
    } else {
      pending.push(node)
    }
  }
  flush()
  return chunks.length ? chunks.join('\n\n') + '\n\n' : ''
}
