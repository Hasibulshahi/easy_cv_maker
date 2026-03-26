import { useMemo, useState } from 'react'
import { jsPDF } from 'jspdf'
import './App.css'
import StandardTemplate from './templates/StandardTemplate'
import MordernTemplate2 from './templates/MordernTemplate2'
import EuropassClassicTemplate from './templates/EuropassClassicTemplate'

const toExternalUrl = (value = '') => {
  const trimmed = value.trim()
  if (!trimmed) {
    return ''
  }

  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
}

const stripFormattingMarkers = (value = '') => value.replace(/\*\*(.+?)\*\*/g, '$1').replace(/\r/g, '')

const defaultData = {
  fullName: 'Alex Morgan',
  title: 'Product Designer',
  email: 'alex@example.com',
  phone: '+1 (555) 0142',
  passportNumber: '',
  nationality: '',
  workPermit: '',
  location: 'San Francisco, CA',
  website: 'portfolio.example.com',
  linkedIn: 'linkedin.com/in/alex-morgan',
  photoUrl: '',
  summary:
    'Designer focused on turning complex workflows into clear, human-centered products with measurable business impact.',
  skills: 'Figma, UX Research, Design Systems, Prototyping, Product Strategy',
  languages: 'English, Spanish',
}

const emptyExperience = {
  role: '',
  company: '',
  period: '',
  details: '',
  detailsUrl: '',
}

const emptyEducation = {
  school: '',
  degree: '',
  period: '',
}

const templateOptions = [
  { value: 'modern', label: 'Modern' },
  { value: 'classic', label: 'Classic' },
  { value: 'modern2', label: 'Modern 2' },
  { value: 'europass', label: 'Europass Classic' },
]

