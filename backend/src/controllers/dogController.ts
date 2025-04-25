import { Request, Response } from 'express';
import Dog from '../models/Dog';

// @desc    Get all dogs
// @route   GET /api/dogs
// @access  Public
export const getDogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const dogs = await Dog.find().sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: dogs.length,
      data: dogs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Get single dog
// @route   GET /api/dogs/:id
// @access  Public
export const getDogById = async (req: Request, res: Response): Promise<void> => {
  try {
    const dog = await Dog.findById(req.params.id);

    if (!dog) {
      res.status(404).json({
        success: false,
        error: 'Dog not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: dog,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Create new dog
// @route   POST /api/dogs
// @access  Private (would require auth in production)
export const createDog = async (req: Request, res: Response): Promise<void> => {
  try {
    const dog = await Dog.create(req.body);

    res.status(201).json({
      success: true,
      data: dog,
    });
  } catch (error) {
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map(val => (val as any).message);
      
      res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error',
      });
    }
  }
};

// @desc    Update dog
// @route   PUT /api/dogs/:id
// @access  Private (would require auth in production)
export const updateDog = async (req: Request, res: Response): Promise<void> => {
  try {
    const dog = await Dog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!dog) {
      res.status(404).json({
        success: false,
        error: 'Dog not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: dog,
    });
  } catch (error) {
    if (error instanceof Error && 'name' in error && error.name === 'ValidationError') {
      const messages = Object.values((error as any).errors).map(val => (val as any).message);
      
      res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error',
      });
    }
  }
};

// @desc    Delete dog
// @route   DELETE /api/dogs/:id
// @access  Private (would require auth in production)
export const deleteDog = async (req: Request, res: Response): Promise<void> => {
  try {
    const dog = await Dog.findById(req.params.id);

    if (!dog) {
      res.status(404).json({
        success: false,
        error: 'Dog not found',
      });
      return;
    }

    await dog.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
}; 