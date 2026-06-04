/**
 * Structured security logging functions.
 * 
 * Used to track important security and business events across the application.
 * In a production environment, these logs could be sent to a centralized logging
 * system like Datadog, ELK stack, or AWS CloudWatch.
 */

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL'
}

interface BaseAuditLog {
  timestamp: string;
  level: LogLevel;
  event: string;
  userId?: string;
  ipAddress?: string;
  metadata?: Record<string, any>;
}

function writeLog(log: BaseAuditLog) {
  // For now, write to console.
  // In production, integrate with a real logging service.
  const formattedLog = JSON.stringify(log);
  
  if (log.level === LogLevel.ERROR || log.level === LogLevel.CRITICAL) {
    console.error(formattedLog);
  } else if (log.level === LogLevel.WARN) {
    console.warn(formattedLog);
  } else {
    console.info(formattedLog);
  }
}

export function logLoginAttempt(
  userId: string | undefined, 
  ipAddress: string, 
  success: boolean, 
  reason?: string
) {
  writeLog({
    timestamp: new Date().toISOString(),
    level: success ? LogLevel.INFO : LogLevel.WARN,
    event: 'LOGIN_ATTEMPT',
    userId,
    ipAddress,
    metadata: {
      success,
      reason
    }
  });
}

export function logXpAward(
  userId: string, 
  amount: number, 
  source: string, 
  transactionId: string
) {
  writeLog({
    timestamp: new Date().toISOString(),
    level: LogLevel.INFO,
    event: 'XP_AWARDED',
    userId,
    metadata: {
      amount,
      source,
      transactionId
    }
  });
}

export function logAdminAction(
  adminId: string, 
  actionType: string, 
  targetId?: string, 
  details?: Record<string, any>
) {
  writeLog({
    timestamp: new Date().toISOString(),
    level: LogLevel.WARN, // Elevated level for admin actions for easier auditing
    event: 'ADMIN_ACTION',
    userId: adminId,
    metadata: {
      actionType,
      targetId,
      ...details
    }
  });
}
