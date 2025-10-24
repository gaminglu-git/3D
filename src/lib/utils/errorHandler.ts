/**
 * Global error handler for the application
 */

export interface ErrorContext {
  tool?: string
  action?: string
  component?: string
  elementId?: string
  [key: string]: unknown
}

/**
 * Handle errors from tools (wall, window, door, roof tools)
 */
export function handleToolError(error: Error, tool: string, context?: ErrorContext): void {
  console.error(`[Tool Error] ${tool}:`, error.message, context)

  // In production, you might want to send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    // Example: sendToErrorTracking(error, { tool, ...context })
  }

  // Show user-friendly message
  const friendlyMessage = getUserFriendlyMessage(error, tool)
  showErrorToUser(friendlyMessage)
}

/**
 * Handle errors from store actions
 */
export function handleStoreError(error: Error, action: string, context?: ErrorContext): void {
  console.error(`[Store Error] ${action}:`, error.message, context)

  if (process.env.NODE_ENV === 'production') {
    // Example: sendToErrorTracking(error, { action, ...context })
  }

  const friendlyMessage = `Fehler beim ${action}. Bitte versuchen Sie es erneut.`
  showErrorToUser(friendlyMessage)
}

/**
 * Log general errors with context
 */
export function logError(error: Error, context: ErrorContext): void {
  console.error('[Error]:', error.message, context)

  if (process.env.NODE_ENV === 'production') {
    // Example: sendToErrorTracking(error, context)
  }
}

/**
 * Get user-friendly error messages
 */
function getUserFriendlyMessage(error: Error, tool: string): string {
  // Check for specific error types
  if (error.message.includes('overlap')) {
    return 'Element kann nicht platziert werden: Überschneidung mit bestehendem Element.'
  }

  if (error.message.includes('bounds')) {
    return 'Element kann nicht platziert werden: Außerhalb der Wandgrenzen.'
  }

  if (error.message.includes('wall')) {
    return 'Bitte klicken Sie auf eine Wand, um das Element zu platzieren.'
  }

  // Generic message by tool
  const toolMessages: Record<string, string> = {
    window: 'Fehler beim Platzieren des Fensters. Bitte auf eine Wand klicken.',
    door: 'Fehler beim Platzieren der Tür. Bitte auf eine Wand klicken.',
    wall: 'Fehler beim Erstellen der Wand. Bitte zwei Punkte wählen.',
    roof: 'Fehler beim Erstellen des Dachs. Bitte Bereich auswählen.',
  }

  return toolMessages[tool] || 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
}

/**
 * Show error message to user
 * This could be integrated with a toast notification system
 */
function showErrorToUser(message: string): void {
  // For now, just log to console
  // In a real app, you'd show a toast notification
  console.warn('[User Message]:', message)

  // Example integration with a toast library:
  // toast.error(message, { duration: 4000 })
}

/**
 * Wrap async operations with error handling
 */
export async function safeAsync<T>(
  operation: () => Promise<T>,
  errorContext: ErrorContext
): Promise<T | null> {
  try {
    return await operation()
  } catch (error) {
    logError(error as Error, errorContext)
    return null
  }
}

/**
 * Wrap sync operations with error handling
 */
export function safeSync<T>(operation: () => T, errorContext: ErrorContext): T | null {
  try {
    return operation()
  } catch (error) {
    logError(error as Error, errorContext)
    return null
  }
}

/**
 * Check if error is recoverable
 */
export function isRecoverableError(error: Error): boolean {
  const recoverableMessages = ['overlap', 'bounds', 'validation', 'not found']

  return recoverableMessages.some((msg) => error.message.toLowerCase().includes(msg))
}

/**
 * Format error for development
 */
export function formatErrorForDev(error: Error, context?: ErrorContext): string {
  return `
Error: ${error.message}
Stack: ${error.stack}
Context: ${JSON.stringify(context, null, 2)}
  `.trim()
}
