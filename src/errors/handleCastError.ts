import mongoose from "mongoose";
import { TErrorSource, TGenericErrorResponse } from "../interface/error";

const handleCastError = (err: mongoose.Error.CastError) : TGenericErrorResponse => {
    const errorMessages : TErrorSource =  [{
        path: err.path,
        message: err.message,
    }]
    
    const statusCode = 400;

    return {
        statusCode,
        message: err.message,
        errorMessages
    }
}

export default handleCastError;