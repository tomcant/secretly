const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export interface CreateSecretRequest {
  ciphertext: string;
  iv: string;
}

export interface CreateSecretResponse {
  id: string;
}

export interface GetSecretResponse {
  ciphertext: string;
  iv: string;
}

export async function createSecret(
  data: CreateSecretRequest,
): Promise<CreateSecretResponse> {
  const response = await fetch(`${BACKEND_URL}/secrets`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Failed to create secret: ${response.statusText}`);
  }

  return response.json();
}

export async function getSecret(id: string): Promise<GetSecretResponse> {
  const response = await fetch(`${BACKEND_URL}/secrets/${id}`);

  if (response.status === 404) {
    throw new Error("Secret not found or no longer available");
  }

  if (!response.ok) {
    throw new Error(`Failed to retrieve secret: ${response.statusText}`);
  }

  return response.json();
}
