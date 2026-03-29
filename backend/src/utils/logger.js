class Logger {
  info(message, data = null) {
    console.log(`ℹ️  ${message}`, data || "");
  }

  success(message, data = null) {
    console.log(`✅ ${message}`, data || "");
  }

  error(message, error = null) {
    console.error(`❌ ${message}`, error || "");
  }

  warn(message, data = null) {
    console.warn(`⚠️  ${message}`, data || "");
  }

  debug(message, data = null) {
    if (process.env.NODE_ENV === "development") {
      console.log(`🐛 ${message}`, data || "");
    }
  }

  processing(message, data = null) {
    console.log(`📹 ${message}`, data || "");
  }

  socket(message, data = null) {
    console.log(`🔌 ${message}`, data || "");
  }
}

export default new Logger();
