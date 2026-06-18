import { useState, useRef } from 'react'
import * as mammoth from 'mammoth'

async function extractTextFromPDF(file) {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`
  
  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let text = ''
  
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    text += content.items.map(item => item.str).join(' ') + '\n'
  }
  
  return text
}

async function extractTextFromDOC(file) {
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value
}

function ResumeUploader({ onTextExtracted }) {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef(null)

  const handleFile = async (file) => {
    if (!file) return

    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    
    if (!allowed.includes(file.type)) {
      setError('Only PDF, DOC, DOCX files allowed!')
      return
    }

    setError('')
    setLoading(true)
    setFileName(file.name)

    try {
      let text = ''
      if (file.type === 'application/pdf') {
        text = await extractTextFromPDF(file)
      } else {
        text = await extractTextFromDOC(file)
      }
      onTextExtracted(text)
    } catch (err) {
      setError('Could not read file. Please paste text manually.')
    } finally {
      setLoading(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    handleFile(file)
  }

  return (
    <div style={{ marginBottom: '12px' }}>

      {/* Upload Box */}
      <div
        onClick={() => fileRef.current.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          padding: '20px',
          backgroundColor: isDragging
            ? 'rgba(56,189,248,0.1)'
            : 'rgba(255,255,255,0.02)',
          border: isDragging
            ? '2px dashed #38bdf8'
            : '2px dashed rgba(56,189,248,0.25)',
          borderRadius: '12px',
          textAlign: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: '8px',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.backgroundColor = 'rgba(56,189,248,0.05)'
          e.currentTarget.style.borderColor = 'rgba(56,189,248,0.5)'
        }}
        onMouseLeave={e => {
          if (!isDragging) {
            e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'
            e.currentTarget.style.borderColor = 'rgba(56,189,248,0.25)'
          }
        }}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          onChange={e => handleFile(e.target.files[0])}
        />

        {loading ? (
          <div>
            <div style={{
              width: '28px',
              height: '28px',
              border: '3px solid rgba(56,189,248,0.2)',
              borderTop: '3px solid #38bdf8',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 8px',
            }} />
            <p style={{ color: '#38bdf8', fontSize: '13px' }}>
              Extracting text...
            </p>
          </div>
        ) : fileName ? (
          <div>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>✅</div>
            <p style={{ color: '#34d399', fontSize: '13px', fontWeight: '600' }}>
              {fileName}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
              Text extracted! Click to change file.
            </p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📁</div>
            <p style={{ color: '#38bdf8', fontSize: '13px', fontWeight: '600' }}>
              Upload PDF or DOC
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>
              Drag & drop or click to browse
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <p style={{
          color: '#fb7185',
          fontSize: '12px',
          marginBottom: '8px',
        }}>
          ⚠️ {error}
        </p>
      )}

      {/* Divider */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '8px',
      }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
        <span style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>OR</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255,255,255,0.08)' }} />
      </div>

    </div>
  )
}

export default ResumeUploader