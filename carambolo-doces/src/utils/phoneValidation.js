/**
 * Utilitários para validação de telefone brasileiro
 */

/**
 * Remove todos os caracteres não numéricos do telefone
 * @param {string} phone - Telefone a ser limpo
 * @returns {string} - Telefone apenas com números
 */
export const cleanPhone = (phone) => {
  if (!phone) return '';
  return String(phone).replace(/\D/g, '');
};

/**
 * Valida se o DDD é válido (11-99, exceto alguns DDDs inválidos)
 * @param {string} ddd - DDD a ser validado
 * @returns {boolean} - true se o DDD é válido
 */
export const isValidDDD = (ddd) => {
  if (!ddd || ddd.length !== 2) return false;
  const dddNum = parseInt(ddd, 10);
  // DDDs válidos no Brasil: 11-99
  // DDDs inválidos (não utilizados): 20, 23, 25, 26, 29, 36, 39, 52-59, 70-99
  const invalidDDDs = [20, 23, 25, 26, 29, 36, 39];
  // Verifica se está no range válido e não está na lista de inválidos
  if (dddNum < 11 || dddNum > 99) return false;
  if (invalidDDDs.includes(dddNum)) return false;
  // DDDs 52-59 não são válidos
  if (dddNum >= 52 && dddNum <= 59) return false;
  // DDDs 70-99 não são válidos
  if (dddNum >= 70 && dddNum <= 99) return false;
  return true;
};

/**
 * Valida se o número não é um padrão inválido (todos os dígitos iguais, sequências, etc)
 * @param {string} number - Número do telefone (sem DDD)
 * @returns {boolean} - true se o número não é um padrão inválido
 */
export const isValidPhoneNumber = (number) => {
  if (!number || number.length < 8) return false;
  
  // Verifica se todos os dígitos são iguais (ex: 11111111, 22222222)
  const allSame = /^(\d)\1+$/.test(number);
  if (allSame) return false;
  
  // Verifica sequências muito óbvias (ex: 12345678, 87654321)
  const isSequence = /^(01234567|12345678|23456789|98765432|87654321|76543210)$/.test(number);
  if (isSequence) return false;
  
  return true;
};

/**
 * Valida um telefone brasileiro completo
 * @param {string} phone - Telefone a ser validado (pode ter formatação)
 * @param {object} options - Opções de validação
 * @param {boolean} options.allowCountryCode - Permite código do país (55) no início (padrão: true)
 * @param {boolean} options.requireMobile - Exige que seja celular (9 dígitos após DDD) (padrão: false)
 * @returns {object} - { valid: boolean, error?: string, cleaned?: string, ddd?: string, number?: string }
 */
export const validateBrazilianPhone = (phone, options = {}) => {
  const { allowCountryCode = true, requireMobile = false } = options;
  
  if (!phone) {
    return { valid: false, error: 'Telefone é obrigatório' };
  }
  
  const cleaned = cleanPhone(phone);
  
  if (cleaned.length === 0) {
    return { valid: false, error: 'Telefone não pode estar vazio' };
  }
  
  // Remove código do país se presente
  let phoneWithoutCountryCode = cleaned;
  if (allowCountryCode && cleaned.startsWith('55') && cleaned.length > 11) {
    phoneWithoutCountryCode = cleaned.substring(2);
  } else if (!allowCountryCode && cleaned.startsWith('55')) {
    return { valid: false, error: 'Código do país não permitido neste campo' };
  }
  
  // Valida comprimento (10 para fixo, 11 para celular)
  if (phoneWithoutCountryCode.length < 10) {
    return { valid: false, error: 'Telefone deve ter pelo menos 10 dígitos' };
  }
  
  if (phoneWithoutCountryCode.length > 11) {
    return { valid: false, error: 'Telefone não pode ter mais de 11 dígitos' };
  }
  
  // Se exige celular, deve ter 11 dígitos
  if (requireMobile && phoneWithoutCountryCode.length !== 11) {
    return { valid: false, error: 'Telefone celular deve ter 11 dígitos (DDD + 9 dígitos)' };
  }
  
  // Extrai DDD (2 primeiros dígitos)
  const ddd = phoneWithoutCountryCode.substring(0, 2);
  const number = phoneWithoutCountryCode.substring(2);
  
  // Valida DDD
  if (!isValidDDD(ddd)) {
    return { valid: false, error: `DDD ${ddd} inválido` };
  }
  
  // Valida número do telefone
  if (!isValidPhoneNumber(number)) {
    return { valid: false, error: 'Número de telefone inválido' };
  }
  
  // Validações específicas para celular (11 dígitos)
  if (phoneWithoutCountryCode.length === 11) {
    // Celular deve começar com 9 após o DDD
    if (!number.startsWith('9')) {
      return { valid: false, error: 'Celular deve começar com 9 após o DDD' };
    }
    
    // Segundo dígito do celular deve ser entre 1-9 (não pode ser 0)
    const secondDigit = number.charAt(1);
    if (secondDigit === '0') {
      return { valid: false, error: 'Segundo dígito do celular inválido' };
    }
  }
  
  // Validações específicas para fixo (10 dígitos)
  if (phoneWithoutCountryCode.length === 10) {
    // Telefone fixo não pode começar com 0 ou 1
    if (number.startsWith('0') || number.startsWith('1')) {
      return { valid: false, error: 'Telefone fixo inválido' };
    }
  }
  
  return {
    valid: true,
    cleaned: phoneWithoutCountryCode,
    ddd,
    number,
    formatted: formatBrazilianPhone(phoneWithoutCountryCode)
  };
};

/**
 * Formata um telefone brasileiro
 * @param {string} phone - Telefone apenas com números
 * @returns {string} - Telefone formatado (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 */
export const formatBrazilianPhone = (phone) => {
  const cleaned = cleanPhone(phone);
  
  // Remove código do país se presente
  let phoneWithoutCountryCode = cleaned;
  if (cleaned.startsWith('55') && cleaned.length > 11) {
    phoneWithoutCountryCode = cleaned.substring(2);
  }
  
  if (phoneWithoutCountryCode.length === 10) {
    // Telefone fixo: (XX) XXXX-XXXX
    return `(${phoneWithoutCountryCode.substring(0, 2)}) ${phoneWithoutCountryCode.substring(2, 6)}-${phoneWithoutCountryCode.substring(6)}`;
  } else if (phoneWithoutCountryCode.length === 11) {
    // Celular: (XX) XXXXX-XXXX
    return `(${phoneWithoutCountryCode.substring(0, 2)}) ${phoneWithoutCountryCode.substring(2, 7)}-${phoneWithoutCountryCode.substring(7)}`;
  }
  
  return phone;
};

/**
 * Valida telefone de forma simples (para uso rápido)
 * @param {string} phone - Telefone a ser validado
 * @returns {boolean} - true se válido
 */
export const isValidPhone = (phone) => {
  const result = validateBrazilianPhone(phone);
  return result.valid;
};

