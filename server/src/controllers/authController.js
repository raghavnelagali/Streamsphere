const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");

const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    // Basic required fields
    if (!name || !email || !password) {
        throw new AppError(
            "Name, email and password are required",
            400
        );
    }

    // Name validation
    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
        throw new AppError(
            "Name must contain at least 2 characters",
            400
        );
    }

    if (trimmedName.length > 50) {
        throw new AppError(
            "Name must not exceed 50 characters",
            400
        );
    }

    // Allow letters and spaces only
    const nameRegex = /^[A-Za-z ]+$/;

    if (!nameRegex.test(trimmedName)) {
        throw new AppError(
            "Name can contain only letters and spaces",
            400
        );
    }

    // Email validation
    const normalizedEmail = email.trim().toLowerCase();

    const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
        throw new AppError(
            "Please enter a valid email address",
            400
        );
    }

    // Password validation
    const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
        throw new AppError(
            "Password must be at least 8 characters and contain uppercase, lowercase, number and special character",
            400
        );
    }

    // Check existing user
    const existingUser = await User.findOne({
        email: normalizedEmail,
    });

    if (existingUser) {
        throw new AppError(
            "User already exists",
            409
        );
    }

    // Hash password
    const hashedPassword =
        await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
        name: trimmedName,
        email: normalizedEmail,
        password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
        success: true,
        message: "Registration successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            subscription: user.subscription,
        },
    });
});


const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
        email: email?.trim().toLowerCase(),
    });

    if (!user) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    const isMatch =
        await bcrypt.compare(
            password,
            user.password
        );

    if (!isMatch) {
        throw new AppError(
            "Invalid email or password",
            401
        );
    }

    const token = generateToken(user._id);

    res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            subscription: user.subscription,
        },
    });
});


const profile = asyncHandler(async (req, res) => {
    res.json({
        success: true,
        user: req.user,
    });
});


module.exports = {
    register,
    login,
    profile,
};