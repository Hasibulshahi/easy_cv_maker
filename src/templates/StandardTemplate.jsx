function StandardTemplate({ form, experiences, education, skillList, languageList, variant }) {
  const toUrl = (value = '') => {
    const trimmed = value.trim()
    if (!trimmed) {
      return ''
    }

    return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`
  }

  const contactItems = [
    form.email?.trim() ? { key: 'email', text: form.email.trim() } : null,
    form.phone?.trim() ? { key: 'phone', text: form.phone.trim() } : null,
    form.location?.trim() ? { key: 'location', text: form.location.trim() } : null,
    form.website?.trim()
      ? { key: 'portfolio', text: 'Portfolio', href: toUrl(form.website) }
      : null,
    form.linkedIn?.trim()
      ? { key: 'linkedin', text: 'LinkedIn', href: toUrl(form.linkedIn) }
      : null,
  ].filter(Boolean)

  return (
    <div className={`cv-preview ${variant}`}>
      <header className="cv-head">
        <div className="cv-head-inner">
          <div className="cv-head-text">
            <h2>{form.fullName || 'Your Name'}</h2>
            <p className="role">{form.title || 'Professional Title'}</p>
            <p className="contact">
              {contactItems.map((item, index) => (
                <span key={item.key}>
                  {index > 0 && ' | '}
                  {item.href ? (
                    <a href={item.href} target="_blank" rel="noreferrer noopener">
                      {item.text}
                    </a>
                  ) : (
                    item.text
                  )}
                </span>
              ))}
            </p>
          </div>
          {variant === 'modern' && form.photoUrl && (
            <img className="cv-head-photo" src={form.photoUrl} alt={form.fullName || 'Profile'} />
          )}
        </div>
      </header>

      <section className="cv-section">
        <h3>Experience</h3>
        {experiences
          .filter((item) => item.role || item.company || item.details)
          .map((item, index) => (
            <article className="timeline-item" key={`p-exp-${index}`}>
              <div className="line-1">
                <strong>
                  {item.role || 'Role'}
                  {item.company && <span className="line-1-company"> @ {item.company}</span>}
                </strong>
                <span>{item.period}</span>
              </div>
              <div className="exp-details-row">
                <p className="exp-details-text">{item.details}</p>
                {item.detailsUrl?.trim() && (
                  <a
                    className="exp-details-link"
                    href={toUrl(item.detailsUrl)}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    Details
                  </a>
                )}
              </div>
            </article>
          ))}
      </section>

      <section className="cv-section split">
        <div>
          <h3>Education</h3>
          {education
            .filter((item) => item.school || item.degree)
            .map((item, index) => (
              <article key={`p-edu-${index}`} className="edu-item">
                <strong>{item.degree || 'Degree'}</strong>
                <p>{item.school}</p>
                <span>{item.period}</span>
              </article>
            ))}

          <h3>Languages</h3>
          <ul className="skill-list">
            {languageList.map((language) => (
              <li key={language}>{language}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Skills</h3>
          <ul className="skill-list">
            {skillList.map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default StandardTemplate
