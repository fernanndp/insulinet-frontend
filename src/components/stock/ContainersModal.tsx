import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  AlertTriangle,
  CalendarDays,
} from "lucide-react";

import {
  discardContainer,
  listContainers,
  updateContainersExpiration,
} from "../../services/containerService";

import type {
  ContainerStatus,
  InsulinContainer,
} from "../../types/container";


type Props = {
  insulinId:
    number;

  insulinName:
    string;

  openValidityDays:
    number;

  onClose:
    () => void;

  onChanged:
    () => void;
};


function formatFortalezaDate(
  isoDate: string
) {
  return new Intl.DateTimeFormat(
    "pt-BR",
    {
      timeZone:
        "America/Fortaleza",

      day:
        "2-digit",

      month:
        "short",

      year:
        "numeric",
    }
  )
    .format(
      new Date(
        isoDate
      )
    )
    .replace(
      ".",
      ""
    );
}


function formatDateOnly(
  value: string
) {
  const datePart =
    value.slice(
      0,
      10
    );

  const [
    year,
    month,
    day,
  ] =
    datePart.split(
      "-"
    );

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


function formatUnits(
  value: string
) {
  return Number(
    value
  ).toLocaleString(
    "pt-BR",
    {
      maximumFractionDigits:
        2,
    }
  );
}


function getStatusLabel(
  status: ContainerStatus
) {
  switch (
    status
  ) {

    case "SEALED":
      return "Lacrada";

    case "OPEN":
      return "Em uso";

    case "EMPTY":
      return "Vazia";

    case "DISCARDED":
      return "Descartada";

    default:
      return status;
  }
}


function getStatusClass(
  status: ContainerStatus
) {
  switch (
    status
  ) {

    case "SEALED":
      return (
        "container-status-sealed"
      );

    case "OPEN":
      return (
        "container-status-open"
      );

    case "EMPTY":
      return (
        "container-status-empty"
      );

    case "DISCARDED":
      return (
        "container-status-discarded"
      );

    default:
      return "";
  }
}


function getUseLimit(
  container:
    InsulinContainer,

  openValidityDays:
    number
) {
  if (
    container.status !==
      "OPEN" ||
    !container.expires_at
  ) {
    return null;
  }


  const date =
    formatDateOnly(
      container
        .expires_at
    );


  if (
    container
      .expiration_status ===
    "expired"
  ) {
    return {
      className:
        "critical",

      title:
        `Prazo encerrado em ${date}`,

      description:
        container
          .expiration_source ===
        "stock"
          ? "O vencimento da embalagem ocorreu primeiro."
          : `O prazo de ${openValidityDays} dias após a abertura terminou.`,
    };
  }


  if (
    container
      .expiration_source ===
    "stock"
  ) {
    return {
      className:
        container
          .expiration_status ===
        "expiring_soon"
          ? "warning"
          : "normal",

      title:
        `Usar até ${date}`,

      description:
        "O vencimento da embalagem ocorre antes do prazo após abertura.",
    };
  }


  return {
    className:
      container
        .expiration_status ===
      "expiring_soon"
        ? "warning"
        : "normal",

    title:
      `Usar até ${date}`,

    description:
      `${openValidityDays} dias após a abertura.`,
  };
}


export default function ContainersModal({
  insulinId,
  insulinName,
  openValidityDays,
  onClose,
  onChanged,
}: Props) {

  const [
    containers,
    setContainers,
  ] =
    useState<
      InsulinContainer[]
    >([]);


  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );


  const [
    error,
    setError,
  ] =
    useState(
      ""
    );


  const [
    discardingId,
    setDiscardingId,
  ] =
    useState<
      number | null
    >(
      null
    );


  const [
    editingExpirationGroup,
    setEditingExpirationGroup,
  ] =
    useState<
      string | null
    >(
      null
    );


  const [
    expirationDate,
    setExpirationDate,
  ] =
    useState(
      ""
    );


  const [
    savingExpiration,
    setSavingExpiration,
  ] =
    useState(
      false
    );


  const loadContainers =
    useCallback(
      async () => {
        try {
          setLoading(
            true
          );

          setError(
            ""
          );


          const data =
            await listContainers(
              insulinId
            );


          setContainers(
            data
          );

        } catch (
          err
        ) {

          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível carregar as canetas/frascos."
          );

        } finally {

          setLoading(
            false
          );

        }
      },
      [
        insulinId,
      ]
    );


  useEffect(
    () => {
      void loadContainers();
    },
    [
      loadContainers,
    ]
  );


  async function handleDiscard(
    container:
      InsulinContainer
  ) {

    const confirmed =
      window.confirm(
        "Deseja realmente descartar esta caneta/frasco? " +
        "As unidades restantes serão removidas do estoque."
      );


    if (
      !confirmed
    ) {
      return;
    }


    try {
      setDiscardingId(
        container.id
      );

      setError(
        ""
      );


      await discardContainer(
        insulinId,
        container.id
      );


      await loadContainers();

      onChanged();

    } catch (
      err
    ) {

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível descartar a caneta/frasco."
      );

    } finally {

      setDiscardingId(
        null
      );

    }
  }


  function startExpirationEdit(
    expirationKey:
      string
  ) {
    setEditingExpirationGroup(
      expirationKey
    );

    setExpirationDate(
      expirationKey ===
        "NO_EXPIRATION"
        ? ""
        : expirationKey
    );

    setError(
      ""
    );
  }


  async function saveExpiration(
    groupContainers:
      InsulinContainer[]
  ) {

    if (
      !expirationDate
    ) {
      setError(
        "Informe a data de vencimento."
      );

      return;
    }


    try {
      setSavingExpiration(
        true
      );

      setError(
        ""
      );


      await updateContainersExpiration(
        insulinId,

        groupContainers.map(
          (
            container
          ) =>
            container.id
        ),

        expirationDate
      );


      await loadContainers();


      setEditingExpirationGroup(
        null
      );

      setExpirationDate(
        ""
      );


      onChanged();

    } catch (
      err
    ) {

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar o vencimento."
      );

    } finally {

      setSavingExpiration(
        false
      );

    }
  }


  const activeContainers =
    containers.filter(
      (
        container
      ) =>
        container.status !==
        "DISCARDED"
    );


  const discardedContainers =
    containers.filter(
      (
        container
      ) =>
        container.status ===
        "DISCARDED"
    );


  const stockGroups =
    useMemo(
      () => {

        const groups =
          new Map<
            string,
            InsulinContainer[]
          >();


        activeContainers.forEach(
          (
            container
          ) => {

            const key =
              container
                .stock_expiration_date
              ??
              "NO_EXPIRATION";


            const current =
              groups.get(
                key
              ) ?? [];


            current.push(
              container
            );


            groups.set(
              key,
              current
            );
          }
        );


        return Array.from(
          groups.entries()
        );

      },
      [
        activeContainers,
      ]
    );


  function renderContainer(
    container:
      InsulinContainer
  ) {

    const initial =
      Number(
        container
          .initial_units
      );


    const remaining =
      Number(
        container
          .remaining_units
      );


    const percent =
      initial > 0
        ? Math.max(
            0,
            Math.min(
              100,
              (
                remaining /
                initial
              ) *
                100
            )
          )
        : 0;


    const canDiscard =
      container.status ===
        "SEALED" ||
      container.status ===
        "OPEN";


    const position =
      containers
        .findIndex(
          (
            item
          ) =>
            item.id ===
            container.id
        ) + 1;


    const useLimit =
      getUseLimit(
        container,
        openValidityDays
      );


    return (
      <article
        key={
          container.id
        }
        className="container-item"
      >

        <div className="container-item-top">

          <div className="container-item-title">

            <strong>
              Caneta/frasco #{position}
            </strong>


            <span
              className={
                `container-status-badge ${getStatusClass(
                  container.status
                )}`
              }
            >

              {getStatusLabel(
                container.status
              )}

            </span>

          </div>


          <div className="container-item-amount">

            <strong>

              {formatUnits(
                container
                  .remaining_units
              )}

            </strong>


            <span>

              /{" "}

              {formatUnits(
                container
                  .initial_units
              )}

              {" "}U

            </span>

          </div>

        </div>


        <div className="container-progress-track">

          <div
            className={
              `container-progress-fill ${getStatusClass(
                container.status
              )}`
            }
            style={{
              width:
                `${percent}%`,
            }}
          />

        </div>


        {useLimit && (

          <div
            className={
              `container-use-limit ${useLimit.className}`
            }
          >

            {useLimit.className !==
              "normal" && (

              <AlertTriangle
                size={15}
              />

            )}


            <div>

              <strong>

                {
                  useLimit.title
                }

              </strong>


              <span>

                {
                  useLimit.description
                }

              </span>

            </div>

          </div>

        )}


        <div className="container-item-meta">

          <span>

            Adicionada em{" "}

            {formatFortalezaDate(
              container
                .created_at
            )}

          </span>


          {container
            .opened_at && (

            <>
              <span className="movement-meta-separator">
                •
              </span>


              <span>

                Aberta em{" "}

                {formatFortalezaDate(
                  container
                    .opened_at
                )}

              </span>
            </>

          )}

        </div>


        {canDiscard && (

          <div className="movement-actions">

            <button
              type="button"
              className="history-delete-button"
              onClick={() =>
                void handleDiscard(
                  container
                )
              }
              disabled={
                discardingId ===
                  container.id
              }
            >

              {discardingId ===
              container.id
                ? "Descartando..."
                : "Descartar"}

            </button>

          </div>

        )}

      </article>
    );
  }


  return (
    <div
      className="modal-backdrop"
      onMouseDown={
        onClose
      }
    >

      <section
        className="modal-card history-modal containers-modal"
        onMouseDown={
          (
            event
          ) =>
            event.stopPropagation()
        }
      >

        <div className="history-header">

          <div>

            <span className="history-eyebrow">
              ESTOQUE
            </span>


            <h2>
              Canetas e frascos
            </h2>


            <p>
              {insulinName}
            </p>

          </div>


          <button
            type="button"
            className="history-close-button"
            onClick={
              onClose
            }
            aria-label="Fechar"
          >

            ×

          </button>

        </div>


        <div className="history-content">

          {loading ? (

            <div className="history-state">

              <div className="history-spinner" />


              <span>
                Carregando estoque...
              </span>

            </div>

          ) : error ? (

            <div className="history-error">

              <strong>
                Não foi possível carregar
              </strong>


              <span>
                {error}
              </span>


              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  void loadContainers()
                }
              >

                Tentar novamente

              </button>

            </div>

          ) : containers.length ===
            0 ? (

            <div className="history-empty">

              <div className="history-empty-icon">
                —
              </div>


              <strong>
                Nenhuma caneta/frasco em estoque
              </strong>


              <span>
                Adicione estoque para
                começar o acompanhamento.
              </span>

            </div>

          ) : (

            <div className="stock-groups">

              {stockGroups.map(
                (
                  [
                    expirationKey,
                    groupContainers,
                  ]
                ) => {

                  const groupUnits =
                    groupContainers.reduce(
                      (
                        total,
                        container
                      ) =>
                        total +
                        Number(
                          container
                            .remaining_units
                        ),
                      0
                    );


                  return (
                    <section
                      key={
                        expirationKey
                      }
                      className="stock-expiration-group"
                    >

                      <header className="stock-expiration-group-header">

                        <div>

                          <span className="stock-group-eyebrow">

                            ESTOQUE COM ESTE VENCIMENTO

                          </span>


                          <strong>

                            {
                              groupContainers.length
                            }

                            {" "}

                            {groupContainers.length ===
                            1
                              ? "recipiente"
                              : "recipientes"}

                          </strong>


                          <small>

                            {groupUnits
                              .toLocaleString(
                                "pt-BR",
                                {
                                  maximumFractionDigits:
                                    2,
                                }
                              )}

                            {" "}U restantes

                          </small>

                        </div>


                        <div className="stock-group-expiration">

                          <CalendarDays
                            size={17}
                          />


                          {editingExpirationGroup ===
                          expirationKey ? (

                            <div className="stock-expiration-editor">

                              <span>
                                Vencimento da embalagem
                              </span>


                              <input
                                type="date"
                                value={
                                  expirationDate
                                }
                                onChange={
                                  (
                                    event
                                  ) =>
                                    setExpirationDate(
                                      event
                                        .target
                                        .value
                                    )
                                }
                              />


                              <div className="stock-expiration-editor-actions">

                                <button
                                  type="button"
                                  className="stock-expiration-save"
                                  disabled={
                                    savingExpiration
                                  }
                                  onClick={() =>
                                    void saveExpiration(
                                      groupContainers
                                    )
                                  }
                                >

                                  {savingExpiration
                                    ? "Salvando..."
                                    : "Salvar"}

                                </button>


                                <button
                                  type="button"
                                  className="stock-expiration-cancel"
                                  disabled={
                                    savingExpiration
                                  }
                                  onClick={() => {

                                    setEditingExpirationGroup(
                                      null
                                    );

                                    setExpirationDate(
                                      ""
                                    );

                                  }}
                                >

                                  Cancelar

                                </button>

                              </div>

                            </div>

                          ) : (

                            <div>

                              <span>
                                Vencimento da embalagem
                              </span>


                              <strong>

                                {expirationKey ===
                                "NO_EXPIRATION"
                                  ? "Não informado"
                                  : formatDateOnly(
                                      expirationKey
                                    )}

                              </strong>


                              <button
                                type="button"
                                className="stock-expiration-edit"
                                onClick={() =>
                                  startExpirationEdit(
                                    expirationKey
                                  )
                                }
                              >

                                {expirationKey ===
                                "NO_EXPIRATION"
                                  ? "Informar vencimento"
                                  : "Alterar"}

                              </button>

                            </div>

                          )}

                        </div>

                      </header>


                      <div className="movement-history-list">

                        {groupContainers.map(
                          renderContainer
                        )}

                      </div>

                    </section>
                  );
                }
              )}


              {discardedContainers.length >
                0 && (

                <section className="stock-expiration-group">

                  <div className="container-discarded-divider">

                    Descartadas

                  </div>


                  <div className="movement-history-list">

                    {discardedContainers.map(
                      renderContainer
                    )}

                  </div>

                </section>

              )}

            </div>

          )}

        </div>


        <div className="history-footer">

          <button
            type="button"
            className="secondary-button history-close-footer"
            onClick={
              onClose
            }
          >

            Fechar

          </button>

        </div>

      </section>

    </div>
  );
}