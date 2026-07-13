const {
  registerValidation,
  loginValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
  bookAppointmentValidation,
  updateAppointmentStatusValidation,
  createRecordValidation,
  sendMessageValidation,
  addPaymentValidation,
  updatePaymentStatusValidation,
  onboardDoctorValidation,
  toggleBanValidation,
  transferAppointmentValidation,
  aiChatValidation,
  validate
} = require('../validation');

describe('Validation Middleware', () => {
  it('should export all validation arrays', () => {
    expect(registerValidation).toBeDefined();
    expect(loginValidation).toBeDefined();
    expect(forgotPasswordValidation).toBeDefined();
    expect(resetPasswordValidation).toBeDefined();
    expect(bookAppointmentValidation).toBeDefined();
    expect(updateAppointmentStatusValidation).toBeDefined();
    expect(createRecordValidation).toBeDefined();
    expect(sendMessageValidation).toBeDefined();
    expect(addPaymentValidation).toBeDefined();
    expect(updatePaymentStatusValidation).toBeDefined();
    expect(onboardDoctorValidation).toBeDefined();
    expect(toggleBanValidation).toBeDefined();
    expect(transferAppointmentValidation).toBeDefined();
    expect(aiChatValidation).toBeDefined();
  });

  it('should export validate as a function', () => {
    expect(typeof validate).toBe('function');
  });

  it('registerValidation should be an array with validators', () => {
    expect(Array.isArray(registerValidation)).toBe(true);
    expect(registerValidation.length).toBeGreaterThan(0);
  });

  it('loginValidation should be an array with validators', () => {
    expect(Array.isArray(loginValidation)).toBe(true);
    expect(loginValidation.length).toBeGreaterThan(0);
  });

  it('forgotPasswordValidation should be an array with validators', () => {
    expect(Array.isArray(forgotPasswordValidation)).toBe(true);
    expect(forgotPasswordValidation.length).toBeGreaterThan(0);
  });

  it('resetPasswordValidation should be an array with validators', () => {
    expect(Array.isArray(resetPasswordValidation)).toBe(true);
    expect(resetPasswordValidation.length).toBeGreaterThan(0);
  });

  it('bookAppointmentValidation should be an array with validators', () => {
    expect(Array.isArray(bookAppointmentValidation)).toBe(true);
    expect(bookAppointmentValidation.length).toBeGreaterThan(0);
  });

  it('updateAppointmentStatusValidation should be an array with validators', () => {
    expect(Array.isArray(updateAppointmentStatusValidation)).toBe(true);
    expect(updateAppointmentStatusValidation.length).toBeGreaterThan(0);
  });

  it('createRecordValidation should be an array with validators', () => {
    expect(Array.isArray(createRecordValidation)).toBe(true);
    expect(createRecordValidation.length).toBeGreaterThan(0);
  });

  it('sendMessageValidation should be an array with validators', () => {
    expect(Array.isArray(sendMessageValidation)).toBe(true);
    expect(sendMessageValidation.length).toBeGreaterThan(0);
  });

  it('addPaymentValidation should be an array with validators', () => {
    expect(Array.isArray(addPaymentValidation)).toBe(true);
    expect(addPaymentValidation.length).toBeGreaterThan(0);
  });

  it('updatePaymentStatusValidation should be an array with validators', () => {
    expect(Array.isArray(updatePaymentStatusValidation)).toBe(true);
    expect(updatePaymentStatusValidation.length).toBeGreaterThan(0);
  });

  it('onboardDoctorValidation should be an array with validators', () => {
    expect(Array.isArray(onboardDoctorValidation)).toBe(true);
    expect(onboardDoctorValidation.length).toBeGreaterThan(0);
  });

  it('toggleBanValidation should be an array with validators', () => {
    expect(Array.isArray(toggleBanValidation)).toBe(true);
    expect(toggleBanValidation.length).toBeGreaterThan(0);
  });

  it('transferAppointmentValidation should be an array with validators', () => {
    expect(Array.isArray(transferAppointmentValidation)).toBe(true);
    expect(transferAppointmentValidation.length).toBeGreaterThan(0);
  });

  it('aiChatValidation should be an array with validators', () => {
    expect(Array.isArray(aiChatValidation)).toBe(true);
    expect(aiChatValidation.length).toBeGreaterThan(0);
  });
});
