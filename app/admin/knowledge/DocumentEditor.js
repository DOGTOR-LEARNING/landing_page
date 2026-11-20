import { useLayoutEffect, useRef } from 'react'
import { Bold, Code, Indent, Italic, List, ListOrdered, Outdent, Redo2, Undo2 } from 'lucide-react'
import { loadEditor, readEditor } from './document.mjs'
import styles from './knowledge.module.css'

const actions = [
  ['undo', '復原', Undo2], ['redo', '重做', Redo2],
  ['bold', '粗體', Bold], ['italic', '斜體', Italic],
  ['insertUnorderedList', '項目符號', List], ['insertOrderedList', '編號清單', ListOrdered],
  ['indent', '增加縮排', Indent], ['outdent', '減少縮排', Outdent],
]

export default function DocumentEditor({ section, editable, source, onSource, onChange, focusToken }) {
  const editorRef = useRef(null)
  const initial = useRef(null)
  const range = useRef(null)
  const content = useRef(section.content)

  useLayoutEffect(() => {
    content.current = section.content
  }, [section.content])

  useLayoutEffect(() => {
    range.current = null
    if (!source) initial.current = loadEditor(editorRef.current, content.current)
  }, [source])

  useLayoutEffect(() => {
    if (!focusToken || !editorRef.current) return
    const editor = editorRef.current
    editor.focus()
    if (source) editor.setSelectionRange(editor.value.length, editor.value.length)
    else {
      const paragraph = editor.ownerDocument.createElement('p')
      paragraph.append(editor.ownerDocument.createElement('br'))
      editor.append(paragraph)
      editor.ownerDocument.getSelection().collapse(paragraph, 0)
    }
  }, [focusToken, source])

  const rememberSelection = () => {
    const selection = editorRef.current.ownerDocument.getSelection()
    if (selection?.rangeCount && editorRef.current.contains(selection.anchorNode) &&
        editorRef.current.contains(selection.focusNode)) range.current = selection.getRangeAt(0).cloneRange()
  }

  const report = () => {
    onChange(readEditor(editorRef.current, initial.current))
    rememberSelection()
  }

  const command = (name, value) => {
    const editor = editorRef.current
    const dom = editor.ownerDocument
    const selection = dom.getSelection()
    editor.focus()
    if (range.current && editor.contains(range.current.commonAncestorContainer)) {
      selection.removeAllRanges()
      selection.addRange(range.current)
    }
    dom.execCommand('defaultParagraphSeparator', false, 'p')
    dom.execCommand(name, false, value)
    report()
  }

  return <>
    {editable && <div className={styles.formatBar} role="group" aria-label="文件格式">
      {!source && <>
        <select aria-label="段落樣式" value="" onChange={event => command('formatBlock', event.target.value)}>
          <option value="" disabled>段落樣式</option>
          <option value="p">一般文字</option>
          <option value="h1">文件標題</option>
          <option value="h2">大標題</option>
          <option value="h3">小標題</option>
        </select>
        {actions.map(([name, label, Icon]) =>
          <button key={name} type="button" title={label} aria-label={label}
            onMouseDown={event => event.preventDefault()} onClick={() => command(name)}>
            <Icon size={17} />
          </button>)}
      </>}
      <button className={styles.sourceButton} type="button" onClick={onSource} aria-pressed={source}>
        <Code size={16} />{source ? '回到文件' : 'Markdown'}
      </button>
    </div>}
    {source
      ? <textarea ref={editorRef} className={styles.source} aria-label="Markdown 原始內容" value={section.content}
          readOnly={!editable} onChange={event => onChange(event.target.value)} spellCheck={false} />
      : <div ref={editorRef} className={styles.document} aria-label="文件內容" role="textbox" aria-multiline="true"
          aria-readonly={!editable} contentEditable={editable} suppressContentEditableWarning
          onInput={event => { if (!event.nativeEvent.isComposing) report() }} onCompositionEnd={report}
          onFocus={event => event.currentTarget.ownerDocument.execCommand('defaultParagraphSeparator', false, 'p')}
          onKeyUp={rememberSelection} onMouseUp={rememberSelection} onBlur={rememberSelection}
          onDrop={event => event.preventDefault()}
          onPaste={event => { event.preventDefault(); command('insertText', event.clipboardData.getData('text/plain')) }} />}
  </>
}
