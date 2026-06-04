// Email
export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

// Phone (Indian 10-digit)
export const isValidPhone = (phone) =>
  /^[6-9]\d{9}$/.test(phone)

// Password — min 8 chars, 1 uppercase, 1 number
export const isValidPassword = (password) =>
  /^(?=.*[A-Z])(?=.*\d).{8,}$/.test(password)

// Name — letters and spaces only
export const isValidName = (name) =>
  /^[a-zA-Z\s]{2,50}$/.test(name.trim())

// Pincode (India)
export const isValidPincode = (pin) =>
  /^\d{6}$/.test(pin)

// Aadhar
export const isValidAadhar = (aadhar) =>
  /^\d{12}$/.test(aadhar)

// Required field
export const isRequired = (value) =>
  value !== undefined && value !== null && String(value).trim() !== ''

// Validate full login form
export const validateLogin = ({ email, password }) => {
  const errors = {}
  if (!isRequired(email))       errors.email    = 'Email is required'
  else if (!isValidEmail(email)) errors.email   = 'Enter a valid email'
  if (!isRequired(password))    errors.password = 'Password is required'
  return errors
}

// Validate full register form
export const validateRegister = ({ name, email, phone, password }) => {
  const errors = {}
  if (!isRequired(name))          errors.name     = 'Name is required'
  else if (!isValidName(name))    errors.name     = 'Enter a valid name'
  if (!isRequired(email))         errors.email    = 'Email is required'
  else if (!isValidEmail(email))  errors.email    = 'Enter a valid email'
  if (!isRequired(phone))         errors.phone    = 'Phone is required'
  else if (!isValidPhone(phone))  errors.phone    = 'Enter a valid 10-digit phone'
  if (!isRequired(password))      errors.password = 'Password is required'
  else if (!isValidPassword(password)) errors.password = 'Min 8 chars, 1 uppercase, 1 number'
  return errors
}