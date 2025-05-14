/**
 * Helper utilities for date/time handling
 * Membantu konversi antara format waktu UTC dan WIB (UTC+7)
 */
export class DateHelper {


    /**
 * Converts a WIB (UTC+7) date string to UTC Date object
 * @param {string|Date} wibDateString - Date string or object in WIB timezone
 * @returns {Date} Date object in UTC
 */
static wibToUtc(wibDateString) {
  if (!wibDateString) return null;
  
  console.log('🕒 wibToUtc input:', wibDateString);
  
  try {
    let inputDate;
    
    // If already a Date object, create a new one to avoid mutation
    if (wibDateString instanceof Date) {
      inputDate = new Date(wibDateString);
      console.log('🕒 Input is Date object, copied to:', inputDate);
    } else {
      // Convert to string if it's not already
      const dateStr = String(wibDateString);
      console.log('🕒 Input converted to string:', dateStr);
      
      // Check if it has timezone information
      const hasTimezone = dateStr.endsWith('Z') || dateStr.match(/[+-]\d\d:\d\d$/);
      console.log('🕒 Has timezone info?', hasTimezone);
      
      if (hasTimezone) {
        // If it already has timezone info, parse directly as UTC
        inputDate = new Date(dateStr);
        console.log('🕒 Using date with timezone as-is:', inputDate);
      } else {
        // Assume it's in WIB time without timezone information
        // Manually parse to ensure consistency
        const [datePart, timePart] = dateStr.split('T');
        if (!datePart) {
          // If parsing fails, try the default parser as a fallback
          inputDate = new Date(wibDateString);
          console.log('🕒 Fallback to default parsing:', inputDate);
          // Subtract 7 hours to convert from WIB to UTC
          inputDate = new Date(inputDate.getTime() - (7 * 60 * 60 * 1000));
          return inputDate;
        }
        
        const [year, month, day] = datePart.split('-').map(Number);
        let hour = 0, minute = 0, second = 0;
        
        if (timePart) {
          const timeParts = timePart.split(':');
          hour = Number(timeParts[0] || 0);
          minute = Number(timeParts[1] || 0);
          second = Number(timeParts[2]?.split('.')[0] || 0);
        }
        
        console.log(`🕒 Parsed components: ${year}-${month}-${day} ${hour}:${minute}:${second} WIB`);
        
        // Create a date object treating the input as WIB time
        // Use UTC methods to avoid timezone shifts when constructing the date
        const utcDate = new Date(Date.UTC(year, month-1, day, hour-7, minute, second));
        console.log('🕒 UTC conversion result:', utcDate);
        console.log('🕒 UTC ISO string:', utcDate.toISOString());
        
        return utcDate;
      }
    }
    
    // For any date object that comes through, ensure it's treated as WIB and converted to UTC
    // Subtract 7 hours from the time
    return new Date(inputDate.getTime() - (7 * 60 * 60 * 1000));
  } catch (error) {
    console.error('Error converting WIB to UTC:', error);
    // Fallback to original implementation but still adjust for WIB to UTC
    const date = new Date(wibDateString);
    return new Date(date.getTime() - (7 * 60 * 60 * 1000));
  }
}
  
/**
 * Converts a UTC date to WIB (UTC+7) formatted string
 * @param {Date|string} utcDate - Date object or string in UTC
 * @param {boolean} includeTime - Whether to include time in the output
 * @returns {string} Formatted date string in WIB timezone
 */
static utcToWibString(utcDate, includeTime = true) {
  if (!utcDate) return null;
  
  console.log('🌏 utcToWibString input:', utcDate);
  
  try {
    // Ensure we have a Date object
    const dateObj = utcDate instanceof Date ? utcDate : new Date(utcDate);
    console.log('🌏 Parsed date object:', dateObj);
    
    // Create options for formatting
    const options = {
      timeZone: 'Asia/Jakarta', // WIB timezone
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    
    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = false;
    }
    
    // Format date with Asia/Jakarta (WIB) timezone
    const result = new Intl.DateTimeFormat('id-ID', options).format(dateObj);
    console.log('🌏 Formatted result:', result);
    return result;
  } catch (error) {
    console.error('Error converting UTC to WIB string:', error);
    return String(utcDate);
  }
}

  /**
   * Cek apakah tanggal sudah lewat (past due)
   * @param {Date|string} date - Tanggal untuk dicek
   * @returns {boolean} True jika sudah lewat
   */
  static isPastDue(date) {
    if (!date) return false;
    const dueDate = date instanceof Date ? date : new Date(date);
    return new Date() > dueDate;
  }

  /**
   * Format tanggal untuk display dengan format yang konsisten
   * @param {Date|string} date - Tanggal untuk diformat
   * @param {string} format - Format yang diinginkan ('short', 'long', 'full')
   * @returns {string} Tanggal yang sudah diformat
   */
  static formatDate(date, format = 'long') {
    if (!date) return '';
    
    const dateObj = date instanceof Date ? date : new Date(date);
    
    const options = {
      timeZone: 'Asia/Jakarta'
    };
    
    switch (format) {
      case 'short':
        options.year = 'numeric';
        options.month = '2-digit';
        options.day = '2-digit';
        break;
      case 'full':
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
        options.hour = '2-digit';
        options.minute = '2-digit';
        options.hour12 = false;
        break;
      case 'long':
      default:
        options.year = 'numeric';
        options.month = 'long';
        options.day = 'numeric';
    }
    
    return new Intl.DateTimeFormat('id-ID', options).format(dateObj);
  }
}
