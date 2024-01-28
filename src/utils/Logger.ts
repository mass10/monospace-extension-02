export class Logger {
	private constructor() {
		// NOP
	}

	public static debug(...args: unknown[]): void {
		const timestamp = new Date().toISOString();
		if (args.length === 1) {
			console.debug(`${timestamp} [DEBUG][monospace] ${args[0]}`);
		} else if (1 < args.length) {
			const [first, ...rest] = args;
			console.debug(`${timestamp} [DEBUG][monospace] ${first}`, ...rest);
		}
	}

	public static warn(...args: unknown[]): void {
		const timestamp = new Date().toISOString();
		if (args.length === 1) {
			console.warn(`${timestamp} [WARN][monospace] ${args[0]}`);
		} else if (1 < args.length) {
			const [first, ...rest] = args;
			console.warn(`${timestamp} [WARN][monospace] ${first}`, ...rest);
		}
	}

	public static info(...args: unknown[]): void {
		const timestamp = new Date().toISOString();
		if (args.length === 1) {
			console.info(`${timestamp} [INFO][monospace] ${args[0]}`);
		} else if (1 < args.length) {
			const [first, ...rest] = args;
			console.info(`${timestamp} [INFO][monospace] ${first}`, ...rest);
		}
	}

	public static error(...args: unknown[]): void {
		const timestamp = new Date().toISOString();
		if (args.length === 1) {
			console.error(`${timestamp} [ERROR][monospace] ${args[0]}`);
		} else if (1 < args.length) {
			const [first, ...rest] = args;
			console.error(`${timestamp} [ERROR][monospace] ${first}`, ...rest);
		}
	}
}
