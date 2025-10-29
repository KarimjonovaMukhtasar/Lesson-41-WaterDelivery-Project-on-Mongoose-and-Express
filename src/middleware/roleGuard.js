import { ApiError } from '../helper/errorMessage.js';

export const roleGuard = (...roles) => {
  return (req, res, next) => {
    try {
      if(!req.user || !req.user.role){
        return next(new ApiError(401, `UNAUTHORIZED, USER INFO IS MISSING!`))
      }
      const userRole = req.user.role;
      if (!roles.includes(userRole)) {
        return next(new ApiError(403, 'FORBIDDEN, YOUR ROLE HAS BEEN DENIED FOR THIS ACCESS!'));
      }
      next();
    } catch (error) {
      console.log(error.message);
      return next(new ApiError(500, `ERROR WITH ROLE GUARD!`));
    }
  };
};