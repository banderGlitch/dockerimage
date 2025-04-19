// Admin role can only delete this email

export const authorizeRoles = (...allowedRole) => {
    return (req, res, next) => {
        const userRole = req.user?.role;

        if (!userRole || !allowedRole.includes(userRole)){
            return res.status(403).json({ message: 'Access denied: Insufficient permissions' });
        }

        next()
    }
}

