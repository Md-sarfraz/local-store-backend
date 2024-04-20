const bcrypt = require("bcrypt");
const Admin = require("../models/adminModel");
const httpStatusCode = require("../constant/httpStatusCode");
const { getToken } = require("../middleware/authMiddleware");

const register = async (req, res) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Please fill all fields",
            });
        }

        const existingUser = await Admin.findOne({ email });

        if (existingUser) {
            return res.status(httpStatusCode.CONFLICT).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            username,
            email,
            password: hashedPassword,
            role:'admin'
        });

        return res.status(httpStatusCode.OK).json({
            success: true,
            message: "Admin registered successfully",
            data: admin,
        });
    } catch (error) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
            success: false,
            message: "Something went wrong while registering",
            error: error.message,
        });
    }
};


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "please fill all the fields correctly!"
            })
        }

        const User = await Admin.findOne({ email });
        if (!User) {
            return res.status(httpStatusCode.BAD_REQUEST).json({
                success: false,
                message: "the user is not registered"
            })
        }

        const isPasswordValid = await bcrypt.compare(password, User.password);
        if (!isPasswordValid) {
            return res.status(httpStatusCode.BAD_REQUEST).json({
                success: false,
                message: "the user is not registered or email or password is incorrect"
            })
        }


        const token = await getToken(User)
        return res.status(httpStatusCode.OK).json({
            success: true,
            message: "login successfully",
            data: { User, token }
        })
    } catch (error) {
        return res.status(httpStatusCode.BAD_REQUEST).json({
            success: false,
            message: "Something went wrong while registering",
            error: error.message,
        });
    }
}

module.exports = {
    register,
    login
};
