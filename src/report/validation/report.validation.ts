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

    params(items: any) {
        const schema = new Schema({
            status: _.assign({}, {
                type: String,
                match: /[0-9]/,
                enum: ['0', '1', '2'],
                required: false,
            })
        })

        schema.message(this.errorMessages);

        return this.sanitizeErrors(
            schema.validate(_.assign({}, items)),
            true,
        );
    }

    reportToProject(items: any) {
        delete items.id
        const schema = new Schema({
            projectStatus: _.assign({}, {
                type: String,
                match: /^[0-9]*$/,
                required: true,
            }),
            projectType: _.assign({}, {
                type: String,
                match: /^[0-9]*$/,
                required: true,
            }),
            contractRateBasics: _.assign({}, {
                type: String,
                match: /^[0-9]*$/,
                required: true,
            }),
            according_to_schedule: _.assign({}, {
                type: String,
                match: /^[0-1]*$/,
                required: true,
            }),
            percentage_of_progress: _.assign({}, {
                type: String,
                match: /^[0-9]*$/,
                required: true,
            }),
            percentage_of_progress_in_amount: _.assign({}, {
                type: String,
                match: /^[0-9]*$/,
                required: true,
            }),
            description: _.assign({}, {
                type: String,
                // match: /[0-9]/,
                required: true,
            }),
        })

        schema.message(this.errorMessages);

        return this.sanitizeErrors(
            schema.validate(_.assign({}, items)),
            true,
        );
    }

    // update(items: any) {

    //     const schema = new Schema({

    //         appearance_profile_of_the_sponsor_profile_box: _.assign({}, {
    //             type: Object,
    //             required: true,
    //         }, {
    //             padding_top: { required: true, type: Number },
    //             padding_right: { required: true, type: Number },
    //             padding_bottom: { required: true, type: Number },
    //             padding_left: { required: true, type: Number },
    //         }),

    //     })

    //     schema.message(this.errorMessages);

    //     return this.sanitizeErrors(
    //         schema.validate(_.assign({}, items)),
    //         true,
    //     );
    // }

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