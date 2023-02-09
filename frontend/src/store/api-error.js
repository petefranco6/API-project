class APIError extends Error {
    constructor(message, errors, status) {
      super(message);
      this.errors = errors;
      this.status = status;
    }
  }


export default APIError;
