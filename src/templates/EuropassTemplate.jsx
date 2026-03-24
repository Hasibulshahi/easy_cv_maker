function EuropassTemplate({ form, experiences, education, skillList }) {
  const initials = (form.fullName || 'YN')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('')

  const personalItems = [
    { icon: '👤', value: form.fullName },
    { icon: '✉', value: form.email },
    { icon: '☎', value: form.phone },
    { icon: '⌂', value: form.location },
    { icon: '🌐', value: form.website },
    { icon: 'in', value: form.linkedIn },
  ].filter((item) => item.value)

  return (
    <div className="cv-preview europass">
      <section className="eu-layout">
        <aside className="eu-side">
          <div className="eu-side-top">
            <h2>{form.fullName || 'Your Name'}</h2>
            <p>{form.title || 'Professional Title'}</p>
          </div>

          <div className="eu-photo-wrap">
            {form.photoUrl ? (
              <img className="eu-photo" src={form.photoUrl} alt={form.fullName || 'Profile'} />
            ) : (
              <div className="eu-photo eu-photo-fallback">{initials}</div>
            )}
          </div>

          <section className="eu-personal">
            <h3>Personal details</h3>
            <ul>
              {personalItems.map((item, index) => (
                <li key={`p-${index}`}>
                  <span className={`eu-icon ${item.icon === 'in' ? 'linkedin' : ''}`}>{item.icon}</span>
                  <span>{item.value}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="eu-personal eu-skills-box">
            <h3>Skills</h3>
            <ul>
              {skillList.map((skill) => (
                <li key={skill}>
                  <span className="eu-icon">•</span>
                  <span>{skill}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        <div className="eu-main">
          <section className="eu-section">
            <h3>Profile</h3>
            <p>{form.summary}</p>
          </section>

          <section className="eu-section">
            <h3>Education</h3>
            {education
              .filter((item) => item.school || item.degree)
              .map((item, index) => (
                <article key={`eu-edu-${index}`} className="eu-edu-item">
                  <div className="eu-edu-head">
                    <strong>{item.degree || 'Degree'}</strong>
                    <span>{item.period || 'Period'}</span>
                  </div>
                  <p>{item.school}</p>
                  {item.period && <small>{item.period}</small>}
                </article>
              ))}
          </section>

          <section className="eu-section">
            <h3>Experience</h3>
            {experiences
              .filter((item) => item.role || item.company || item.details)
              .map((item, index) => (
                <article className="eu-exp-item" key={`eu-exp-${index}`}>
                  <div className="eu-edu-head">
                    <strong>
                      <span className="eu-role">{item.role || 'Role'}</span>
                      {item.company && <span className="eu-company-inline"> | {item.company}</span>}
                    </strong>
                    <span>{item.period || 'Period'}</span>
                  </div>
                  <p>{item.details}</p>
                </article>
              ))}
          </section>
        </div>
      </section>
    </div>
  )
}

export default EuropassTemplate
