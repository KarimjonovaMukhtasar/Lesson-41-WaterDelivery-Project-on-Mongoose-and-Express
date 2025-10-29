export function selfGuard(data) {
  return (req, res, next) => {
    try{
    const { id } = req.params;
    const { role } = req.user;
    if (id == req.user.id || data.includes(role)) {
      next();
      return;
    }
    return res
      .status(405)
      .send({ messsage: 'Permission denied! Not allowed!' });
    }catch (error){
        return next(error)
    }
  };
}
