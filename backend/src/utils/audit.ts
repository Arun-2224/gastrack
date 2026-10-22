import { Request } from 'express';
import { AuditLog } from '../models/AuditLog';
import mongoose from 'mongoose';

export interface AuditLogOptions {
  user?: mongoose.Types.ObjectId | any;
  action: string;
  entity: string;
  entityId?: string;
  description: string;
  req?: Request;
}

export const logAudit = async (options: AuditLogOptions): Promise<void> => {
  try {
    const ipAddress = options.req 
      ? (options.req.headers['x-forwarded-for'] as string) || options.req.socket.remoteAddress || '127.0.0.1'
      : '127.0.0.1';

    await AuditLog.create({
      user: options.user?._id || options.user,
      action: options.action,
      entity: options.entity,
      entityId: options.entityId,
      description: options.description,
      ipAddress,
      createdAt: new Date(),
    });
  } catch (error) {
    console.error('[AuditLog] Failed to record audit log:', error);
  }
};
