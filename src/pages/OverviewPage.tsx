import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  AlertTriangle,
  CalendarDays,
  Droplets,
  PillBottle,
} from "lucide-react";

import {
  useNavigate,
} from "react-router";

import AppLayout
  from "../components/layout/AppLayout";

import {
  ApiError,
  clearToken,
} from "../services/api";

import {
  getInsulinSummary,
  listInsulins,
} from "../services/insulinService";

import {
  getCurrentUser,
} from "../services/userService";

import type {
  InsulinWithSummary,
} from "../types/insulin";

import type {
  User,
} from "../types/auth";

import {
  formatDays,
  formatUnits,
} from "../utils/formatters";


function getStatusLabel(
  days: number | null
) {
  if (days === null) {
    return {
      label: "Sem dados",
      className: "neutral",
    };
  }

  if (days < 7) {
    return {
      label: "Baixo",
      className: "danger",
    };
  }

  if (days < 14) {
    return {
      label: "Atenção",
      className: "warning",
    };
  }

  return {
    label: "OK",
    className: "success",
  };
}


export default function OverviewPage() {
  const navigate = useNavigate();

  const [
    user,
    setUser,
  ] =
    useState<User | null>(
      null
    );

  const [
    insulins,
    setInsulins,
  ] =
    useState<
      InsulinWithSummary[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    error,
    setError,
  ] =
    useState("");

  const cachedUserName =
    localStorage.getItem(
      "insulinet_user_name"
    ) || "";

  const displayName =
    user?.name ||
    cachedUserName;

  const firstName =
    displayName
      .trim()
      .split(/\s+/)[0] || "";

  const handleApiError =
    useCallback(
      (
        err: unknown,
        fallbackMessage: string
      ) => {
        if (
          err instanceof ApiError &&
          err.status === 401
        ) {
          clearToken();

          localStorage.removeItem(
            "insulinet_user_name"
          );

          navigate(
            "/login",
            {
              replace: true,
            }
          );

          return;
        }

        setError(
          err instanceof Error
            ? err.message
            : fallbackMessage
        );
      },
      [
        navigate,
      ]
    );

  const loadData =
    useCallback(
      async () => {
        setLoading(true);
        setError("");

        try {
          const [
            currentUser,
            insulinList,
          ] =
            await Promise.all([
              getCurrentUser(),
              listInsulins(),
            ]);

          setUser(
            currentUser
          );

          localStorage.setItem(
            "insulinet_user_name",
            currentUser.name
          );

          const activeInsulins =
            insulinList.filter(
              (
                insulin
              ) =>
                insulin.active
            );

          const summaries =
            await Promise.all(
              activeInsulins.map(
                async (
                  insulin
                ) => {
                  const summary =
                    await getInsulinSummary(
                      insulin.id
                    );

                  return {
                    insulin,
                    summary,
                  };
                }
              )
            );

          setInsulins(
            summaries
          );
        } catch (
          err
        ) {
          handleApiError(
            err,
            "Não foi possível carregar o dashboard."
          );
        } finally {
          setLoading(false);
        }
      },
      [
        handleApiError,
      ]
    );

  useEffect(
    () => {
      void loadData();
    },
    [
      loadData,
    ]
  );

  const activeCount =
    insulins.length;

  const totalStock =
    insulins.reduce(
      (
        sum,
        item
      ) =>
        sum +
        Number(
          item.summary
            .current_stock_units
        ),
      0
    );

  const nextRestock =
    [...insulins]
      .filter(
        (
          item
        ) =>
          item.summary
            .estimated_days_remaining
          !== null
      )
      .sort(
        (
          a,
          b
        ) =>
          Number(
            a.summary
              .estimated_days_remaining
          ) -
          Number(
            b.summary
              .estimated_days_remaining
          )
      )[0] ?? null;

  const alertCount =
    insulins.filter(
      (
        item
      ) => {
        if (
          item.summary
            .estimated_days_remaining
          === null
        ) {
          return false;
        }

        const days =
          Number(
            item.summary
              .estimated_days_remaining
          );

        return (
          !Number.isNaN(
            days
          ) &&
          days < 7
        );
      }
    ).length;

  const today =
    new Date()
      .toLocaleDateString(
        "pt-BR",
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }
      );

  return (
    <AppLayout
      userName={
        displayName ||
        undefined
      }
    >
      <section className="overview-page">

        <header className="overview-header">
          <div>
            <h1>
              {firstName
                ? `Olá, ${firstName}!`
                : "\u00A0"}
            </h1>

            <p>
              Aqui está o resumo do seu
              estoque.
            </p>
          </div>

          <div className="overview-date">
            {today}
          </div>
        </header>

        {error && (
          <div className="panel-card error-card">
            {error}
          </div>
        )}

        <section className="summary-cards">

          <div className="summary-card">
            <div>
              <span>
                Insulinas ativas
              </span>

              <strong>
                {loading
                  ? "—"
                  : activeCount}
              </strong>
            </div>

            <PillBottle
              size={28}
            />
          </div>

          <div className="summary-card green">
            <div>
              <span>
                Estoque total
              </span>

              <strong>
                {loading
                  ? "—"
                  : `${formatUnits(
                      String(
                        totalStock
                      )
                    )} U`}
              </strong>
            </div>

            <Droplets
              size={28}
            />
          </div>

          <div className="summary-card purple">
            <div>
              <span>
                Próxima reposição
              </span>

              <strong>
                {loading
                  ? "—"
                  : nextRestock
                    ? `${formatDays(
                        String(
                          nextRestock
                            .summary
                            .estimated_days_remaining
                        )
                      )} dias`
                    : "—"}
              </strong>

              <small>
                {loading
                  ? "\u00A0"
                  : nextRestock
                    ? nextRestock
                        .insulin
                        .name
                    : "Sem projeção"}
              </small>
            </div>

            <CalendarDays
              size={28}
            />
          </div>

          <div className="summary-card orange">
            <div>
              <span>
                Alertas
              </span>

              <strong>
                {loading
                  ? "—"
                  : alertCount}
              </strong>

              <small>
                abaixo de 7 dias
              </small>
            </div>

            <AlertTriangle
              size={28}
            />
          </div>

        </section>

        <section className="insulin-summary-panel">

          <div className="panel-header">
            <h2>
              Resumo por insulina
            </h2>
          </div>

          {!loading && (
            <>
              {insulins.length === 0 ? (

                <div className="dashboard-empty-state">

                  <div className="dashboard-empty-icon">
                    <PillBottle
                      size={24}
                    />
                  </div>

                  <div>
                    <strong>
                      Nenhuma insulina cadastrada
                    </strong>

                    <p>
                      Adicione sua primeira
                      insulina para começar a
                      acompanhar estoque e
                      autonomia.
                    </p>
                  </div>

                  <button
                    type="button"
                    className="dashboard-empty-button"
                    onClick={() =>
                      navigate(
                        "/insulinas"
                      )
                    }
                  >
                    Adicionar insulina
                  </button>

                </div>

              ) : (

                <div className="summary-list">

                  {insulins.map(
                    (
                      item
                    ) => {

                      const stock =
                        Number(
                          item.summary
                            .current_stock_units
                        );

                      const days =
                        item.summary
                          .estimated_days_remaining
                        === null
                          ? null
                          : Number(
                              item.summary
                                .estimated_days_remaining
                            );

                      const status =
                        getStatusLabel(
                          days
                        );

                      const maxStock =
                        Math.max(
                          ...insulins.map(
                            (
                              insulinItem
                            ) =>
                              Number(
                                insulinItem
                                  .summary
                                  .current_stock_units
                              )
                          ),
                          1
                        );

                      const progress =
                        Math.min(
                          100,
                          Math.max(
                            6,
                            (
                              stock /
                              maxStock
                            ) * 100
                          )
                        );

                      return (
                        <button
                          type="button"
                          key={
                            item.insulin.id
                          }
                          className="summary-row"
                          onClick={() =>
                            navigate(
                              "/insulinas"
                            )
                          }
                        >

                          <div className="summary-name">
                            <strong>
                              {
                                item.insulin
                                  .name
                              }
                            </strong>

                            <span>
                              {
                                item.insulin
                                  .concentration_units_per_ml
                              }
                              {" "}U/mL
                            </span>
                          </div>

                          <div className="summary-stock">
                            <span>
                              Estoque disponível
                            </span>

                            <strong>
                              {formatUnits(
                                item.summary
                                  .current_stock_units
                              )}
                              {" "}U
                            </strong>

                            <div className="progress-track">
                              <div
                                className="progress-fill"
                                style={{
                                  width:
                                    `${progress}%`,
                                }}
                              />
                            </div>
                          </div>

                          <div className="summary-autonomy">
                            <span>
                              Autonomia
                            </span>

                            <strong>
                              {days === null
                                ? "—"
                                : `${formatDays(
                                    String(
                                      days
                                    )
                                  )} dias`}
                            </strong>
                          </div>

                          <div
                            className={
                              `status-badge ${status.className}`
                            }
                          >
                            {
                              status.label
                            }
                          </div>

                        </button>
                      );
                    }
                  )}

                </div>

              )}
            </>
          )}

        </section>

      </section>
    </AppLayout>
  );
}