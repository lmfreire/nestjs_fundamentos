import { IsString, IsEmail, IsStrongPassword, IsOptional, IsDateString, IsEnum } from "class-validator";
import { Role } from "src/enums/role.enums";

export class CreateUserDTO {
    
    @IsString()
    name: string;

    @IsEmail()
    email: string;

    @IsStrongPassword({
        minLength: 6,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 2,
        minSymbols: 1
    })
    password: string;

    @IsOptional()
    @IsDateString()
    birthAt: string;

    @IsOptional()
    @IsEnum(Role)
    role: number;
}