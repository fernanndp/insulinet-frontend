export const MIN_PASSWORD_LENGTH = 15;
export const MAX_PASSWORD_LENGTH = 128;


export function validateNewPassword(
  password: string,
  confirmation: string
): string | null {
  if (!password) {
    return "Informe uma senha.";
  }

  if (
    password.length <
    MIN_PASSWORD_LENGTH
  ) {
    return (
      `A senha deve ter pelo menos ` +
      `${MIN_PASSWORD_LENGTH} caracteres.`
    );
  }

  if (
    password.length >
    MAX_PASSWORD_LENGTH
  ) {
    return (
      `A senha deve ter no máximo ` +
      `${MAX_PASSWORD_LENGTH} caracteres.`
    );
  }

  if (!confirmation) {
    return "Confirme a senha.";
  }

  if (
    password !==
    confirmation
  ) {
    return "As senhas não coincidem.";
  }

  return null;
}