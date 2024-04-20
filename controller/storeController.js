const httpStatusCode = require("../constant/httpStatusCode")
const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");
const StoreModel = require('../models/storeModel');
const {SendEmail}= require('../services/emailServices')
const StoreRegister = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(httpStatusCode.BAD_REQUEST).json({
                success: false,
                errors: errors.array(),
            });
        }
        const { firstname,
            lastname,
            storename,
            accountHolderName,
            accountNumber,
            ifscCode,
            branch,
            email,
            password,
            phone,
            address,
            city,
            pincode, } = req.body;

        // Check if user already exists
        const existingStore = await StoreModel.findOne({ email });

        if (existingStore) {
            return res.status(httpStatusCode.CONFLICT).json({
                success: false,
                message:
                    "User is already registered with this email or phone. Please sign in.",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const Store = await StoreModel.create({
            role: "store",
            firstname,
            lastname,
            username: firstname + " " + lastname,
            storename,
            accountHolderName,
            accountNumber,
            ifscCode,
            branch,
            email,
            password: hashedPassword,
            phone,
            address,
            city,
            pincode
        });

        // Send a congratulatory email to the user
        SendEmail(email, Store.username);
        return res.status(httpStatusCode.CREATED).json({
            success: true,
            message: "User registered successfully!",
            data: Store,
        });

    } catch (error) {
        return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json({
            succes: true,
            message: 'something went wrong',
            error: error.message
        })
    }
}

module.exports={StoreRegister}