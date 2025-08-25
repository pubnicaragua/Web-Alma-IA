

export interface ServerActionResponse {
    title?: string;
    variant?: string;
    message: string;
    status: "success" | "error"
    [x: string]: unknown
}