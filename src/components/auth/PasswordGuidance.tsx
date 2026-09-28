import {
  CheckCircle2,
  Circle,
  ShieldCheck,
} from "lucide-react";

import {
  MIN_PASSWORD_LENGTH,
} from "../../utils/passwordValidation";


type Props = {
  password: string;
  confirmation: string;
};


export default function PasswordGuidance({
  password,
  confirmation,
}: Props) {
  const enoughCharacters =
    password.length >=
    MIN_PASSWORD_LENGTH;

  const passwordsMatch =
    confirmation.length > 0 &&
    password === confirmation;

  return (
    <div className="password-guidance">
      <div className="password-guidance-header">
        <ShieldCheck size={16} />

        <strong>
          Crie uma senha segura
        </strong>
      </div>

      <p>
        Prefira uma frase longa e fácil de
        lembrar, mas difícil de adivinhar.
      </p>

      <div
        className={
          enoughCharacters
            ? "password-rule valid"
            : "password-rule"
        }
      >
        {enoughCharacters ? (
          <CheckCircle2 size={14} />
        ) : (
          <Circle size={14} />
        )}

        <span>
          Pelo menos 15 caracteres
        </span>
      </div>

      <div className="password-tip">
        Evite sequências como 123456,
        qwerty ou palavras muito comuns.
      </div>

      <div className="password-tip">
        Não use seu nome, e-mail ou
        “Insulinet” como senha.
      </div>

      <div
        className={
          passwordsMatch
            ? "password-rule valid"
            : "password-rule"
        }
      >
        {passwordsMatch ? (
          <CheckCircle2 size={14} />
        ) : (
          <Circle size={14} />
        )}

        <span>
          As duas senhas devem coincidir
        </span>
      </div>
    </div>
  );
}