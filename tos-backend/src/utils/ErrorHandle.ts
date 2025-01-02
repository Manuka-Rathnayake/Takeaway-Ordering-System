import mongoose from "mongoose";

interface DBErrorCode {
  code: number;
  msg: string;
}

export const handleMongooseError = (error: unknown): DBErrorCode => {
  if (error instanceof mongoose.Error.ValidationError) {
    console.error('Validation error:', error.message);
    return {
      code: 1,
      msg: `ValidationError: ${error.message}`
    }
  } else if (error instanceof mongoose.Error.CastError) {
    console.error('Cast error:', error.message);
    return {
      code: 2,
      msg: `CastERROR: ${error.message}`
    }
  } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
    console.error('Document not found:', error.message);
    return {
      code: 3,
      msg: `NotFound: ${error.message}`
    }
  } else if (error instanceof mongoose.Error) {
    console.error('Other Mongoose error:', error.message);
    return {
      code: 1,
      msg: `Internal Server Error`
    }
  } else {
    console.error('Non-Mongoose error:', error);
    return {
      code: 1,
      msg: `Internal Server Error`
    }
  }
};
