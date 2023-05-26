import { Injectable, UnauthorizedException, BadRequestException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import { User } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { UserService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService{

    private issuer = "login";
    private audience = "users";    

    constructor(
        private readonly JWTService: JwtService, 
        private readonly prisma: PrismaService,
        private readonly userService: UserService
    ){}

    createToken(user:User){
        return {
            accessToken: this.JWTService.sign({
                id: user.id,
                email: user.email,
                name: user.name
                }, {
                    expiresIn: "7 days",
                    // expiresIn: "5 seconds",
                    subject: String(user.id),
                    issuer: this.audience,
                    audience: this.issuer
                })
        };
    }

    checkToken(token: string){
        try{
            const data = this.JWTService.verify(token, {
                issuer: this.audience,
                audience: this.issuer
            });
            
            return data;
        }catch (e) {
            throw new BadRequestException(e);
        }

    }

    isValidToken(token: string){
        console.log(token);
        
        try{
            this.checkToken(token);
            return true;
        }catch (e) {
            return false;
        }
    }

    async login(email:string, password:string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email
            }
        })

        if(!user) {
            throw new UnauthorizedException('Email e/ou senha incorretos.');
        }

        if(!await bcrypt.compare(password,user.password)){
            throw new UnauthorizedException('Email e/ou senha incorretos.');
        }
        return this.createToken(user);

    }

    async forget(email:string) {
        const user = await this.prisma.user.findFirst({
            where: {
                email
            }
        })

        if(!user) {
            throw new UnauthorizedException('E-mail está incorreto');
        }

        //TODO: Enviar o email...
        return true;
    }

    async reset(password:string, token:string) {
        //TODO: validar o token...

        const id = 0;
        const user = await this.prisma.user.update({
            where: {
                id
            },
            data: {
                password
            }
        })

        return this.createToken(user);
    }

    async register(body: AuthRegisterDTO) {

        const user = await this.userService.create(body);

        return this.createToken(user);
    }

}