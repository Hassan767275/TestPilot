export interface ConsoleError {
    text: string,
    location: string
}

export interface PageError {
    message: string,
    stack: string | undefined
}

export interface FailedRequest {
    url: string,
    resourceType: string
    error: string | undefined
}

export interface BadRequest {
    url: string,
    status: number,
    resourceType: string
}