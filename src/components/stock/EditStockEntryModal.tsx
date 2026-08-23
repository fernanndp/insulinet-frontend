import {
  useMemo,
  useState,
} from "react";

import type {
  FormEvent,
} from "react";

import {
  updateStockEntry,
} from "../../services/stockService";

import type {
  Movement,
} from "../../types/movement";



type Props = {
  insulinId: number;
  insulinName: string;

  concentrationUnitsPerMl: number;
  containerVolumeMl: number;

  movement: Movement;

  onClose: () => void;
  onSuccess: () => void;
};


export default function EditStockEntryModal({
  insulinId,
  insulinName,
  concentrationUnitsPerMl,
  containerVolumeMl,
  movement,
  onClose,
  onSuccess,
}: Props) {

  const unitsPerContainer =
    concentrationUnitsPerMl *
    containerVolumeMl;


  const initialContainers =
    unitsPerContainer > 0
      ? Number(movement.quantity_units) /
        unitsPerContainer
      : 0;


  const [
    containers,
    setContainers,
  ] = useState(
    String(initialContainers)
  );


  const [
    error,
    setError,
  ] = useState("");


  const [
    loading,
    setLoading,
  ] = useState(false);


  const newTotal =
    useMemo(() => {

      const quantity =
        Number(containers);

      if (
        !Number.isInteger(quantity) ||
        quantity <= 0
      ) {
        return null;
      }

      return (
        quantity *
        unitsPerContainer
      );

    }, [
      containers,
      unitsPerContainer,
    ]);


  async function handleSubmit(
    event: FormEvent
  ) {

    event.preventDefault();

    setError("");


    const numericContainers =
      Number(containers);


    if (
      !Number.isInteger(
        numericContainers
      ) ||
      numericContainers <= 0
    ) {

      setError(
        "Informe uma quantidade inteira de recipientes."
      );

      return;
    }


    setLoading(true);


    try {

      await updateStockEntry(
        insulinId,
        movement.id,
        numericContainers
      );


      onSuccess();
      onClose();

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível editar a entrada."
      );

    } finally {

      setLoading(false);

    }
  }


  return (
    <div
      className="modal-backdrop"
      onMouseDown={onClose}
    >

      <section
        className="modal-card"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
      >

        <div className="modal-header">

          <div>
            <h2>
              Editar entrada de estoque
            </h2>

            <p>
              {insulinName}
            </p>
          </div>


          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        <form onSubmit={handleSubmit}>

          <div className="stock-product-info">

            <div>
              <span>
                Unidades por recipiente
              </span>

              <strong>
                {unitsPerContainer.toLocaleString(
                  "pt-BR",
                  {
                    maximumFractionDigits: 2,
                  }
                )}
                {" "}U
              </strong>
            </div>


            <div>
              <span>
                Entrada atual
              </span>

              <strong>
                {Number(
                  movement.quantity_units
                ).toLocaleString(
                  "pt-BR",
                  {
                    maximumFractionDigits: 2,
                  }
                )}
                {" "}U
              </strong>
            </div>

          </div>


          <label>

            Quantidade correta de recipientes

            <input
              type="number"
              min="1"
              step="1"
              value={containers}
              onChange={(event) =>
                setContainers(
                  event.target.value
                )
              }
              autoFocus
              required
            />

          </label>


          {newTotal !== null && (

            <div className="stock-preview">

              <span>
                Novo valor da entrada
              </span>

              <strong>
                +
                {newTotal.toLocaleString(
                  "pt-BR",
                  {
                    maximumFractionDigits: 2,
                  }
                )}
                {" "}U
              </strong>

              <small>
                {containers} recipiente
                {Number(containers) !== 1
                  ? "s"
                  : ""}
                {" × "}
                {unitsPerContainer.toLocaleString(
                  "pt-BR",
                  {
                    maximumFractionDigits: 2,
                  }
                )}
                {" "}U
              </small>

            </div>

          )}


          {error && (
            <div className="error-message">
              {error}
            </div>
          )}


          <div className="modal-actions">

            <button
              type="button"
              className="secondary-button"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>


            <button
              type="submit"
              className="primary-button"
              disabled={loading}
            >
              {loading
                ? "Salvando..."
                : "Salvar correção"}
            </button>

          </div>

        </form>

      </section>

    </div>
  );
}