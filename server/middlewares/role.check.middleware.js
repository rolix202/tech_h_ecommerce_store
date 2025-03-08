export const checkRole = (...allowedRoles) => {
    
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: "Unauthorized. Please log in."
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                error: "Permission denied. Access restricted."
            });
        }

        next();
    };
};
