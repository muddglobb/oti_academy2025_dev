import jwt from 'jsonwebtoken';

const generateToken = (user) => {
    const payload = {
        sub: user.id,
        role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
};

export { generateToken, verifyToken };