import React, { useState, useCallback, useMemo } from 'react';
import { Mail, Lock, CheckCircle, XCircle } from 'lucide-react';

// --- Configuration Constants ---
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const MIN_PASSWORD_LENGTH = 6;

// --- Reusable Input Component ---
// This component handles the label, input field, icon, and error display for consistency.
const FormInput = ({ id, label, type, value, error, onChange, icon: Icon, placeholder }) => (
  <div className="mb-6">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
      <Icon className="w-4 h-4 mr-2 text-indigo-500" />
      {label}
    </label>
    <div className="relative">
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        // Apply conditional styling based on validation status
        className={`w-full px-4 py-2 border rounded-xl shadow-sm transition duration-150 ease-in-out dark:bg-gray-700 dark:border-gray-600 dark:text-white
          ${error 
            ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
            : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'
          }
        `}
        aria-invalid={!!error}
        aria-describedby={`${id}-error`}
      />
    </div>
    {/* Error message display */}
    {error && (
      <p id={`${id}-error`} className="mt-2 text-sm text-red-600 dark:text-red-400 flex items-center">
        <XCircle className="w-4 h-4 mr-1" />
        {error}
      </p>
    )}
  </div>
);

// --- Main App Component ---
const App = () => {
  // State for form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State for validation errors
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // State for submission feedback
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- Validation Functions (Memoized for performance) ---
  const validateEmail = useCallback((input) => {
    if (!input) return 'Email is required.';
    if (!EMAIL_REGEX.test(input)) return 'Please enter a valid email address (e.g., user@domain.com).';
    return ''; // Return empty string if valid
  }, []);

  const validatePassword = useCallback((input) => {
    if (!input) return 'Password is required.';
    if (input.length < MIN_PASSWORD_LENGTH) return `Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`;
    return ''; // Return empty string if valid
  }, []);

  // --- Event Handlers ---
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError(validateEmail(newEmail));
    setIsSubmitted(false); // Reset submission feedback on change
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    setPasswordError(validatePassword(newPassword));
    setIsSubmitted(false); // Reset submission feedback on change
  };

  // --- Form Validity Check (Memoized for performance) ---
  // This value determines if the submit button is enabled or disabled.
  const isFormValid = useMemo(() => {
    return validateEmail(email) === '' && validatePassword(password) === '';
  }, [email, password, validateEmail, validatePassword]);

  // --- Submission Handler ---
  const handleSubmit = (e) => {
    e.preventDefault();

    // Re-validate all fields on submit to be safe
    const finalEmailError = validateEmail(email);
    const finalPasswordError = validatePassword(password);

    setEmailError(finalEmailError);
    setPasswordError(finalPasswordError);

    // If there are any errors after final validation, stop the submission
    if (finalEmailError || finalPasswordError) {
      console.error('Submission failed due to invalid form data.');
      setIsSubmitted(false);
      return;
    }

    // If we reach here, the form is valid
    console.log('Form Submitted Successfully!', { email, password });
    setIsSubmitted(true);
    
    // In a real application, you would send the data to an API here.
    // Example: sendDataToApi({ email, password });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4 font-['Inter']">
      <div className="w-full max-w-lg bg-white dark:bg-gray-800 p-8 md:p-10 rounded-3xl shadow-2xl transition duration-300">
        
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 text-center">
          User Sign In
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center">
          Please enter your credentials to access your account.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          
          {/* Email Input */}
          <FormInput
            id="email"
            label="Email Address"
            type="email"
            value={email}
            error={emailError}
            onChange={handleEmailChange}
            icon={Mail}
            placeholder="e.g., john.doe@mail.com"
          />

          {/* Password Input */}
          <FormInput
            id="password"
            label="Password"
            type="password"
            value={password}
            error={passwordError}
            onChange={handlePasswordChange}
            icon={Lock}
            placeholder={`Minimum ${MIN_PASSWORD_LENGTH} characters`}
          />

          {/* Submission Feedback Message */}
          {isSubmitted && (
            <div className="bg-green-100 dark:bg-green-700 border-l-4 border-green-500 text-green-700 dark:text-white p-4 rounded-lg mb-6 shadow-md" role="status">
              <p className="font-semibold flex items-center">
                <CheckCircle className="w-5 h-5 mr-2" />
                Validation Successful!
              </p>
              <p className="text-sm mt-1">
                The form is valid and data was logged to the console.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isFormValid} // Button is disabled if form is not valid
            className={`w-full py-3 mt-6 rounded-xl text-lg font-bold shadow-xl transition duration-300 ease-in-out transform
              ${isFormValid
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-500/50 hover:scale-[1.01]'
                : 'bg-indigo-300 text-indigo-100 cursor-not-allowed opacity-70'
              }
            `}
          >
            Sign In
          </button>
          
        </form>
      </div>
    </div>
  );
};

export default App;
