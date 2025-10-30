import logger from "./logger.js";

/**
 * Wraps any async controller function to automatically log entry and exit.
 * @param {Function} fn - async controller function (req, res, next)
 * @param {String} name - name of the controller
 */
export const withLogger = (fn, name) => {
  return async (req, res, next) => {
    const requestId = req.id || "N/A";
    const userId = req.user?.id || "guest";

    logger.info(` Entering ${name}`, { requestId, userId });

    try {
      await fn(req, res, next);
      logger.info(` Exiting ${name}`, { requestId, userId });
    } catch (err) {
      logger.error(`Error in ${name}`, { message: err.message, stack: err.stack, requestId, userId });
      next(err);
    }
  };
};
