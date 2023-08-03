import Exception from "src/shared/utils/error.utility";

// import Schema from 'validate';
const Schema = require('validate');
import * as _ from 'lodash';

class Validate {
    private errorMessages: {
        length: () => string;
        match: () => string;
        type: () => string;
        required: () => string;
        validation: () => string
        // enum: () => string
    };

    constructor() {
        this.errorMessages = {
            required: () => 'ERROR_MESSAGE_REQUIRED',
            validation: () => 'ERROR_MESSAGE_INVALID',
            type: () => 'ERROR_MESSAGE_WRONG_TYPE',
            length: () => 'ERROR_MESSAGE_INVALID_LENGTH',
            match: () => 'ERROR_MESSAGE_CANNOT_PASS_REGEX',
            // enum: () => 'ERROR_MESSAGE_CANNOT_PASS_ENUM',
        };
    }

    projectData(items: any) {
        delete items.id
        const schema = new Schema({
            project_code: _.assign({}, {
                type: String,
                match: /^[0-9]*$/,
                required: false,
            }),
            title: _.assign({}, {
                type: String,
                required: true,
            }),
            _constructor: _.assign({}, {
                required: true,
            }),
            supervisoryOrganization: _.assign({}, {
                type: String,
                required: true,
            }),
            executiveOrganization: _.assign({}, {
                type: String,
                match: /^[0-9]*$/,
                required: true,
            }),
            x: _.assign({}, {
                type: String,
                match: /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/,
                length: {
                    min: 9,
                    max: 9
                },
                required: true,
            }),
            y: _.assign({}, {
                type: String,
                match: /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/,
                length: {
                    min: 10,
                    max: 10
                },
                required: true,
            }),
            location: _.assign({}, {
                type: String,
                match: /^[0-9]*$/,
                required: true,
            }),
            start_date: _.assign({}, {
                type: String,
                required: true,
            }),
            end_date: _.assign({}, {
                type: String,
                required: true,
            }),
            description: _.assign({}, {
                type: String,
                length: {
                    min: 10,
                    max: 300
                },
                required: false,
            })
        })

        schema.message(this.errorMessages);

        return this.sanitizeErrors(
            schema.validate(_.assign({}, items)),
            true,
        );
    }

    update(items: any) {

        const schema = new Schema({

            appearance_profile_of_the_sponsor_profile_box: _.assign({}, {
                type: Object,
                required: true,
            }, {
                padding_top: { required: true, type: Number },
                padding_right: { required: true, type: Number },
                padding_bottom: { required: true, type: Number },
                padding_left: { required: true, type: Number },
            }),

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