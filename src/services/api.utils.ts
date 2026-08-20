interface ApiEnvelope<T> {
  statusCode: number;
  message: string;
  data: T | null;
}

interface PaginatedPayload<T> {
  items: T[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

function isApiEnvelope(value: unknown): value is ApiEnvelope<unknown> {
  return (
    value !== null &&
    typeof value === 'object' &&
    'statusCode' in value &&
    'message' in value &&
    'data' in value
  );
}

function normalizePagination<T>(data: T): T {
  if (
    data &&
    typeof data === 'object' &&
    Array.isArray((data as unknown as PaginatedPayload<T>).items)
  ) {
    const { items, meta } = data as unknown as PaginatedPayload<T>;
    return {
      items,
      total: meta?.total ?? items.length,
      page: meta?.page ?? 1,
      limit: meta?.limit ?? items.length,
      totalPages: meta?.totalPages ?? 0,
    } as T;
  }
  return data;
}

export async function parseApiResponse<T>(res: Response): Promise<T> {
  const body = (await res.json()) as ApiEnvelope<T> | T;
  const data = isApiEnvelope(body) ? body.data : (body as T);
  return normalizePagination(data as T);
}

export async function parseApiResponseItems<T>(res: Response): Promise<T[]> {
  const data = await parseApiResponse<T[] | { items?: T[] }>(res);
  if (Array.isArray(data)) return data;
  return (data as { items?: T[] }).items ?? [];
}