function App() {
  const [form, setForm] = useState(defaultData)
  const [template, setTemplate] = useState('modern')
  const [isExporting, setIsExporting] = useState(false)
  const [experiences, setExperiences] = useState([
    {
      role: 'Senior Product Designer',
      company: 'Northpeak Labs',
      period: '2022 - Present',
      details:
        'Led redesign of onboarding flow, improving trial-to-paid conversion by 18% and reducing support tickets by 23%.',
      detailsUrl: '',
    },
    {
      role: 'Product Designer',
      company: 'Bloomly',
      period: '2019 - 2022',
      details:
        'Built scalable component library and partnered with engineering to ship 30+ experiments across web and mobile.',
      detailsUrl: '',
    },
  ])
  const [education, setEducation] = useState([
    {
      school: 'California College of the Arts',
      degree: 'BFA, Interaction Design',
      period: '2015 - 2019',
    },
  ])
  const skillList = useMemo(
    () => form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
    [form.skills],
  )

  const languageList = useMemo(
    () => (form.languages || '').split(',').map((language) => language.trim()).filter(Boolean),
    [form.languages],
  )

  const updateForm = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const updateExperience = (index, key, value) => {
    setExperiences((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    )
  }

  const updateEducation = (index, key, value) => {
    setEducation((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    )
  }

  const addExperience = () => setExperiences((prev) => [...prev, { ...emptyExperience }])
  const addEducation = () => setEducation((prev) => [...prev, { ...emptyEducation }])

  const removeExperience = (index) => {
    setExperiences((prev) => prev.filter((_, i) => i !== index))
  }

  const removeEducation = (index) => {
    setEducation((prev) => prev.filter((_, i) => i !== index))
  }

  const handlePhotoUpload = (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateForm('photoUrl', reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  const handleDownloadPdf = async () => {
    if (isExporting) {
      return
    }

    try {
      setIsExporting(true)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 14
      const contentWidth = pageWidth - margin * 2
      const bottomLimit = pageHeight - 14
      let cursorY = 18

      const ensureSpace = (height = 6) => {
        if (cursorY + height <= bottomLimit) {
          return
        }

        pdf.addPage()
        cursorY = 18
      }

      const writeWrappedText = (text, options = {}) => {
        const {
          size = 10,
          style = 'normal',
          color = [20, 20, 20],
          indent = 0,
          gapAfter = 1.5,
          lineGap = 4.8,
        } = options

        const normalizedText = stripFormattingMarkers(text).trim()
        if (!normalizedText) {
          return
        }

        pdf.setFont('helvetica', style)
        pdf.setFontSize(size)
        pdf.setTextColor(...color)

        const lines = pdf.splitTextToSize(normalizedText, contentWidth - indent)
        lines.forEach((line) => {
          ensureSpace(lineGap)
          pdf.text(line, margin + indent, cursorY)
          cursorY += lineGap
        })

        cursorY += gapAfter
      }

      const writeSectionTitle = (title) => {
        ensureSpace(8)
        pdf.setFont('helvetica', 'bold')
        pdf.setFontSize(11)
        pdf.setTextColor(0, 0, 0)
        pdf.text(title.toUpperCase(), margin, cursorY)
        cursorY += 2
        pdf.setDrawColor(0, 0, 0)
        pdf.line(margin, cursorY, pageWidth - margin, cursorY)
        cursorY += 5
      }

      const writeLeftRightLine = (leftText, rightText, options = {}) => {
        const {
          size = 10.5,
          style = 'bold',
          color = [20, 20, 20],
          gapAfter = 0.8,
          lineGap = 4.8,
          rightGap = 2,
        } = options

        const left = stripFormattingMarkers(leftText || '').trim()
        const right = stripFormattingMarkers(rightText || '').trim()

        if (!left && !right) {
          return
        }

        pdf.setFont('helvetica', style)
        pdf.setFontSize(size)
        pdf.setTextColor(...color)

        const rightWidth = right ? pdf.getTextWidth(right) + rightGap : 0
        const maxLeftWidth = Math.max(30, contentWidth - rightWidth)
        const leftLines = left ? pdf.splitTextToSize(left, maxLeftWidth) : ['']

        leftLines.forEach((line, index) => {
          ensureSpace(lineGap)
          pdf.text(line, margin, cursorY)

          if (index === 0 && right) {
            const rightX = pageWidth - margin - pdf.getTextWidth(right)
            pdf.text(right, rightX, cursorY)
          }

          cursorY += lineGap
        })

        cursorY += gapAfter
      }

      const writeLabelValueLine = (label, value, options = {}) => {
        if (!value?.trim()) {
          return
        }

        const fullText = `${label}: ${value.trim()}`
        writeWrappedText(fullText, options)
      }

      const writeLabelWithLink = (label, rawValue) => {
        const url = toExternalUrl(rawValue || '')
        if (!url) {
          return
        }

        ensureSpace(4.8)
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(9.5)
        pdf.setTextColor(45, 45, 45)

        const labelText = `${label}: `
        pdf.text(labelText, margin, cursorY)

        const linkX = margin + pdf.getTextWidth(labelText)
        pdf.setTextColor(20, 70, 160)
        pdf.textWithLink(url, linkX, cursorY, { url })
        cursorY += 5
      }

      pdf.setFont('helvetica', 'bold')
      pdf.setFontSize(18)
      pdf.setTextColor(0, 0, 0)
      pdf.text((form.fullName || 'Your Name').toUpperCase(), margin, cursorY)
      cursorY += 7

      if (form.title?.trim()) {
        pdf.setFont('helvetica', 'normal')
        pdf.setFontSize(11)
        pdf.setTextColor(60, 60, 60)
        pdf.text(form.title.trim(), margin, cursorY)
        cursorY += 6
      }

      pdf.setDrawColor(140, 140, 140)
      pdf.line(margin, cursorY - 1.2, pageWidth - margin, cursorY - 1.2)
      cursorY += 1.5

      const contactLines = [
        [form.email?.trim(), form.phone?.trim(), form.location?.trim()].filter(Boolean).join(' | '),
        [
          form.passportNumber?.trim() && `Passport: ${form.passportNumber.trim()}`,
          form.nationality?.trim() && `Nationality: ${form.nationality.trim()}`,
          form.workPermit?.trim() && `Work permit: ${form.workPermit.trim()}`,
        ]
          .filter(Boolean)
          .join(' | '),
      ].filter(Boolean)

      contactLines.forEach((line) => {
        writeWrappedText(line, { size: 9.5, color: [45, 45, 45], gapAfter: 0.6, lineGap: 4.4 })
      })

      writeLabelWithLink('Portfolio', form.website)
      writeLabelWithLink('LinkedIn', form.linkedIn)

      cursorY += 2

      if (form.summary?.trim()) {
        writeSectionTitle('Professional Summary')
        writeWrappedText(form.summary, { size: 10, gapAfter: 3 })
      }

      const populatedExperiences = experiences.filter(
        (item) => item.role || item.company || item.period || item.details,
      )

      if (populatedExperiences.length > 0) {
        writeSectionTitle('Work Experience')

        populatedExperiences.forEach((item, index) => {
          const roleCompany = [item.role?.trim(), item.company?.trim()].filter(Boolean).join(' - ')
          writeLeftRightLine(roleCompany, item.period?.trim(), { size: 10.5, style: 'bold', gapAfter: 0.8 })

          if (item.location?.trim()) {
            writeWrappedText(item.location, { size: 9.5, color: [70, 70, 70], gapAfter: 0.6 })
          }

          const detailLines = stripFormattingMarkers(item.details || '')
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean)

          detailLines.forEach((line) => {
            writeWrappedText(`- ${line}`, { size: 10, indent: 2, gapAfter: 0.6 })
          })

          writeLabelValueLine('Details', toExternalUrl(item.detailsUrl || ''), {
            size: 9.5,
            color: [45, 45, 45],
            gapAfter: 2.2,
          })

          if (index < populatedExperiences.length - 1) {
            ensureSpace(3)
            const dividerStart = margin + contentWidth * 0.25
            const dividerEnd = margin + contentWidth * 0.75
            pdf.setDrawColor(185, 185, 185)
            pdf.line(dividerStart, cursorY - 0.5, dividerEnd, cursorY - 0.5)
            cursorY += 2.2
          }
        })
      }

      const populatedEducation = education.filter((item) => item.school || item.degree || item.period)

      if (populatedEducation.length > 0) {
        writeSectionTitle('Education')

        populatedEducation.forEach((item) => {
          const degreeLine = [item.degree?.trim(), item.school?.trim() && `from ${item.school.trim()}`]
            .filter(Boolean)
            .join(' ')

          writeLeftRightLine(degreeLine, item.period?.trim(), { size: 10.5, style: 'bold', gapAfter: 2.2 })
        })
      }

      if (skillList.length > 0) {
        writeSectionTitle('Skills')
        writeWrappedText(skillList.join(', '), { size: 10, gapAfter: 3 })
      }

      if (languageList.length > 0) {
        writeSectionTitle('Languages')
        const otherLanguages = languageList.slice(1).join(', ')
        const languageLine = otherLanguages
          ? `Mother tongue: ${languageList[0]} | Other languages: ${otherLanguages}`
          : `Mother tongue: ${languageList[0]}`
        writeWrappedText(languageLine, { size: 10, gapAfter: 2 })
      }

      const safeName = (form.fullName || 'cv')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

      pdf.save(`${safeName || 'cv'}-${template}.pdf`)
    } catch (error) {
      console.error('CV export failed:', error)
      window.alert('Could not download CV PDF. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="hero">
        <p className="badge">Easy CV Maker</p>
        <h1>Build your CV in minutes</h1>
        <p className="subtitle">
          Fill in your details, choose a style, and print a clean one-page resume.
        </p>
      </header>

      <section className="workspace">
        <aside className="editor">
          <div className="panel-head">
            <h2>Editor</h2>
            <div className="template-switch">
              <label htmlFor="template-select">CV Type</label>
              <select
                id="template-select"
                className="template-select"
                value={template}
                onChange={(e) => setTemplate(e.target.value)}
              >
                {templateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field-grid">
            <label>
              Full name
              <input
                value={form.fullName}
                onChange={(e) => updateForm('fullName', e.target.value)}
              />
            </label>
            <label>
              Professional title
              <input value={form.title} onChange={(e) => updateForm('title', e.target.value)} />
            </label>
            <label>
              Email
              <input value={form.email} onChange={(e) => updateForm('email', e.target.value)} />
            </label>
            <label>
              Phone
              <input value={form.phone} onChange={(e) => updateForm('phone', e.target.value)} />
            </label>
            <label>
              Passport number
              <input
                value={form.passportNumber || ''}
                onChange={(e) => updateForm('passportNumber', e.target.value)}
              />
            </label>
            <label>
              Nationality
              <input
                value={form.nationality || ''}
                onChange={(e) => updateForm('nationality', e.target.value)}
              />
            </label>
            <label>
              Work permit
              <input
                value={form.workPermit || ''}
                onChange={(e) => updateForm('workPermit', e.target.value)}
              />
            </label>
            <label>
              Location
              <input
                value={form.location}
                onChange={(e) => updateForm('location', e.target.value)}
              />
            </label>
            <label>
              Website
              <input
                value={form.website}
                onChange={(e) => updateForm('website', e.target.value)}
              />
            </label>
            <label>
              LinkedIn
              <input
                value={form.linkedIn || ''}
                onChange={(e) => updateForm('linkedIn', e.target.value)}
              />
            </label>
            <label className="full-row">
              Upload photo
              <input type="file" accept="image/*" onChange={handlePhotoUpload} />
            </label>
            <label className="full-row">
              Professional summary
              <textarea
                rows="4"
                value={form.summary}
                onChange={(e) => updateForm('summary', e.target.value)}
              />
            </label>
            <label className="full-row">
              Skills (comma separated)
              <input
                value={form.skills}
                onChange={(e) => updateForm('skills', e.target.value)}
              />
            </label>
            <label className="full-row">
              Languages (comma separated)
              <input
                value={form.languages || ''}
                onChange={(e) => updateForm('languages', e.target.value)}
              />
            </label>
          </div>

          <div className="section-title-row">
            <h3>Experience</h3>
            <button type="button" className="ghost" onClick={addExperience}>
              + Add
            </button>
          </div>
          {experiences.map((item, index) => (
            <div className="block" key={`exp-${index}`}>
              <label>
                Role
                <input
                  value={item.role}
                  onChange={(e) => updateExperience(index, 'role', e.target.value)}
                />
              </label>
              <label>
                Company
                <input
                  value={item.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                />
              </label>
              <label>
                Period
                <input
                  value={item.period}
                  onChange={(e) => updateExperience(index, 'period', e.target.value)}
                />
              </label>
              <label className="full-row">
                Highlights (one bullet per line)
                <textarea
                  rows="3"
                  value={item.details}
                  onChange={(e) => updateExperience(index, 'details', e.target.value)}
                />
              </label>
              <label className="full-row">
                Details URL (optional)
                <input
                  value={item.detailsUrl || ''}
                  onChange={(e) => updateExperience(index, 'detailsUrl', e.target.value)}
                  placeholder="https://example.com/project-details"
                />
              </label>
              <button type="button" className="delete" onClick={() => removeExperience(index)}>
                Remove experience
              </button>
            </div>
          ))}

          <div className="section-title-row">
            <h3>Education</h3>
            <button type="button" className="ghost" onClick={addEducation}>
              + Add
            </button>
          </div>
          {education.map((item, index) => (
            <div className="block" key={`edu-${index}`}>
              <label>
                School
                <input
                  value={item.school}
                  onChange={(e) => updateEducation(index, 'school', e.target.value)}
                />
              </label>
              <label>
                Degree
                <input
                  value={item.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                />
              </label>
              <label>
                Period
                <input
                  value={item.period}
                  onChange={(e) => updateEducation(index, 'period', e.target.value)}
                />
              </label>
              <button type="button" className="delete" onClick={() => removeEducation(index)}>
                Remove education
              </button>
            </div>
          ))}

          <button type="button" className="print-btn" onClick={handleDownloadPdf}>
            {isExporting ? 'Generating PDF...' : 'Print / Save as PDF'}
          </button>
        </aside>

        <section className="preview-wrap">
          <div className="preview-head">
            <h2>Preview</h2>
          </div>
          <div className="preview-canvas">
            {template === 'modern2' ? (
              <MordernTemplate2
                form={form}
                experiences={experiences}
                education={education}
                skillList={skillList}
                languageList={languageList}
              />
            ) : template === 'europass' ? (
              <EuropassClassicTemplate
                form={form}
                experiences={experiences}
                education={education}
                skillList={skillList}
                languageList={languageList}
              />
            ) : (
              <StandardTemplate
                form={form}
                experiences={experiences}
                education={education}
                skillList={skillList}
                languageList={languageList}
                variant={template}
              />
            )}
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
