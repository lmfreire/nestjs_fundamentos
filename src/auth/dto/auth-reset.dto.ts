import { IsJWT, IsStrongPassword } from "class-validator";

export class AuthResetDTO{

    @IsStrongPassword({
        minLength: 6,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 2,
        minSymbols: 1
    })
    password:string;

    @IsJWT()
    token:string;

}