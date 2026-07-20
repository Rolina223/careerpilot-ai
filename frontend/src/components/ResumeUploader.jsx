import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import * as mammoth from 'mammoth'
import { motionTokens } from './motion/MotionPrimitives'

async function extractTextFromPDF(file) {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const viewport = page.getViewport({ scale: 1 })

    // Sort items by vertical position (top to bottom), then horizontal (left to right)
    const sorted = [...content.items].sort((a, b) => {
      const yDiff = Math.round(viewport.height - b.transform[5]) - Math.round(viewport.height - a.transform[5])
      if (Math.abs(yDiff) > 5) return yDiff
      return a.transform[4] - b.transform[4]
    })

    let pageText = ''
    let lastY = null

    for (const item of sorted) {
      const y = Math.round(viewport.height - item.transform[5])
      if (lastY !== null && Math.abs(y - lastY) > 5) {
        pageText += '\n'
      }
      pageText += item.str + ' '
      lastY = y
    }

    fullText += pageText.trim() + '\n\n'
  }

  return fullText.trim()
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
      if (!text || text.trim().length < 50) {
        setFileName('')
        setError('This PDF appears to be image-based or scanned — text could not be extracted. Try converting it to DOCX, or paste your resume text manually in the box below.')
        onTextExtracted('')
      } else {
        onTextExtracted(text)
      }
    } catch {
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
      <motion.div
        onClick={() => fileRef.current.click()}
        onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        animate={{ scale: isDragging ? 1.015 : 1, borderColor: isDragging ? 'var(--color-brand)' : 'rgba(56,189,248,0.25)' }}
        whileHover={{ y: -2, backgroundColor: 'rgba(56,189,248,0.05)', borderColor: 'rgba(56,189,248,0.5)' }}
        whileTap={{ scale: 0.99 }}
        transition={motionTokens.spring}
        style={{
          padding: '20px',
          backgroundColor: isDragging
            ? 'rgba(56,189,248,0.1)'
            : 'rgba(255,255,255,0.02)',
          border: isDragging
            ? '2px dashed var(--color-brand)'
            : '2px dashed rgba(56,189,248,0.25)',
          borderRadius: '12px',
          textAlign: 'center',
          cursor: 'pointer',
          marginBottom: '8px',
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
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 0.85, repeat: Infinity, ease: 'linear' }}
              style={{
              width: '28px',
              height: '28px',
              border: '3px solid rgba(56,189,248,0.2)',
              borderTop: '3px solid var(--color-brand)',
              borderRadius: '50%',
              margin: '0 auto 8px',
            }} />
            <p style={{ color: 'var(--color-brand)', fontSize: '13px' }}>
              Extracting text...
            </p>
          </div>
        ) : fileName ? (
          <div>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>✅</div>
            <p style={{ color: 'var(--color-success)', fontSize: '13px', fontWeight: '600' }}>
              {fileName}
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '11px' }}>
              Text extracted! Click to change file.
            </p>
          </div>
        ) : (
          <div>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📁</div>
            <p style={{ color: 'var(--color-brand)', fontSize: '13px', fontWeight: '600' }}>
              Upload PDF or DOC
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '11px', marginTop: '4px' }}>
              Drag & drop or click to browse
            </p>
          </div>
        )}
      </motion.div>

      {/* Error */}
      {error && (
        <p style={{
          color: 'var(--color-danger)',
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
