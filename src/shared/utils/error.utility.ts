import * as _ from 'lodash';

class Exception extends Error {
  public isThrow: boolean;
  public extensions: any;
  constructor(error: any, isThrow: boolean) {
    super(error);
    this.extensions = error;
    this.isThrow = isThrow;
  }

  static setError(error: any, isThrow: boolean) {
    try {
      if (!error.extensions && _.isObject(error)) {
        return new Exception(error, isThrow);
      }

      if (_.isString(error)) {
        return new Exception(error, isThrow);
      }

      return error;
    } catch (err: any) {
      console.error(`custom error faild, ${err.message}`);
      throw new Error(err.message);
    }
  }
}

export default Exception;