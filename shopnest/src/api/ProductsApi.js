import axios, { AxiosError, AxiosHeaders } from "axios";
import { products } from "../data/products";

const remoteApiUrl = import.meta.env.VITE_API_URL;

export const httpClient = axios.create({
  baseURL: remoteApiUrl || "/api",
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Demo API when no backend URL is configured
if (!remoteApiUrl) {
  httpClient.defaults.adapter = async (config) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (config.signal?.aborted) {
      throw new AxiosError("Request cancelled", "ERR_CANCELED", config);
    }

    const path = config.url.split("?")[0].replace(/\/+$/, "");

    const response = (data, status = 200) => ({
      data,
      status,
      statusText: "OK",
      headers: new AxiosHeaders(),
      config,
    });

    // Get all products
    if (
      config.method === "get" &&
      (path === "/products" || path === "/api/products")
    ) {
      let result = products;
      const { category, search } = config.params || {};

      if (category && category !== "all") {
        result = result.filter((p) => p.category === category);
      }

      if (search) {
        const term = String(search).toLowerCase();
        result = result.filter((p) =>
          `${p.name} ${p.description}`.toLowerCase().includes(term),
        );
      }

      return response(result);
    }

    // Get one product
    const match = path.match(/\/products\/([^/]+)$/);

    if (config.method === "get" && match) {
      const routeId = decodeURIComponent(match[1]);
      const product = products.find(
        (p) => String(p.id) === routeId || p.id === Number(routeId),
      );

      if (!product) {
        throw Object.assign(
          new AxiosError("Product not found", "ERR_BAD_REQUEST", config),
          { response: response({ message: "Product not found" }, 404) },
        );
      }

      return response(product);
    }

    // Submit contact form
    if (config.method === "post" && path.endsWith("/contact")) {
      return response({ received: true }, 201);
    }

    throw Object.assign(
      new AxiosError("Request not found", "ERR_BAD_REQUEST", config),
      { response: response({ message: "Request not found" }, 404) },
    );
  };
}

// Friendly error messages
export function toFriendlyError(error) {
  if (error?.code === "ERR_CANCELED") {
    return { message: "Request cancelled", kind: "cancelled" };
  }

  const status = error?.response?.status;

  if (!error?.response) {
    return {
      message: "Couldn't connect to the catalogue. Check your connection.",
      kind: "network",
    };
  }

  if (status === 404) {
    return {
      message: "Product not found.",
      kind: "not-found",
    };
  }

  if (status >= 500) {
    return {
      message: "Catalogue temporarily unavailable. Please try again.",
      kind: "server",
    };
  }

  return {
    message: error.response.data?.message || "Something went wrong.",
    kind: "client",
  };
}

// API functions
export async function fetchProducts(options = {}) {
  const { data } = await httpClient.get("/products", options);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;

  return [];
}

export async function fetchProductById(id, options = {}) {
  const { data } = await httpClient.get(
    `/products/${encodeURIComponent(id)}`,
    options,
  );

  return data?.product ?? data?.data ?? data;
}

export async function submitContactMessage(payload) {
  const { data } = await httpClient.post("/contact", payload);
  return data;
}
