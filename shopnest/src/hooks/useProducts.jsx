import { useCallback, useEffect, useState } from "react";
import {
  fetchProductById,
  fetchProducts,
  toFriendlyError,
} from "../api/ProductsApi";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError(null);

    fetchProducts({ signal: controller.signal })
      .then(setProducts)
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(toFriendlyError(err).message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [attempt]);

  const refetch = useCallback(() => {
    setAttempt((value) => value + 1);
  }, []);

  return { products, loading, error, refetch };
}

export function useProduct(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setProduct(null);
    setLoading(true);
    setError(null);

    fetchProductById(id, { signal: controller.signal })
      .then(setProduct)
      .catch((err) => {
        if (controller.signal.aborted) return;
        setError(toFriendlyError(err).message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [id, attempt]);

  const refetch = useCallback(() => {
    setAttempt((value) => value + 1);
  }, []);

  return { product, loading, error, refetch };
}
