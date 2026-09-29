import {
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  Link,
} from "react-router";

import PasswordGuidance
  from "../components/auth/PasswordGuidance";

import {
  changePassword,
} from "../services/userService";

import {
  validateNewPassword,
} from "../utils/passwordValidation";


export default function SettingsPage() {
  const [
    currentPassword,
    setCurrentPassword,
  ] = useState("");

  const [
    newPassword,
    setNewPassword,
  ] = useState("");

  const [
    confirmation,
    setConfirmation,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const [
    success,
    setSuccess,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);


  async function handleSubmit(
    event: FormEvent
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!currentPassword) {
      setError(
        "Informe sua senha atual."
      );
      return;
    }

    const passwordError =
      validateNewPassword(
        newPassword,
        confirmation
      );

    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (
      currentPassword ===
      newPassword
    ) {
      setError(
        "A nova senha deve ser diferente da senha atual."
      );
      return;
    }

    setLoading(true);

    try {
      const response =
        await changePassword(
          currentPassword,
          newPassword
        );

      setSuccess(
        response.message
      );

      setCurrentPassword("");
      setNewPassword("");
      setConfirmation("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível alterar a senha."
      );
    } finally {
      setLoading(false);
    }
  }


  return (
    <main className="auth-page">
      <section className="auth-card">

        <div className="brand">
          <div className="brand-icon">
            I
          </div>

          <div>
            <h1>Insulinet</h1>

            <p>
              Segurança da conta
            </p>
          </div>
        </div>

        <h2>Alterar senha</h2>

        <p className="subtitle">
          Para sua segurança, confirme sua
          senha atual antes de definir uma nova.
        </p>

        <form
          onSubmit={handleSubmit}
          noValidate
        >
          <label>
            Senha atual

            <input
              type="password"
              value={currentPassword}
              onChange={(event) =>
                setCurrentPassword(
                  event.target.value
                )
              }
              autoComplete="current-password"
            />
          </label>

          <label>
            Nova senha

            <input
              type="password"
              value={newPassword}
              onChange={(event) =>
                setNewPassword(
                  event.target.value
                )
              }
              autoComplete="new-password"
            />
          </label>

          <label>
            Confirmar nova senha

            <input
              type="password"
              value={confirmation}
              onChange={(event) =>
                setConfirmation(
                  event.target.value
                )
              }
              autoComplete="new-password"
            />
          </label>

          <PasswordGuidance
            password={newPassword}
            confirmation={confirmation}
          />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {success && (
            <div className="success-message">
              {success}
            </div>
          )}

          <button
            className="primary-button"
            disabled={loading}
          >
            {loading
              ? "Alterando..."
              : "Alterar senha"}
          </button>
        </form>

        <Link
          className="secondary-link"
          to="/dashboard"
        >
          Voltar para o Insulinet
        </Link>

      </section>
    </main>
  );
}