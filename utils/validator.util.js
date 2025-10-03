/**
 * 
 * @param {*} value int 
 * @returns boolean if id is int or not
 */

const isValidId = (value) => {
    return Number.isInteger(Number(value)) && Number(value) > 0;
};

const isValidArray = (values) => {
    return Array.isArray(values) && values.length > 0 && values.every(v => v !== null && v !== undefined);
};

/**
 * Checks if a string is a valid email address
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  if (typeof email !== "string") return false;
  
  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};



const PROJECT_VALID_STATUSES = ["planned", "active", "completed", "deleted"];
const TASK_VALID_STATUSES = ['todo', 'in_progress', 'done', 'deleted'];

module.exports = {
    isValidId,
    isValidArray,
    isValidEmail,
    PROJECT_VALID_STATUSES,
    TASK_VALID_STATUSES
}