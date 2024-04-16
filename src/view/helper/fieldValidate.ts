interface ValidationResult {
     isValid: boolean;
     message: string;
}

export const emailPattern: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordPattern: RegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
export const textOnlyPattern: RegExp = /^[A-Za-z\s]+$/;

export const validateEmails = (value: string): ValidationResult => {
     if (!emailPattern.test(value)) {
          return { isValid: false, message: 'El formato del correo electrónico no es válido.' };
     }
     return { isValid: true, message: 'El correo electronico es valido' };
};

export const validatePasswords = (value: string): ValidationResult => {
     if (!passwordPattern.test(value)) {
          return {
               isValid: false,
               message: 'La contraseña debe tener al menos 8 caracteres, incluyendo al menos una letra minúscula, una letra mayúscula, un número y un carácter especial.'
          };
     }
     return { isValid: true, message: 'La contraseña cumple con todos los caracteres' };
};

export const validateTextOnlys = (value: string): ValidationResult => {
     if (!textOnlyPattern.test(value)) {
          return { isValid: false, message: 'El valor debe contener solo letras y espacios.' };
     }
     return { isValid: true, message: '' };
};

