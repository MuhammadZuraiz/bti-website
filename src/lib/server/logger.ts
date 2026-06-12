type LogLevel = "info" | "warn" | "error";

type SafeLogContext = Record<
  string,
  string | number | boolean | null | undefined
>;

const blockedKeys = ["email", "phone", "message", "ip", "payload"];

function sanitizeContext(context: SafeLogContext = {}) {
  return Object.fromEntries(
    Object.entries(context).filter(([key]) => {
      const normalized = key.toLowerCase();
      return !blockedKeys.some((blocked) => normalized.includes(blocked));
    })
  );
}

function write(level: LogLevel, event: string, context?: SafeLogContext) {
  const safeContext = sanitizeContext(context);
  const payload = {
    event,
    ...safeContext
  };

  if (level === "error") {
    console.error(payload);
    return;
  }

  if (level === "warn") {
    console.warn(payload);
    return;
  }

  console.info(payload);
}

export const logger = {
  info(event: string, context?: SafeLogContext) {
    write("info", event, context);
  },
  warn(event: string, context?: SafeLogContext) {
    write("warn", event, context);
  },
  error(event: string, context?: SafeLogContext) {
    write("error", event, context);
  }
};
