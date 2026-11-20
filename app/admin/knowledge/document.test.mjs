import assert from 'node:assert/strict'
import { test } from 'node:test'
import { addDocumentSection, documentContent, documentSections, readEditor, sectionHeading } from './document.mjs'

test('outline keeps the document preamble and ignores headings in fenced examples', () => {
  const content = '<!-- private instructions -->\r\n\r\n# Guide\r\n## Lessons\r\n\r\n~~~md\r\n## Example\r\n~~~\r\n\r\n### Science\r\nText'
  const sections = documentSections(content)
  assert.deepEqual(sections.map(({ level, title }) => [level, title]), [[1, 'Guide'], [2, 'Lessons'], [3, 'Science']])
  assert.equal(documentContent(sections), content)
})

test('new child stays with its parent and titles containing Markdown are escaped', () => {
  const content = '# Guide\n## Help\n### Account\n\n## Rules\n'
  const sections = addDocumentSection(documentSections(content), '1', 'new', 'Contact * support?')
  assert.deepEqual(sections.map(({ title }) => title), ['Guide', 'Help', 'Account', 'Contact * support?', 'Rules'])
  assert.deepEqual(sectionHeading(sections[3].content, 1), { title: 'Contact * support?', level: 3 })
  assert.equal(documentSections(documentContent(sections))[3].title, 'Contact * support?')
})

function element(tagName, childNodes, outerHTML = tagName) {
  return { nodeType: 1, tagName, childNodes, children: childNodes.filter(node => node.nodeType === 1), outerHTML, dataset: {} }
}
const text = value => ({ nodeType: 3, nodeValue: value })

test('visible edits keep untouched Markdown and serialize native rich text and nested lists', () => {
  const preserved = { nodeType: 8 }
  const source = '<!-- instructions to keep -->'
  const childList = element('UL', [element('LI', [text('子項對應')])])
  const list = element('UL', [element('LI', [text('上課資訊')]), childList])
  const editor = {
    innerHTML: 'changed',
    childNodes: [preserved, element('P', [element('B', [text('直接編輯')]), text('一般文字')]), list],
  }
  const original = new WeakMap([[preserved, { source }]])
  const value = readEditor(editor, { html: 'baseline', original })
  assert.match(value, /^<!-- instructions to keep -->\n\n\*\*直接編輯\*\*一般文字\n\n- 上課資訊\n  - 子項對應/)
  assert.equal(readEditor(editor, { html: 'changed', content: 'unchanged Markdown', original }), 'unchanged Markdown')
})
