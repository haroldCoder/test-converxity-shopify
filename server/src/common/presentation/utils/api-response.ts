export class ApiResponse<T> {
    message: string;
    data?: T;

    constructor(message: string, data?: T) {
        this.message = message;
        this.data = data;
    }

    static success<T>(message: string, data?: T): ApiResponse<T> {
        return new ApiResponse(message, data);
    }

    static error<T>(message: string, data?: T): ApiResponse<T> {
        return new ApiResponse(message, data);
    }
}
