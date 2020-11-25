class ValidationResult
{
  constructor() {
    this.isValid = true;
    this.error = [];
  }

  setError(error) {
    this.isValid = false;
    this.error.push(error);
  }

  result() {
    return {
      valid: this.isValid,
      error: this.error
    }
  }
}

export default ValidationResult;