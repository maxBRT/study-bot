export class ApiError extends Error {
    constructor(
        public status: number,
        public statusText: string,
        public data?: unknown
    ) {
        super(`${status}: ${statusText}`);
        this.name = "ApiError";
    }
}

// Make the body more flexible
type RequestOptions = Omit<RequestInit, "body"> & {
    body?: unknown;
};

export async function api<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const { body, headers, ...rest } = options;

    const res = await fetch(`/api${endpoint}`, {
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
        ...rest,
    });

    if (res.status === 401) {
        window.location.href = "/login";
        throw new ApiError(401, "Unauthorized");
    }

    if (res.headers.get("content-type")?.includes("text/event-stream")) {
        return res.body as unknown as T;
    }

    const data = res.headers.get("content-type")?.includes("application/json")
        ? await res.json()
        : await res.text();

    if (!res.ok) {
        throw new ApiError(res.status, res.statusText, data);
    }

    return data as T;
}
