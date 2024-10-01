/* eslint-disable @typescript-eslint/no-explicit-any */
import { TErrorSource, TGenericErrorResponse } from '../interface/error';

const handleDuplicateError = (err: any): TGenericErrorResponse => {
  const regex = /dup key: { ([\w]+):/;
  const matchPath = err.message.match(regex);
  const extractedPath = matchPath && matchPath[1];

  const errorMessages: TErrorSource = [
    {
      path: extractedPath,
      message: err.message,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: err.message,
    errorMessages,
  };
};

export default handleDuplicateError;
