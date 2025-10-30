import logger from "../utils/logger.js"

export const errorHandler = (req, res, err) => {
   logger.error("Unhandled error", {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId: req.id,
    userId: req.user?.id,
  });
  return res
    .status(err.status || 500)
    .json({
      success: false, 
      message: err.message || `INTERNAL SERVER ERROR!`, });
};
