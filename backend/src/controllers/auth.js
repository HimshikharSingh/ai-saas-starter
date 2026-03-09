"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.login = exports.register = void 0;
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("database");
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey_change_me_in_prod';
const register = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // Validation
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const existingUser = await database_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const passwordHash = await bcryptjs_1.default.hash(password, 10);
        const user = await database_1.prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                subscription: {
                    create: {
                        tier: 'FREE',
                        monthlyTokenLimit: 10000,
                    }
                }
            },
        });
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during registration' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await database_1.prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const isValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        // Assuming authMiddleware attaches userId to req
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const user = await database_1.prisma.user.findUnique({
            where: { id: userId },
            include: { subscription: true }
        });
        if (!user)
            return res.status(404).json({ error: 'User not found' });
        // Omit password hash
        const { passwordHash, ...safeUser } = user;
        res.status(200).json({ user: safeUser });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error fetching profile' });
    }
};
exports.getMe = getMe;
//# sourceMappingURL=auth.js.map