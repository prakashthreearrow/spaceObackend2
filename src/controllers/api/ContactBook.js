const { Op } = require('sequelize');
const Constants = require('../../services/Constants');
const { User, UserContactBook } = require('../../models');
const Response = require('../../services/Response')
const {
    userAddEditValidation, userDeleteValidation
} = require('../../services/UserValidation');

module.exports = {
    /**
     * @description This function is get user list.
     * @param req
     * @param res
     */
    userList: async (req, res) => {
        try {
            const user_list = await User.findAll({
                attributes: ['id', 'name'],
                include: {
                    model: UserContactBook,
                    attributes: ['id', 'email', 'phone_no'],
                },
                distinct: true
            })

            if (user_list) {
                return Response.successResponseData(
                    res,
                    user_list,
                    Constants.SUCCESS,
                    res.locals.__('success')
                )
            } else {
                return Response.successResponseData(
                    res,
                    [],
                    Constants.SUCCESS,
                    res.locals.__('noRecordFound')
                )
            }
        } catch (error) {
            return Response.errorResponseData(
                res,
                res.__('internalError'),
                Constants.INTERNAL_SERVER
            );
        }
    },

    /**
     * @description This function is add user.
     * @param req
     * @param res
     */
    addUser: async (req, res) => {
        try {
            const requestParams = req.body;
            userAddEditValidation(requestParams, res,
                async (validate) => {
                    if (validate) {
                        // Check if any of the email addresses in the payload already exist in the 'emails' table
                        const existingEmails = await UserContactBook.findAll({
                            where: {
                                [Op.or]: [
                                    {
                                        email: { [Op.in]: requestParams.emails },
                                    },
                                    {
                                        phone_no: { [Op.in]: requestParams.numbers }
                                    }
                                ]
                            }
                        });

                        if (existingEmails.length === 0) {
                            let userData = await User.create({ name: requestParams.name })

                            var contactBook = null;
                            if (requestParams.numbers.length > requestParams.emails.length) {
                                contactBook = requestParams.numbers.map((value, index) => {
                                    return {
                                        user_id: userData.id,
                                        phone_no: value,
                                        email: requestParams.emails[index] === undefined ? null : requestParams.emails[index]
                                    };
                                });
                            } else {
                                contactBook = requestParams.emails.map((value, index) => {
                                    return {
                                        user_id: userData.id,
                                        phone_no: requestParams.numbers[index] === undefined ? null : requestParams.numbers[index],
                                        email: value
                                    };
                                });
                            }

                            const userContactBook = await UserContactBook.bulkCreate(contactBook)

                            if (userContactBook) {
                                return Response.successResponseData(
                                    res,
                                    userContactBook,
                                    Constants.SUCCESS,
                                    res.locals.__('UserAddedSuccessfully')
                                )
                            }

                        } else {
                            return Response.successResponseWithoutData(
                                res,
                                res.locals.__('emailOrNumberAlreadyExist'),
                                Constants.BAD_REQUEST
                            )
                        }
                    }
                });
        } catch (error) {
            return Response.errorResponseData(
                res,
                res.__('internalError'),
                Constants.INTERNAL_SERVER
            );
        }
    },

    /**
     * @description This function is use to update user.
     * @param req
     * @param res
     */
    updateUser: async (req, res) => {
        try {
            const requestParams = req.body;
            userAddEditValidation(requestParams, res, async (validate) => {
                if (validate) {
                    if (requestParams.id) {
                        // Check if any of the email addresses in the payload already exist in the 'emails' table
                        const existingEmails = await UserContactBook.findAll({
                            where: {
                                [Op.and]: [
                                    {
                                        user_id: { [Op.ne]: requestParams.id },
                                    },
                                    {
                                        [Op.or]: [
                                            {
                                                email: { [Op.in]: requestParams.emails },
                                            },
                                            {
                                                phone_no: { [Op.in]: requestParams.numbers }
                                            }
                                        ]
                                    }
                                ]
                            }
                        });

                        if (existingEmails.length === 0) {
                            await User.update(
                                { name: requestParams.name },
                                { where: { id: parseInt(requestParams.id) } }
                            );

                            var contactBook = null;
                            if (requestParams.numbers.length > requestParams.emails.length) {
                                contactBook = requestParams.numbers.map((value, index) => {
                                    return {
                                        user_id: requestParams.id,
                                        phone_no: value,
                                        email: requestParams.emails[index] === undefined ? null : requestParams.emails[index]
                                    };
                                });
                            } else {
                                contactBook = requestParams.emails.map((value, index) => {
                                    return {
                                        user_id: requestParams.id,
                                        phone_no: requestParams.numbers[index] === undefined ? null : requestParams.numbers[index],
                                        email: value
                                    };
                                });
                            }

                            await UserContactBook.destroy(
                                { where: { user_id: parseInt(requestParams.id) } }
                            );

                            await UserContactBook.bulkCreate(contactBook);

                            return Response.successResponseData(
                                res,
                                [],
                                Constants.SUCCESS,
                                res.locals.__('UserUpdatedSuccessfully')
                            )

                        } else {
                            return Response.successResponseWithoutData(
                                res,
                                res.locals.__('emailOrNumberAlreadyExist'),
                                Constants.BAD_REQUEST
                            )
                        }
                    }else{
                        return Response.successResponseWithoutData(
                            res,
                            res.locals.__('addEditValidationId'),
                            Constants.BAD_REQUEST
                        )
                    }
                }
            });
        } catch (error) {
            return Response.errorResponseData(
                res,
                res.__('internalError'),
                Constants.INTERNAL_SERVER
            );
        }
    },

    /**
    * @description This function is use to delete user.
    * @param req
    * @param res
    */
    deleteUser: async (req, res) => {
        const requestParams = req.body;
        try {
            userDeleteValidation(requestParams, res, async (validate) => {
                if (validate) {
                    await UserContactBook.destroy(
                        { where: { user_id: parseInt(requestParams?.id) } }
                    );

                    await User.destroy(
                        { where: { id: parseInt(requestParams?.id) } }
                    );

                    return Response.successResponseWithoutData(
                        res,
                        res.locals.__('userDeleted'),
                        Constants.SUCCESS,
                    )
                }
            });
        } catch (error) {
            return Response.errorResponseData(
                res,
                res.__('internalError'),
                Constants.INTERNAL_SERVER
            );
        }
    }

}
