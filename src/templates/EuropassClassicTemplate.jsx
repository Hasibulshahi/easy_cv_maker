import europassFlag from '../assets/europass-flag.svg'

function EuropassClassicTemplate({ form, experiences, education, skillList, languageList }) {
  const toUrl = (value = '') => {
    const trimmed = value.trim()
    if (!trimmed) return ''
    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  }

  const boldText = (text = '') => {
    const parts = text.split(/\*\*(.+?)\*\*/)
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
    )
  }

  const topContactItems = [
    form.passportNumber && (
      <span key="passport" className="ec-contact-item">
        <strong>Passport:</strong> {form.passportNumber}
      </span>
    ),
    form.nationality && (
      <span key="nationality" className="ec-contact-item">
        <strong>Nationality:</strong> {form.nationality}
      </span>
    ),
    form.workPermit && (
      <span key="workPermit" className="ec-contact-item">
        <strong>Work permit:</strong> {form.workPermit}
      </span>
    ),
    form.phone && (
      <span key="phone" className="ec-contact-item">
        <strong>Phone:</strong> {form.phone}
      </span>
    ),
    form.email && (
      <span key="email" className="ec-contact-item">
        <strong>Email:</strong>{' '}
        <a href={`mailto:${form.email}`}>{form.email}</a>
      </span>
    ),
    form.website && (
      <span key="website" className="ec-contact-item">
        <strong>Portfolio:</strong>{' '}
        <a href={toUrl(form.website)} target="_blank" rel="noreferrer noopener">
          {form.fullName}
        </a>
      </span>
    ),
    form.linkedIn && (
      <span key="linkedin" className="ec-contact-item">
        <strong>LinkedIn:</strong>{' '}
        <a href={toUrl(form.linkedIn)} target="_blank" rel="noreferrer noopener">
          {form.fullName}
        </a>
      </span>
    ),
  ].filter(Boolean)

  return (
    <div className="cv-preview europass-classic">
      {/* HEADER */}
      <section className="ec-header-with-photo">
        {form.photoUrl && (
          <img className="ec-header-photo" src={form.photoUrl} alt={form.fullName} />
        )}
        <div className="ec-header-content">
          <div className="ec-head-row">
            <h1 className="ec-name">{form.fullName || 'Your Name'}</h1>
            <div className="ec-brand" aria-label="europass brand mark">
              <img className="ec-brand-flag" src={europassFlag} alt="" aria-hidden="true" />
              <span className="ec-brand-text">europass</span>
            </div>
          </div>
          <div className="ec-head-divider" />
          <div className="ec-contact-lines">
            {topContactItems.length > 0 && (
              <div className="ec-contact-line">{topContactItems}</div>
            )}
            {form.location && (
              <div className="ec-contact-line">
                <span className="ec-contact-item">
                  <strong>Address:</strong> {form.location}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* WORK EXPERIENCE */}
      {experiences.some((item) => item.role || item.company) && (
        <section className="ec-section">
          <h2 className="ec-section-title">▪ WORK EXPERIENCE</h2>
          <div className="ec-entries">
            {experiences
              .filter((item) => item.role || item.company)
              .map((item, index) => (
                <div key={`exp-${index}`} className="ec-entry ec-exp-entry">
                  <div className="ec-entry-head">
                    <div className="ec-entry-title ec-exp-title">
                      <strong>
                        {item.role || 'Position'}
                        {item.company && ` – ${item.company}`}
                      </strong>
                    </div>
                    {item.period && <div className="ec-entry-period">{item.period}</div>}
                  </div>
                  {item.location && <div className="ec-entry-meta">{item.location}</div>}
                  {item.details && (
                    <div className="ec-entry-description">
                      {boldText(item.details)}
                      {item.detailsUrl?.trim() && (
                        <>
                          <br />
                          <a
                            className="ec-entry-link"
                            href={toUrl(item.detailsUrl)}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            Details
                          </a>
                        </>
                      )}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </section>
      )}

      {/* EDUCATION AND TRAINING */}
      {education.some((item) => item.school || item.degree) && (
        <section className="ec-section">
          <h2 className="ec-section-title">▪ EDUCATION AND TRAINING</h2>
          <div className="ec-entries">
            {education
              .filter((item) => item.school || item.degree)
              .map((item, index) => (
                <div key={`edu-${index}`} className="ec-entry">
                  <div className="ec-entry-head">
                    <div className="ec-entry-title">
                      <strong>{(item.degree || 'Degree').toUpperCase()}</strong>
                      {item.school && (
                        <span className="ec-entry-school">
                          {' '}
                          from <strong>{item.school}</strong>
                        </span>
                      )}
                    </div>
                    {item.period && <div className="ec-entry-period">{item.period}</div>}
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* LANGUAGE SKILLS */}
      {languageList.length > 0 && (
        <section className="ec-section">
          <h2 className="ec-section-title">▪ LANGUAGE SKILLS</h2>
          <div className="ec-language-content">
            <p className="ec-language-intro">
              Mother tounge: <strong>{languageList[0] || 'Not specified'}</strong>
              {languageList.length > 1 && (
                <>
                  {' '}
                  | Other languages: {languageList.slice(1).join(', ')}
                </>
              )}
            </p>
          </div>
        </section>
      )}

      {/* SKILLS */}
      {skillList.length > 0 && (
        <section className="ec-section">
          <h2 className="ec-section-title">▪ SKILLS</h2>
          <div className="ec-skills-list">
            <p className="ec-skill-item">{skillList.join(' | ')}</p>
          </div>
        </section>
      )}
    </div>
  )
}

export default EuropassClassicTemplate

