/**
 * ADVANCED FORM VALIDATION SYSTEM
 * Real-time validation with beautiful error feedback
 * Handles field validation, error messages, and visual feedback
 */

class FormValidator {
  constructor(formSelector, options = {}) {
    this.form = document.querySelector(formSelector);
    if (!this.form) throw new Error(`Form not found: ${formSelector}`);
    
    this.fields = {};
    this.validationRules = {};
    this.errors = {};
    this.isDirty = false;
    
    this.options = {
      showErrorMessages: true,
      realTimeValidation: true,
      highlightErrors: true,
      focusFirstError: true,
      animateErrors: true,
      ...options
    };
    
    this.init();
  }

  /**
   * Initialize form validator
   */
  init() {
    // Collect all form fields
    const inputs = this.form.querySelectorAll('input, textarea, select');
    inputs.forEach(field => {
      if (field.name) {
        this.fields[field.name] = field;
        this.errors[field.name] = '';
        
        // Real-time validation
        if (this.options.realTimeValidation) {
          field.addEventListener('blur', () => this.validateField(field.name));
          field.addEventListener('input', () => {
            if (this.isDirty) {
              this.validateField(field.name);
            }
          });
          field.addEventListener('change', () => this.validateField(field.name));
        }
        
        // Add visual styles
        this.enhanceField(field);
      }
    });
    
    // Form submission
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  /**
   * Add validation rule for a field
   */
  addRule(fieldName, rule, message) {
    if (!this.validationRules[fieldName]) {
      this.validationRules[fieldName] = [];
    }
    this.validationRules[fieldName].push({ rule, message });
  }

  /**
   * Add multiple validation rules at once
   */
  addRules(fieldName, rules) {
    rules.forEach(({ condition, message }) => {
      this.addRule(fieldName, condition, message);
    });
  }

  /**
   * Validate a single field
   */
  validateField(fieldName) {
    const field = this.fields[fieldName];
    if (!field) return true;

    const rules = this.validationRules[fieldName] || [];
    this.errors[fieldName] = '';

    for (const { rule, message } of rules) {
      if (!rule(field.value, field)) {
        this.errors[fieldName] = message;
        this.showFieldError(field, message);
        return false;
      }
    }

    this.clearFieldError(field);
    return true;
  }

  /**
   * Validate entire form
   */
  validateForm() {
    this.isDirty = true;
    let isValid = true;

    Object.keys(this.fields).forEach(fieldName => {
      if (!this.validateField(fieldName)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Show error for a field
   */
  showFieldError(field, message) {
    // Add error class for styling
    field.classList.add('field-error');
    field.classList.remove('field-valid');
    
    // Remove old error message
    const oldError = field.parentElement.querySelector('.field-error-message');
    if (oldError) oldError.remove();

    // Create and show error message
    if (this.options.showErrorMessages) {
      const errorDiv = document.createElement('div');
      errorDiv.className = 'field-error-message';
      errorDiv.innerHTML = `
        <span class="error-icon">⚠</span>
        <span class="error-text">${this.escapeHtml(message)}</span>
      `;
      
      if (this.options.animateErrors) {
        errorDiv.classList.add('error-animate');
      }
      
      field.parentElement.appendChild(errorDiv);
      
      // Announce to screen readers
      this.announceError(`${field.name}: ${message}`);
    }
  }

  /**
   * Clear error for a field
   */
  clearFieldError(field) {
    field.classList.remove('field-error');
    field.classList.add('field-valid');

    const errorDiv = field.parentElement.querySelector('.field-error-message');
    if (errorDiv) {
      errorDiv.classList.add('error-fadeout');
      setTimeout(() => errorDiv.remove(), 300);
    }
  }

  /**
   * Enhance field with visual styling
   */
  enhanceField(field) {
    // Skip if already enhanced
    if (field.classList.contains('form-field-enhanced')) return;

    field.classList.add('form-field-enhanced');
    
    // Add focus analytics
    field.addEventListener('focus', () => {
      field.parentElement.classList.add('field-focused');
      this.announceField(field.name);
    });

    field.addEventListener('blur', () => {
      field.parentElement.classList.remove('field-focused');
    });

    // Add floating label support
    if (field.placeholder) {
      field.addEventListener('input', () => {
        if (field.value.length > 0) {
          field.classList.add('has-value');
        } else {
          field.classList.remove('has-value');
        }
      });
    }
  }

  /**
   * Handle form submission
   */
  handleSubmit(e) {
    // Don't prevent default - let the form's onsubmit handler deal with it
    // Just mark form as dirty so real-time validation activates
    if (!this.validateForm()) {
      this.isDirty = true;
      e.preventDefault();
      
      if (this.options.focusFirstError) {
        const firstErrorField = Object.entries(this.fields).find(
          ([name]) => this.errors[name]
        )?.[1];
        if (firstErrorField) {
          firstErrorField.focus();
          firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  }

  /**
   * Reset form
   */
  reset() {
    this.form.reset();
    this.isDirty = false;
    this.errors = {};
    
    this.form.querySelectorAll('.field-error, .field-valid').forEach(field => {
      field.classList.remove('field-error', 'field-valid', 'has-value');
    });

    this.form.querySelectorAll('.field-error-message').forEach(msg => msg.remove());
  }

  /**
   * Get form data
   */
  getFormData() {
    const data = {};
    Object.entries(this.fields).forEach(([name, field]) => {
      data[name] = field.value.trim();
    });
    return data;
  }

  /**
   * Set field value
   */
  setFieldValue(fieldName, value) {
    if (this.fields[fieldName]) {
      this.fields[fieldName].value = value;
      this.fields[fieldName].classList.add('has-value');
      this.validateField(fieldName);
    }
  }

  /**
   * Disable form during submission
   */
  disable() {
    Object.values(this.fields).forEach(field => {
      field.disabled = true;
      field.classList.add('field-disabled');
    });
    
    const submit = this.form.querySelector('button[type="submit"]');
    if (submit) {
      submit.disabled = true;
      submit.classList.add('btn-disabled');
    }
  }

  /**
   * Enable form
   */
  enable() {
    Object.values(this.fields).forEach(field => {
      field.disabled = false;
      field.classList.remove('field-disabled');
    });
    
    const submit = this.form.querySelector('button[type="submit"]');
    if (submit) {
      submit.disabled = false;
      submit.classList.remove('btn-disabled');
    }
  }

  /**
   * Get all errors
   */
  getErrors() {
    return Object.fromEntries(
      Object.entries(this.errors).filter(([, error]) => error)
    );
  }

  /**
   * Announce error to screen readers
   */
  announceError(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'alert');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => announcement.remove(), 2000);
  }

  /**
   * Announce field to screen readers
   */
  announceField(fieldName) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = `Editing ${fieldName}`;
    document.body.appendChild(announcement);
    
    setTimeout(() => announcement.remove(), 1000);
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Common validation rules
const ValidationRules = {
  required: (value) => value.trim().length > 0,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  minLength: (min) => (value) => value.length >= min,
  maxLength: (max) => (value) => value.length <= max,
  url: (value) => /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value),
  phone: (value) => /^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(value),
  alphanumeric: (value) => /^[a-zA-Z0-9]+$/.test(value),
  noSpecialChars: (value) => /^[a-zA-Z0-9\s\-\.]+$/.test(value),
  passwordStrength: (value) => {
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);
  },
  match: (otherFieldValue) => (value) => value === otherFieldValue,
  custom: (fn) => fn // For custom validation functions
};

// Global instance
window.formValidator = FormValidator;
window.ValidationRules = ValidationRules;
