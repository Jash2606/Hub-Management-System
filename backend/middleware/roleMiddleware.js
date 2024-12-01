const restrictTo = (...allowedRoles) => {
  return (req, res, next) => {
      // Ensure user is authenticated and their role exists
      if (!req.user || !req.user.role) {
          return res.status(403).json({
              status: 'fail',
              message: 'Access denied. No role found for this user.',
          });
      }

      // Check if the user's role is in the list of allowed roles
      if (!allowedRoles.includes(req.user.role)) {
          return res.status(403).json({
              status: 'fail',
              message: 'Access denied. You do not have permission to perform this action.',
          });
      }

      // If the role matches, proceed to the next middleware or controller
      next();
  };
};

module.exports = { restrictTo };
