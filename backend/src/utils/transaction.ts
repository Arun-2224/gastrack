import mongoose, { ClientSession } from 'mongoose';

export async function withTransaction<T>(
  callback: (session: ClientSession | null) => Promise<T>
): Promise<T> {
  // Check if current connection supports transactions (replica set)
  let session: ClientSession | null = null;
  try {
    session = await mongoose.startSession();
    let result: T;
    try {
      session.startTransaction();
      result = await callback(session);
      await session.commitTransaction();
      return result;
    } catch (txError: any) {
      // If error indicates transactions aren't supported on standalone
      if (
        txError.message?.includes('Transaction numbers are only allowed on a replica set member') ||
        txError.message?.includes('Standalone servers do not support transactions')
      ) {
        await session.abortTransaction().catch(() => {});
        session.endSession();
        // Fallback to running without transaction
        return await callback(null);
      }
      await session.abortTransaction().catch(() => {});
      throw txError;
    } finally {
      session.endSession();
    }
  } catch (err: any) {
    if (session) {
      session.endSession();
    }
    // Fallback to running directly
    return await callback(null);
  }
}
