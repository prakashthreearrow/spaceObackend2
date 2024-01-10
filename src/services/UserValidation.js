const Response = require('./Response')
const Joi = require('@hapi/joi')
const Helper = require('./Helper')

module.exports = {
    /** 
    * @description This function validate the user data.
    * @param req
    * @param res
    */
    userAddEditValidation: (req, res, callback) => {

        const schema = Joi.string().trim().required();
        const { error } = schema.validate(req.name);
        if (error) {
            return Response.validationErrorResponseData(
                res,
                res.__(Helper.validationMessageKey('addEditUserValidation', error))
            )
        } else {
            const emailArraySchema = Joi.array().items(
                Joi.string().email().allow(null).regex(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
            );

            const { error } = emailArraySchema.validate(req.emails);
            if (error) {
                return Response.validationErrorResponseData(
                    res,
                    res.__(Helper.validationMessageKey('addEditUserValidation', error))
                )
            } else {
                const phoneNumberArraySchema = Joi.array().items(
                    Joi.string().allow(null).max(10)
                );

                const { error } = phoneNumberArraySchema.validate(req.numbers);
                if (error) {
                    return Response.validationErrorResponseData(
                        res,
                        res.__(Helper.validationMessageKey('addEditUserValidation', error))
                    )
                }
                return callback(true)
            }
        }
    },

    /**
   * @description This function validate id to delete user.
   * @param req
   * @param res
   */
    userDeleteValidation: (req, res, callback) => {
        const schema = Joi.string().trim().required();

        const { error } = schema.validate(req.id);
        if (error) {
            return Response.validationErrorResponseData(
                res,
                res.__(Helper.validationMessageKey('userDeleteValidation', error))
            )
        }
        return callback(true)
    }
}
