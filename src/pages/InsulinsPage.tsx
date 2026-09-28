import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Activity,
  AlertTriangle,
  Clock3,
  History,
  Layers,
  PackagePlus,
  Plus,
  Settings2,
  SlidersHorizontal,
  Syringe,
} from "lucide-react";

import {
  useNavigate,
} from "react-router";

import AppLayout
  from "../components/layout/AppLayout";

import RegisterDoseModal
  from "../components/dose/RegisterDoseModal";

import DoseHistoryModal
  from "../components/dose/DoseHistoryModal";

import AddStockModal
  from "../components/stock/AddStockModal";

import ContainersModal
  from "../components/stock/ContainersModal";

import AddInsulinModal
  from "../components/insulin/AddInsulinModal";

import AdjustStockModal
  from "../components/stock/AdjustStockModal";

import EditInsulinModal
  from "../components/insulin/EditInsulinModal";

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
  User,
} from "../types/auth";

import type {
  Insulin,
  InsulinSummary,
  InsulinWithSummary,
} from "../types/insulin";

import {
  formatDays,
  formatEndDate,
  formatUnits,
} from "../utils/formatters";


function formatExpirationDate(
  value: string
) {
  const [
    year,
    month,
    day,
  ] =
    value.split("-");

  if (
    !year ||
    !month ||
    !day
  ) {
    return value;
  }

  return (
    `${day}/${month}/${year}`
  );
}


function getExpirationMessage(
  summary:
    InsulinSummary
) {
  if (
    !summary
      .next_expiration_date
  ) {
    return null;
  }


  const date =
    formatExpirationDate(
      summary
        .next_expiration_date
    );


  const units =
    summary
      .expiring_stock_units !==
    null
      ? `${formatUnits(
          summary
            .expiring_stock_units
        )} U`
      : "Parte do estoque";


  if (
    summary
      .expiration_status ===
    "EXPIRED"
  ) {
    return {
      type:
        "critical",

      text:
        `${units} está com vencimento expirado desde ${date}.`,
    };
  }


  if (
    summary
      .expiration_status ===
    "AT_RISK"
  ) {
    return {
      type:
        "warning",

      text:
        `${units} pode não ser consumida antes do vencimento em ${date}.`,
    };
  }


  if (
    summary
      .expiration_status ===
    "SAME_DAY"
  ) {
    return {
      type:
        "warning",

      text:
        `${units} tem consumo estimado até o mesmo dia do vencimento (${date}).`,
    };
  }


  if (
    summary
      .expiration_status ===
      "NO_PROJECTION" &&
    summary
      .days_until_expiration !==
      null &&
    summary
      .days_until_expiration <=
      30
  ) {
    return {
      type:
        "warning",

      text:
        `${units} vence em ${summary.days_until_expiration} ${
          summary.days_until_expiration ===
          1
            ? "dia"
            : "dias"
        } (${date}).`,
    };
  }


  return null;
}


