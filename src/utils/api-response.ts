class ApiResponse<T> {
	data: T;
	message: string;
	statusCode: number;
	success: boolean;

	constructor(statusCode: number, data: T, message = 'Success') {
		this.statusCode = statusCode;
		this.message = message;
		this.data = data;
		this.success = statusCode < 400;
	}
}

export { ApiResponse };
