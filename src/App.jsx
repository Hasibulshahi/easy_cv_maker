import { useMemo, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import { jsPDF } from 'jspdf'
import './App.css'
import StandardTemplate from './templates/StandardTemplate'
import EuropassTemplate from './templates/EuropassTemplate'

const defaultData = {
  fullName: 'Alex Morgan',
  title: 'Product Designer',
  email: 'alex@example.com',
  phone: '+1 (555) 0142',
  location: 'San Francisco, CA',
  website: 'portfolio.example.com',
  linkedIn: 'linkedin.com/in/alex-morgan',
  photoUrl: '',
  summary:
    'Designer focused on turning complex workflows into clear, human-centered products with measurable business impact.',
  skills: 'Figma, UX Research, Design Systems, Prototyping, Product Strategy',
}

const emptyExperience = {
  role: '',
  company: '',
  period: '',
  details: '',
}

const emptyEducation = {
  school: '',
  degree: '',
  period: '',
}

const templateOptions = [
  { value: 'modern', label: 'Modern' },
  { value: 'classic', label: 'Classic' },
  { value: 'europass', label: 'Europass' },
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
    },
    {
      role: 'Product Designer',
      company: 'Bloomly',
      period: '2019 - 2022',
      details:
        'Built scalable component library and partnered with engineering to ship 30+ experiments across web and mobile.',
    },
  ])
  const [education, setEducation] = useState([
    {
      school: 'California College of the Arts',
      degree: 'BFA, Interaction Design',
      period: '2015 - 2019',
    },
  ])
  const previewRef = useRef(null)

  const skillList = useMemo(
    () => form.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
    [form.skills],
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
    if (!previewRef.current || isExporting) {
      return
    }

    try {
      setIsExporting(true)

      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })

      const imageData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imageWidth = pageWidth
      const imageHeight = (canvas.height * imageWidth) / canvas.width

      let heightLeft = imageHeight
      let yPosition = 0

      pdf.addImage(imageData, 'PNG', 0, yPosition, imageWidth, imageHeight, '', 'FAST')
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        yPosition = heightLeft - imageHeight
        pdf.addPage()
        pdf.addImage(imageData, 'PNG', 0, yPosition, imageWidth, imageHeight, '', 'FAST')
        heightLeft -= pageHeight
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
        <p className="badge">React CV Maker</p>
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
              Photo URL (for Europass)
              <input
                value={form.photoUrl || ''}
                onChange={(e) => updateForm('photoUrl', e.target.value)}
                placeholder="https://example.com/your-photo.jpg"
              />
            </label>
            <label className="full-row">
              Upload photo (for Europass)
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
                Highlights
                <textarea
                  rows="3"
                  value={item.details}
                  onChange={(e) => updateExperience(index, 'details', e.target.value)}
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
          <div className="preview-canvas" ref={previewRef}>
            {template === 'europass' ? (
              <EuropassTemplate
                form={form}
                experiences={experiences}
                education={education}
                skillList={skillList}
              />
            ) : (
              <StandardTemplate
                form={form}
                experiences={experiences}
                education={education}
                skillList={skillList}
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
