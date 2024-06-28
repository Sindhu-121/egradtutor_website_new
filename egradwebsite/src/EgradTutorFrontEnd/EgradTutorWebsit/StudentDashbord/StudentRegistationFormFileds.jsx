import React from 'react';
import "./Style/Registrationform.css";

const StudentRegistrationFormFields = ({ onSubmit, fields }) => {
  return (
    <form onSubmit={onSubmit} className="container mt-4">
      {fields.map((section, sectionIndex) => (
        <div key={sectionIndex} className="form-section">
          <h2>{section.sectionTitle}</h2>
          <div className="form-row">
            {section.fields.map((field, index) => {
              const colClass = field.fullWidth ? "col-12" : "col-md-6";
              return (
                <div key={index} className={`form-group ${colClass}`}>
                  <label htmlFor={field.name}>{field.label}</label>
                  {field.type === 'text' && (
                    <input type="text" id={field.name} name={field.name} className="form-control" placeholder={field.placeholder} />
                  )}
                  {field.type === 'textarea' && (
                    <textarea id={field.name} name={field.name} className="form-control" placeholder={field.placeholder}></textarea>
                  )}
                  {field.type === 'email' && (
                    <input type="email" id={field.name} name={field.name} className="form-control" placeholder={field.placeholder} />
                  )}
                  {field.type === 'radio' && (
                    <div>
                      {field.options.map((option, i) => (
                        <div key={i} className="form-check form-check-inline">
                          <input type="radio" id={`${field.name}_${option.value}`} name={field.name} value={option.value} className="form-check-input" />
                          <label htmlFor={`${field.name}_${option.value}`} className="form-check-label">{option.label}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  {field.type === 'checkbox' && (
                    <div>
                      {field.options.map((option, i) => (
                        <div key={i} className="form-check form-check-inline">
                          <input type="checkbox" id={`${field.name}_${option.value}`} name={field.name} value={option.value} className="form-check-input" />
                          <label htmlFor={`${field.name}_${option.value}`} className="form-check-label">{option.label}</label>
                        </div>
                      ))}
                    </div>
                  )}
                  {field.type === 'dropdown' && (
                    <select id={field.name} name={field.name} className="form-control">
                      {field.options.map((option, i) => (
                        <option key={i} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  )}
                  {field.type === 'date' && (
                    <input type="date" id={field.name} name={field.name} className="form-control" />
                  )}
                  {field.type === 'file' && (
                    <input type="file" id={field.name} name={field.name} className="form-control-file" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
};

export default StudentRegistrationFormFields;