export default function InsulinsPage() {
  const navigate =
    useNavigate();


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
    doseInsulin,
    setDoseInsulin,
  ] =
    useState<Insulin | null>(
      null
    );


  const [
    historyInsulin,
    setHistoryInsulin,
  ] =
    useState<Insulin | null>(
      null
    );


  const [
    stockInsulin,
    setStockInsulin,
  ] =
    useState<Insulin | null>(
      null
    );


  const [
    containersInsulin,
    setContainersInsulin,
  ] =
    useState<Insulin | null>(
      null
    );


  const [
    adjustStockInsulin,
    setAdjustStockInsulin,
  ] =
    useState<
      InsulinWithSummary | null
    >(
      null
    );


  const [
    editInsulin,
    setEditInsulin,
  ] =
    useState<Insulin | null>(
      null
    );


  const [
    addInsulinOpen,
    setAddInsulinOpen,
  ] =
    useState(false);


  const [
    showInactive,
    setShowInactive,
  ] =
    useState(false);


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


  const sidebarUserName =
    user?.name ||
    cachedUserName;


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


  const loadInsulinCards =
    useCallback(
      async () => {
        const insulinData:
          Insulin[] =
          await listInsulins();


        const completeData:
          InsulinWithSummary[] =
          await Promise.all(
            insulinData.map(
              async (
                insulin
              ) => {
                const summary:
                  InsulinSummary =
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
          completeData
        );
      },
      []
    );


  const loadDashboard =
    useCallback(
      async (
        showFullLoading:
          boolean = true
      ) => {
        try {
          if (
            showFullLoading
          ) {
            setLoading(
              true
            );
          }

          setError("");


          const userData:
            User =
            await getCurrentUser();


          setUser(
            userData
          );


          localStorage.setItem(
            "insulinet_user_name",
            userData.name
          );


          await loadInsulinCards();

        } catch (
          err
        ) {

          handleApiError(
            err,
            "Não foi possível carregar suas insulinas."
          );

        } finally {

          if (
            showFullLoading
          ) {
            setLoading(
              false
            );
          }

        }
      },
      [
        handleApiError,
        loadInsulinCards,
      ]
    );


  const refreshInsulinList =
    useCallback(
      async () => {
        try {

          setError(
            ""
          );


          await loadInsulinCards();

        } catch (
          err
        ) {

          handleApiError(
            err,
            "Não foi possível atualizar as insulinas."
          );

        }
      },
      [
        handleApiError,
        loadInsulinCards,
      ]
    );


  const refreshInsulinSummary =
    useCallback(
      async (
        insulinId: number
      ) => {
        try {

          setError(
            ""
          );


          const updatedSummary:
            InsulinSummary =
            await getInsulinSummary(
              insulinId
            );


          setInsulins(
            (
              current
            ) =>
              current.map(
                (
                  item
                ) => {

                  if (
                    item.insulin.id !==
                    insulinId
                  ) {
                    return item;
                  }


                  return {
                    ...item,

                    summary:
                      updatedSummary,
                  };
                }
              )
          );


          setAdjustStockInsulin(
            (
              current
            ) => {

              if (
                !current ||
                current.insulin.id !==
                  insulinId
              ) {
                return current;
              }


              return {
                ...current,

                summary:
                  updatedSummary,
              };
            }
          );

        } catch (
          err
        ) {

          handleApiError(
            err,
            "Não foi possível atualizar a insulina."
          );

        }
      },
      [
        handleApiError,
      ]
    );


  useEffect(
    () => {

      void loadDashboard(
        true
      );

    },
    [
      loadDashboard,
    ]
  );


  const activeInsulins =
    insulins.filter(
      (
        item
      ) =>
        item.insulin.active
    );


  const inactiveInsulins =
    insulins.filter(
      (
        item
      ) =>
        !item.insulin.active
    );


  function getStockStatus(
    level:
      InsulinWithSummary[
        "summary"
      ][
        "stock_alert_level"
      ]
  ) {

    switch (
      level
    ) {

      case "critical":
        return {
          className:
            "danger",

          label:
            "Estoque crítico",
        };


      case "low":
        return {
          className:
            "warning",

          label:
            "Estoque baixo",
        };


      case "ok":
        return {
          className:
            "success",

          label:
            "Estoque OK",
        };


      default:
        return {
          className:
            "neutral",

          label:
            "Sem projeção",
        };
    }
  }


  function renderInsulinCard(
    item:
      InsulinWithSummary
  ) {

    const {
      insulin,
      summary,
    } =
      item;


    const stockStatus =
      getStockStatus(
        summary
          .stock_alert_level
      );


    const expirationAlert =
      getExpirationMessage(
        summary
      );


    return (
      <article
        key={
          insulin.id
        }
        className="insulin-management-card"
      >

        <div className="management-card-header">

          <div>

            <span className="management-label">
              INSULINA
            </span>


            <h3>
              {insulin.name}
            </h3>


            <p>

              {Number(
                insulin
                  .concentration_units_per_ml
              ).toLocaleString(
                "pt-BR"
              )}

              {" "}U/mL

              {" · "}

              {Number(
                insulin
                  .container_volume_ml
              ).toLocaleString(
                "pt-BR"
              )}

              {" "}mL

              {" · "}

              {
                insulin
                  .open_validity_days
              }

              {" "}

              {insulin
                .open_validity_days ===
              1
                ? "dia"
                : "dias"}

              {" após aberta"}

            </p>

          </div>


          <div className="management-header-actions">

            {insulin.active ? (

              <span className="management-active">

                <span />

                Ativa

              </span>

            ) : (

              <span className="management-inactive">
                Inativa
              </span>

            )}


            <button
              type="button"
              className="management-settings"
              onClick={() =>
                setEditInsulin(
                  insulin
                )
              }
            >

              <Settings2
                size={15}
              />

              Gerenciar

            </button>

          </div>

        </div>


        <div className="management-stock">

          <div>

            <span>
              Estoque disponível
            </span>


            <div className="management-stock-value">

              <strong>

                {formatUnits(
                  summary
                    .current_stock_units
                )}

              </strong>


              <small>
                U
              </small>

            </div>

          </div>


          <div
            className={
              `management-status ${stockStatus.className}`
            }
          >

            {
              stockStatus
                .label
            }

          </div>

        </div>


        {insulin.active &&
          summary
            .container_alert_level !==
            "ok" && (

          <div
            className={
              summary
                .container_alert_level ===
              "expired"
                ? "container-alert critical"
                : "container-alert warning"
            }
          >

            <AlertTriangle
              size={16}
            />


            <span>

              {summary
                .container_alert_level ===
              "expired"
                ? (
                  <>
                    Uma caneta/frasco
                    aberto está vencido.
                    Descarte antes de
                    aplicar.
                  </>
                )
                : (
                  <>
                    Uma caneta/frasco
                    aberto vence em{" "}

                    <strong>

                      {
                        summary
                          .container_alert_days
                      }

                    </strong>

                    {" "}

                    {summary
                      .container_alert_days ===
                    1
                      ? "dia"
                      : "dias"}.

                  </>
                )}

            </span>

          </div>

        )}


        {expirationAlert && (

          <div
            className={
              expirationAlert.type ===
              "critical"
                ? "container-alert critical"
                : "container-alert warning"
            }
          >

            <AlertTriangle
              size={16}
            />


            <span>

              {
                expirationAlert.text
              }

            </span>

          </div>

        )}


        <div className="management-metrics">

          <div className="management-metric">

            <div className="management-metric-icon">

              <Activity
                size={17}
              />

            </div>


            <div>

              <span>
                Consumo médio
              </span>


              <strong>

                {summary
                  .average_daily_consumption_units
                  !== null
                  ? `${formatUnits(
                      summary
                        .average_daily_consumption_units
                    )} U/dia`
                  : "—"}

              </strong>


              {summary
                .history_days_used >
                0 && (

                <small>

                  Baseado em{" "}

                  {
                    summary
                      .history_days_used
                  }

                  {" "}

                  {summary
                    .history_days_used ===
                  1
                    ? "dia"
                    : "dias"}

                </small>

              )}

            </div>

          </div>


          <div className="management-metric">

            <div className="management-metric-icon">

              <Clock3
                size={17}
              />

            </div>


            <div>

              <span>
                Autonomia estimada
              </span>


              <strong>

                {summary
                  .estimated_days_remaining
                  !== null
                  ? `${formatDays(
                      summary
                        .estimated_days_remaining
                    )} dias`
                  : "—"}

              </strong>


              <small>
                considerando o consumo atual
              </small>

            </div>

          </div>

        </div>


        <div className="management-projection">

          <div>

            <span>
              Previsão de término
            </span>


            <small>
              Mantendo o consumo médio atual
            </small>

          </div>


          <strong>

            {summary
              .estimated_end_date
              ? formatEndDate(
                  summary
                    .estimated_end_date
                )
              : "Sem dados suficientes"}

          </strong>

        </div>


        {insulin.active ? (

          <div className="management-actions">

            <button
              type="button"
              className="management-primary"
              onClick={() =>
                setDoseInsulin(
                  insulin
                )
              }
            >

              <Syringe
                size={16}
              />

              Registrar aplicação

            </button>


            <button
              type="button"
              className="management-secondary"
              onClick={() =>
                setStockInsulin(
                  insulin
                )
              }
            >

              <PackagePlus
                size={16}
              />

              Adicionar estoque

            </button>


            <div className="management-minor-actions">

              <button
                type="button"
                onClick={() =>
                  setContainersInsulin(
                    insulin
                  )
                }
              >

                <Layers
                  size={15}
                />

                Ver canetas/frascos

              </button>


              <button
                type="button"
                onClick={() =>
                  setAdjustStockInsulin(
                    item
                  )
                }
              >

                <SlidersHorizontal
                  size={15}
                />

                Ajustar estoque

              </button>


              <button
                type="button"
                onClick={() =>
                  setHistoryInsulin(
                    insulin
                  )
                }
              >

                <History
                  size={15}
                />

                Ver histórico

              </button>

            </div>

          </div>

        ) : (

          <div className="management-disabled">

            Insulina inativa.
            Novas movimentações estão
            desabilitadas.

          </div>

        )}

      </article>
    );
  }


  return (
    <AppLayout
      userName={
        sidebarUserName ||
        undefined
      }
    >

      <section className="insulins-page dashboard dashboard-v2">

        <section
          className="
            dashboard-content
            dashboard-content-v2
            insulins-content
          "
        >

          {error && (

            <div className="error-message">
              {error}
            </div>

          )}


          <div className="dashboard-hero">

            <div>

              <h2>
                Minhas insulinas
              </h2>


              <p>
                Gerencie suas insulinas,
                estoque, aplicações e histórico
                em um só lugar.
              </p>

            </div>


            <button
              type="button"
              className="
                primary-button
                add-insulin-main-button
              "
              onClick={() =>
                setAddInsulinOpen(
                  true
                )
              }
            >

              <Plus
                size={15}
              />

              Adicionar insulina

            </button>

          </div>


          {!loading && (

            <>
              {insulins.length ===
              0 ? (

                <div className="empty-card">

                  <div className="empty-card-icon">

                    <Plus
                      size={22}
                    />

                  </div>


                  <h3>
                    Nenhuma insulina cadastrada
                  </h3>


                  <p>
                    Cadastre sua primeira
                    insulina para começar
                    a acompanhar o estoque.
                  </p>


                  <button
                    type="button"
                    className="primary-button"
                    onClick={() =>
                      setAddInsulinOpen(
                        true
                      )
                    }
                  >

                    <Plus
                      size={15}
                    />

                    Adicionar insulina

                  </button>

                </div>

              ) : (

                <>
                  <section className="insulin-section">

                    <div className="insulin-section-header">

                      <div>

                        <h3>
                          Insulinas ativas
                        </h3>


                        <span className="insulin-section-count">

                          {
                            activeInsulins.length
                          }

                        </span>

                      </div>


                      <p>
                        Insulinas em acompanhamento
                        atualmente
                      </p>

                    </div>


                    {activeInsulins.length >
                    0 ? (

                      <div className="insulin-grid">

                        {activeInsulins.map(
                          renderInsulinCard
                        )}

                      </div>

                    ) : (

                      <div className="inactive-empty-state">

                        Nenhuma insulina ativa.

                      </div>

                    )}

                  </section>


                  {inactiveInsulins.length >
                    0 && (

                    <section className="inactive-insulin-section">

                      <button
                        type="button"
                        className="inactive-section-toggle"
                        onClick={() =>
                          setShowInactive(
                            (
                              current
                            ) =>
                              !current
                          )
                        }
                      >

                        <div>

                          <span>
                            Insulinas inativas
                          </span>


                          <span className="inactive-count">

                            {
                              inactiveInsulins.length
                            }

                          </span>

                        </div>


                        <span
                          className={
                            showInactive
                              ? "inactive-chevron open"
                              : "inactive-chevron"
                          }
                        >

                          ▼

                        </span>

                      </button>


                      {showInactive && (

                        <div className="inactive-section-content">

                          <p className="inactive-section-description">

                            Dados e histórico
                            são preservados mesmo
                            após a desativação.

                          </p>


                          <div className="insulin-grid">

                            {inactiveInsulins.map(
                              renderInsulinCard
                            )}

                          </div>

                        </div>

                      )}

                    </section>

                  )}

                </>

              )}
            </>

          )}

        </section>


        {doseInsulin && (

          <RegisterDoseModal
            insulinId={
              doseInsulin.id
            }

            insulinName={
              doseInsulin.name
            }

            onClose={() =>
              setDoseInsulin(
                null
              )
            }

            onSuccess={() => {

              void refreshInsulinSummary(
                doseInsulin.id
              );

            }}
          />

        )}


        {historyInsulin && (

          <DoseHistoryModal
            insulinId={
              historyInsulin.id
            }

            insulinName={
              historyInsulin.name
            }

            concentrationUnitsPerMl={
              Number(
                historyInsulin
                  .concentration_units_per_ml
              )
            }

            containerVolumeMl={
              Number(
                historyInsulin
                  .container_volume_ml
              )
            }

            onClose={() =>
              setHistoryInsulin(
                null
              )
            }

            onChanged={() => {

              void refreshInsulinSummary(
                historyInsulin.id
              );

            }}
          />

        )}


        {stockInsulin && (

          <AddStockModal
            insulinId={
              stockInsulin.id
            }

            insulinName={
              stockInsulin.name
            }

            concentrationUnitsPerMl={
              stockInsulin
                .concentration_units_per_ml
            }

            containerVolumeMl={
              stockInsulin
                .container_volume_ml
            }

            onClose={() =>
              setStockInsulin(
                null
              )
            }

            onSuccess={() => {

              void refreshInsulinSummary(
                stockInsulin.id
              );

            }}
          />

        )}


        {containersInsulin && (

          <ContainersModal
            insulinId={
              containersInsulin.id
            }

            insulinName={
              containersInsulin.name
            }

            openValidityDays={
              containersInsulin
                .open_validity_days
            }

            onClose={() =>
              setContainersInsulin(
                null
              )
            }

            onChanged={() => {

              void refreshInsulinSummary(
                containersInsulin.id
              );

            }}
          />

        )}


        {adjustStockInsulin && (

          <AdjustStockModal
            insulinId={
              adjustStockInsulin
                .insulin.id
            }

            insulinName={
              adjustStockInsulin
                .insulin.name
            }

            currentStockUnits={
              adjustStockInsulin
                .summary
                .current_stock_units
            }

            onClose={() =>
              setAdjustStockInsulin(
                null
              )
            }

            onSuccess={() => {

              void refreshInsulinSummary(
                adjustStockInsulin
                  .insulin.id
              );

            }}
          />

        )}


        {addInsulinOpen && (

          <AddInsulinModal
            onClose={() =>
              setAddInsulinOpen(
                false
              )
            }

            onSuccess={() => {

              void refreshInsulinList();

            }}
          />

        )}


        {editInsulin && (

          <EditInsulinModal
            insulinId={
              editInsulin.id
            }

            initialName={
              editInsulin.name
            }

            initialConcentrationUnitsPerMl={
              editInsulin
                .concentration_units_per_ml
            }

            initialContainerVolumeMl={
              editInsulin
                .container_volume_ml
            }

            initialOpenValidityDays={
              editInsulin
                .open_validity_days
            }

            initialActive={
              editInsulin.active
            }

            onClose={() =>
              setEditInsulin(
                null
              )
            }

            onSuccess={() => {

              void refreshInsulinList();

            }}
          />

        )}

      </section>

    </AppLayout>
  );
}