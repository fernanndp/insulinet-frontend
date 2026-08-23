const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://127.0.0.1:8000";








export class ApiError extends Error {

  status: number;

  data: unknown;


  constructor(
    message: string,
    status: number,
    data: unknown = null
  ) {

    super(message);

    this.name = "ApiError";

    this.status = status;

    this.data = data;

  }

}






export async function apiRequest(
  path: string,
  options: RequestInit = {}
) {

  let response: Response;


  try {

    response =
      await fetch(
        `${API_URL}${path}`,
        options
      );

  } catch {

    






    throw new ApiError(
      "Não foi possível conectar ao servidor.",
      0
    );

  }


  let data: any =
    null;


  try {

    data =
      await response.json();

  } catch {

    data =
      null;

  }


  if (
    !response.ok
  ) {

    







    let message =
      "Erro ao comunicar com o servidor.";


    if (
      typeof data?.detail ===
      "string"
    ) {

      message =
        data.detail;

    } else if (
      typeof data?.message ===
      "string"
    ) {

      message =
        data.message;

    } else if (
      Array.isArray(
        data?.detail
      )
    ) {

      



      message =
        data.detail
          .map(
            (item: any) =>
              item?.msg
          )
          .filter(
            Boolean
          )
          .join(", ") ||
        "Os dados informados são inválidos.";

    }


    throw new ApiError(
      message,
      response.status,
      data
    );

  }


  return data;

}





export function getToken() {

  return localStorage.getItem(
    "access_token"
  );

}


export function setToken(
  token: string
) {

  localStorage.setItem(
    "access_token",
    token
  );

}


export function clearToken() {

  localStorage.removeItem(
    "access_token"
  );

}





export function authHeaders():
  HeadersInit {

  const token =
    getToken();


  if (
    !token
  ) {

    return {};

  }


  return {
    Authorization:
      `Bearer ${token}`,
  };

}