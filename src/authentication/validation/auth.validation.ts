import Exception from "src/shared/utils/error.utility";
const Schema = require('validate');
import * as _ from 'lodash';

class Validate {
    private errorMessages: {
        length: () => string;
        match: () => string;
        type: () => string;
        required: () => string;
        validation: () => string
    };

    constructor() {
        this.errorMessages = {
            required: () => 'ERROR_MESSAGE_REQUIRED',
            validation: () => 'ERROR_MESSAGE_INVALID',
            type: () => 'ERROR_MESSAGE_WRONG_TYPE',
            length: () => 'ERROR_MESSAGE_INVALID_LENGTH',
            match: () => 'ERROR_MESSAGE_CANNOT_PASS_REGEX'
        };
    }

    login(items: any) {
        // /^[\u0600-\u06FF\sA-Za-z]+$/ persion and english
        delete items.id
        const schema = new Schema({
            username: _.assign({}, {
                type: String,
                match: /^(?:[a-zA-Z\d]+(?:(?:\.|-|_)[a-zA-Z\d])*)+$/,
                required: true,
            }),
            password: _.assign({}, {
                type: String,
                match: /^[0-9a-zA-Z]*$/,
                required: true,
            })
        })

        schema.message(this.errorMessages);

        return this.sanitizeErrors(
            schema.validate(_.assign({}, items)),
            true,
        );
    }

    sanitizeErrors(errors: any, throwErrors: boolean) {

        const errs = _.map(
            errors,
            (error: any) => ({
                [error.path]: error.message
            }),
        );

        if (_.size(errs)) {
            console.error(`Validation failed, ${JSON.stringify(errs)}`);

            if (throwErrors) {
                throw Exception.setError(errs, true)
            }
        }

        return errs;
    }
}

export default new Validate();