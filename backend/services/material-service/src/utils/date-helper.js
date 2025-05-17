/**
 * Date Helper Utility for timezone conversion
 * Handles conversion between WIB (UTC+7) and UTC timezone
 */

/**
 * Converts a date string from WIB timezone to UTC timezone
 * @param {string|Date} wibDate - Date in WIB timezone (can be string or Date object)
 * @returns {Date} - Date in UTC timezone that correctly represents WIB time in database
 */
const convertWibToUtc = (wibDate) => {
  if (!wibDate) return null;
  
  try {
    // Handle different input formats
    let date;
    
    if (wibDate instanceof Date) {
      // If it's already a Date object, make a copy
      date = new Date(wibDate);
    } else if (typeof wibDate === 'string') {
      // Check if the date string has timezone info
      if (wibDate.includes('+07:00')) {
        // Date already has WIB timezone indicator, directly create Date object
        date = new Date(wibDate);
        return date; // ISO 8601 strings with timezone are correctly parsed
      } else {
        // Assume it's WIB time without timezone indicator
        date = new Date(wibDate);
        
        // If parsing wasn't successful, return null
        if (isNaN(date.getTime())) {
          console.error('Invalid date format:', wibDate);
          return null;
        }
        
        // Adjust for WIB -> UTC (subtract 7 hours)
        const offsetInMilliseconds = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
        date = new Date(date.getTime() - offsetInMilliseconds);
      }
    } else {
      console.error('Unsupported date format:', wibDate);
      return null;
    }
    
    return date;
  } catch (error) {
    console.error('Error converting WIB to UTC:', error);
    return null;
  }
};

/**
 * Converts a date string from UTC timezone to WIB timezone
 * @param {string|Date} utcDate - Date in UTC timezone (can be string or Date object)
 /**
 * Converts a date string from UTC timezone to WIB timezone
 * @param {string|Date} utcDate - Date in UTC timezone (can be string or Date object)
 * @returns {Date} - Date in WIB timezone
 */
const convertUtcToWib = (utcDate) => {
  if (!utcDate) return null;
  
  try {
    // Ensure we have a Date object
    const date = utcDate instanceof Date ? utcDate : new Date(utcDate);
    
    // If it's an invalid date
    if (isNaN(date.getTime())) {
      console.error('Invalid date format for convertUtcToWib:', utcDate);
      return null;
    }
    
    // WIB is UTC+7, so we need to add 7 hours to get WIB
    // Approach: Convert to milliseconds, add offset, create new date
    const offsetInMilliseconds = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
    const wibTime = date.getTime() + offsetInMilliseconds;
    
    return new Date(wibTime);
  } catch (error) {
    console.error('Error converting UTC to WIB:', error);
    return null;
  }
};

/**
 * Formats a date to ISO string without milliseconds
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string (YYYY-MM-DDTHH:MM:SSZ)
 */
const formatDateToIso = (date) => {
  if (!date || !(date instanceof Date) || isNaN(date.getTime())) return null;
  
  // Format to ISO and remove milliseconds
  return date.toISOString().replace(/\.\d{3}Z$/, 'Z');
};

/**
 * Creates a date format object with both UTC and WIB formats
 * @param {Date} date - Date object in UTC
 * @returns {Object} - Object containing both UTC and WIB formatted dates
 */
const formatDateObject = (date) => {
  if (!date) return null;
  
  try {
    // Ensure we have a Date object
    const utcDate = date instanceof Date ? date : new Date(date);
    
    // If it's an invalid date
    if (isNaN(utcDate.getTime())) {
      console.error('Invalid date input for formatDateObject:', date);
      return null;
    }
    
    // Convert to WIB (UTC+7)
    const wibDate = convertUtcToWib(utcDate);
    
    return {
      utc: {
        iso: utcDate.toISOString(),
        timestamp: utcDate.getTime()
      },
      wib: {
        iso: wibDate.toISOString(),
        timestamp: wibDate.getTime()
      }
    };
  } catch (error) {
    console.error('Error formatting date object:', error);
    return null;
  }
};

export {
  convertWibToUtc,
  convertUtcToWib,
  formatDateToIso,
  formatDateObject
};
