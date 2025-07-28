/**
 * Security Utilities
 * Security validation and protection functions
 */

export const sanitizeHtml = (html: string): string => {
  // TODO: Implement comprehensive HTML sanitization
  // - Remove dangerous tags and attributes
  // - Handle XSS prevention
  // - Support allowlist for safe tags
  // - Preserve safe formatting
  if (typeof window === 'undefined') return html;
  
  const div = document.createElement('div');
  div.textContent = html;
  const sanitized = div.innerHTML;
  
  console.log('sanitizeHtml: input length', html.length, 'output length', sanitized.length);
  return sanitized;
};

export const validateApiKey = (apiKey: string): boolean => {
  // TODO: Implement API key validation
  // - Check key format and structure
  // - Validate key authenticity
  // - Handle different key types
  // - Add rate limiting checks
  if (!apiKey || typeof apiKey !== 'string') {
    console.log('validateApiKey: invalid format');
    return false;
  }
  
  // Basic format validation (example: 32+ alphanumeric characters)
  const apiKeyPattern = /^[a-zA-Z0-9]{32,}$/;
  const isValid = apiKeyPattern.test(apiKey);
  
  console.log('validateApiKey:', isValid);
  return isValid;
};

export const hashPassword = async (password: string): Promise<string> => {
  // TODO: Implement secure password hashing
  // - Use strong hashing algorithms (bcrypt, scrypt)
  // - Add salt generation
  // - Handle async hashing operations
  // - Implement proper error handling
  
  // Simple hash implementation for demo (NOT for production)
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  console.log('hashPassword: generated hash length', hashHex.length);
  return hashHex;
};

export const generateToken = (length: number = 32): string => {
  // TODO: Implement secure token generation
  // - Use cryptographically secure random generation
  // - Support different token formats
  // - Add expiration timestamps
  // - Handle collision prevention
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  const token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
  
  console.log('generateToken: generated token length', token.length);
  return token;
};

export const validateOrigin = (origin: string, allowedOrigins: string[]): boolean => {
  // TODO: Implement origin validation for CORS
  // - Check against allowlist
  // - Handle wildcard patterns
  // - Support subdomain matching
  // - Add localhost exceptions for development
  if (!origin || !allowedOrigins.length) {
    console.log('validateOrigin: missing origin or allowed origins');
    return false;
  }
  
  const isAllowed = allowedOrigins.some(allowed => {
    if (allowed === '*') return true;
    if (allowed.startsWith('*.')) {
      const domain = allowed.slice(2);
      return origin.endsWith(domain);
    }
    return origin === allowed;
  });
  
  console.log('validateOrigin:', origin, 'allowed:', isAllowed);
  return isAllowed;
};

export const sanitizeFilename = (filename: string): string => {
  // TODO: Implement filename sanitization
  // - Remove dangerous characters
  // - Handle path traversal prevention
  // - Preserve file extensions
  // - Add length limitations
  const dangerous = /[<>:"/\\|?*]/g;
  const sanitized = filename.replace(dangerous, '_').trim();
  
  // Limit filename length
  const maxLength = 255;
  const result = sanitized.length > maxLength ? 
    sanitized.substring(0, maxLength - 4) + '...' : 
    sanitized;
  
  console.log('sanitizeFilename:', filename, '->', result);
  return result;
};

export const isSecureContext = (): boolean => {
  // TODO: Implement secure context detection
  // - Check HTTPS requirements
  // - Handle localhost exceptions
  // - Validate security headers
  // - Support development environments
  if (typeof window === 'undefined') return false;
  
  const isHttps = window.location.protocol === 'https:';
  const isLocalhost = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
  const isSecure = isHttps || isLocalhost;
  
  console.log('isSecureContext:', isSecure, { isHttps, isLocalhost });
  return isSecure;
};

export const validateContentSecurityPolicy = (nonce?: string): boolean => {
  // TODO: Implement CSP validation
  // - Check script execution permissions
  // - Validate nonce values
  // - Handle inline script restrictions
  // - Support development vs production policies
  if (typeof document === 'undefined') return true;
  
  // Basic CSP header check
  const metaTags = document.getElementsByTagName('meta');
  for (const meta of metaTags) {
    if (meta.getAttribute('http-equiv') === 'Content-Security-Policy') {
      const content = meta.getAttribute('content');
      console.log('validateContentSecurityPolicy: found CSP', content);
      return true;
    }
  }
  
  console.log('validateContentSecurityPolicy: no CSP found');
  return false;
};
