import { IsEmail, IsStrongPassword } from "class-validator";

export class AuthLoginDTO{
    
    @IsEmail()
    email:string;

    @IsStrongPassword({
        minLength: 6,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 2,
        minSymbols: 1
    })
    password:string;
}