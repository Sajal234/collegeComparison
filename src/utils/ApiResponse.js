class ApiResponse {
    constructor(data, message = "Request processed successfully") {
        this.success = true;
        this.message = message;
        this.data = data;
    }
}

export { ApiResponse };
