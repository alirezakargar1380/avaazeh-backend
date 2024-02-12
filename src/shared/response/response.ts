import { HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { loginMessages } from "src/authentication/constants";
import errorMessages from "../constants/errorMessages";

export const error_response = (e: any, res: Response) => {
    console.log(e)
    if (e?.response?.statusCode)
        return res.status(e.response.statusCode).send(e.response.message)

    if (e.code === "ER_DUP_ENTRY") return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.DUBLICATE_DATA)
    if (e.message === "jwt expired") return res.status(HttpStatus.UNAUTHORIZED).send(errorMessages.LOGIN_AGAIN)
    if (e.message === loginMessages.usernameOrPassword)
        return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(loginMessages.usernameOrPassword);
    else if (e.message === loginMessages.active)
        return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(loginMessages.active);
    else if (e.isThrow)
        return res.status(HttpStatus.METHOD_NOT_ALLOWED).send(errorMessages.CHECK_YOUR_DATA);
    else
        return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(e);
}