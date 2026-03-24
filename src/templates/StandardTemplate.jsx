function StandardTemplate({ form, experiences, education, skillList, variant }) {
  return (
    <div className={`cv-preview ${variant}`}>
      <header className="cv-head">
        <h2>{form.fullName || 'Your Name'}</h2>
        <p className="role">{form.title || 'Professional Title'}</p>
        <p className="contact">
          {[form.email, form.phone, form.location, form.website].filter(Boolean).join(' | ')}
        </p>
      </header>

      <section className="cv-section">
        <h3>Profile</h3>
        <p>{form.summary}</p>
      </section>

      <section className="cv-section">
        <h3>Experience</h3>
        {experiences
          .filter((item) => item.role || item.company || item.details)
          .map((item, index) => (
            <article className="timeline-item" key={`p-exp-${index}`}>
              <div className="line-1">
                <strong>{item.role || 'Role'}</strong>
                <span>{item.period}</span>
              </div>
              <div className="line-2">{item.company}</div>
              <p>{item.details}</p>
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
