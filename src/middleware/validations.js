// export function validate(schema) {
//   return (req, res, next) => {
//     try{
//       const result = schema.safeParse(req.body);
//       console.log(req.body)
//     if (!result.success) {
//       return res.status(400).json({ result: result.error.errors });
//     }
//     req.validatedData = result.data;
//     next();
//     }catch(error){
//       console.error('UNEXPECTED ERROR IN VALIDATION MIDDLEWARE:', error);
//       return res.status(500).json({
//         success: false,
//         message: 'Server error during validation',
//       });
//     }
//   };
// }

export function validate(schema) {
  return (req, res, next) => {
    try {
     const result = schema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: result.error.issues.map(e => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        });
      }
      req.validatedData = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
}
