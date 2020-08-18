// Validacija
const Joi = require("@hapi/joi");

// Registraciona validacija
const registerValidation = (data) => {
    const schema = Joi.object({
        type: Joi.string().min(2),
        verified: Joi.boolean(),
        name: Joi.string().min(2),
        lastName: Joi.string().min(2),
        username: Joi.string().min(4),
        password: Joi.string().min(6),
        jmbg: Joi.string().min(13),
        email: Joi.string().min(4).email(),
        department: Joi.string().min(2),
        profile: Joi.string().min(2),
        subjects: Joi.string().min(2),
        yearOfStudy: Joi.string(),
        indexNr: Joi.string()
    });
    return schema.validate(data);
};

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(4).required().email(),
        password: Joi.string().min(6).required()
    });
    return schema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;