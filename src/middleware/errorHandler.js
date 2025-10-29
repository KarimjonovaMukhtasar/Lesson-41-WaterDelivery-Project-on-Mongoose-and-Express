export const errorHandler = (req, res, error) => {
  console.error(error.stack);
  return res
    .status(error.status || 500)
    .json({
      success: false, 
      message: error.message || `INTERNAL SERVER ERROR!`, });
};
