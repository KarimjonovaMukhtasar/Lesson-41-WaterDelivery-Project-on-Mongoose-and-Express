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
      console.log('VALIDATION MIDDLEWARE START');
      console.log('req.body:', req.body);

      const result = schema.safeParse(req.body);

      if (!result.success) {
        console.log('VALIDATION FAILED:', result.error.format());
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
      console.log('VALIDATION PASSED → req.validatedData:', req.validatedData);
      next();
    } catch (error) {
      console.error('VALIDATION CRASH:', error);
      next(error);
    }
  };
}
