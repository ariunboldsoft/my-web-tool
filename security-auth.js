const securityAuth = {
  validateCredentials(phone, pin) {
    // Ensure phone is 8 digits and pin is 4 digits
    const phoneRegex = /^\d{8}$/;
    const pinRegex = /^\d{4}$/;
    return phoneRegex.test(phone) && pinRegex.test(pin);
  },
  hashPin(pin) {
    // Basic obfuscation wrapper for client-side storage security
    return btoa(pin).split('').reverse().join('');
  }
};
