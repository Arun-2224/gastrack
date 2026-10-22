import { Response, NextFunction } from 'express';
import { Location } from '../models/Location';
import { AuthRequest } from '../middleware/auth';

export const getLocations = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const locations = await Location.find({ status: 'ACTIVE' }).sort({ name: 1 });
    res.status(200).json({ success: true, count: locations.length, locations });
  } catch (error) {
    next(error);
  }
};

export const createLocation = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, type, address } = req.body;
    const location = await Location.create({ name, type, address });
    res.status(201).json({ success: true, location });
  } catch (error) {
    next(error);
  }
};
