import { Request, Response } from 'express';
import { isDbConnected } from '../config/db';
import { UserModel, IAddress } from '../models/User';
import { inMemoryStore } from '../store/inMemoryStore';

export async function getAddresses(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    if (isDbConnected()) {
      const user = await UserModel.findById(userId).select('addresses');
      res.json({ success: true, addresses: user?.addresses || [] });
    } else {
      const user = inMemoryStore.getUserById(userId);
      res.json({ success: true, addresses: user?.addresses || [] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function addAddress(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const { fullName, phone, street, city, state, postalCode, isDefault = false } = req.body;

    if (!fullName || !phone || !street || !city || !state || !postalCode) {
      res.status(400).json({ success: false, message: 'Please provide all required address fields.' });
      return;
    }

    if (isDbConnected()) {
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      if (isDefault) {
        user.addresses.forEach((a: IAddress) => {
          a.isDefault = false;
        });
      } else if (user.addresses.length === 0) {
        // First address is default
      }

      const newAddr = {
        fullName: fullName.trim(),
        phone: phone.trim(),
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        isDefault: Boolean(isDefault || user.addresses.length === 0),
      };

      user.addresses.push(newAddr);
      await user.save();

      res.status(201).json({
        success: true,
        message: 'Address added successfully',
        addresses: user.addresses,
      });
    } else {
      const newAddress = inMemoryStore.addAddress(userId, {
        fullName: fullName.trim(),
        phone: phone.trim(),
        street: street.trim(),
        city: city.trim(),
        state: state.trim(),
        postalCode: postalCode.trim(),
        isDefault: Boolean(isDefault),
      });

      if (!newAddress) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      const user = inMemoryStore.getUserById(userId);
      res.status(201).json({
        success: true,
        message: 'Address added successfully',
        addresses: user?.addresses || [],
      });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function updateAddress(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const { addressId } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    if (isDbConnected()) {
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      const addr = user.addresses.id(addressId);
      if (!addr) {
        res.status(404).json({ success: false, message: 'Address not found.' });
        return;
      }

      if (req.body.isDefault) {
        user.addresses.forEach((a: IAddress) => {
          a.isDefault = false;
        });
      }

      Object.assign(addr, req.body);
      await user.save();

      res.json({ success: true, message: 'Address updated', addresses: user.addresses });
    } else {
      const updated = inMemoryStore.updateAddress(userId, addressId, req.body);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Address not found.' });
        return;
      }
      const user = inMemoryStore.getUserById(userId);
      res.json({ success: true, message: 'Address updated', addresses: user?.addresses || [] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export async function deleteAddress(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;
    const { addressId } = req.params;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    if (isDbConnected()) {
      const user = await UserModel.findById(userId);
      if (!user) {
        res.status(404).json({ success: false, message: 'User not found.' });
        return;
      }

      user.addresses.pull({ _id: addressId });
      if (user.addresses.length > 0 && !user.addresses.some((a: IAddress) => a.isDefault)) {
        user.addresses[0].isDefault = true;
      }
      await user.save();

      res.json({ success: true, message: 'Address deleted', addresses: user.addresses });
    } else {
      const deleted = inMemoryStore.deleteAddress(userId, addressId);
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Address not found or already deleted.' });
        return;
      }
      const user = inMemoryStore.getUserById(userId);
      res.json({ success: true, message: 'Address deleted', addresses: user?.addresses || [] });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}
