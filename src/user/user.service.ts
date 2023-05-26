import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService) {}

    async create({email,name,password,birthAt, role}: CreateUserDTO) {

        password = await bcrypt.hash(password, await bcrypt.genSalt());

        return await this.prisma.user.create({
            data: {
                name,
                email,
                password,
                birthAt: birthAt ? new Date(birthAt) : null,
                role
            }
        })
    }

    async list() {
        return await this.prisma.user.findMany();
    }
    
    async show(id: number) {

        await this.exists(id);

        return await this.prisma.user.findUnique({
            where: {
                id
            }
        });
    }

    async update(id: number, {birthAt,email,name,password}: UpdatePutUserDTO){
        
        await this.exists(id);

        password = await bcrypt.hash(password, await bcrypt.genSalt());

        return await this.prisma.user.update({
            where:{id},
            data: {
                email,
                name,
                password, 
                birthAt: birthAt ? new Date(birthAt) : null
            }
        })
    }
    
    async updateParcial(id: number, dataBase: UpdatePatchUserDTO){

        await this.exists(id);

        const data: any = {}
        const keys = Object.keys(dataBase);

        keys.forEach(elemt => {
            if(elemt ==  'birthAt'){
                data.birthAt =  new Date(dataBase.birthAt);
            }else {
                data[`${elemt}`] = dataBase[`${elemt}`] 
            }
            
        })

        if (dataBase.password) {
            dataBase.password = await bcrypt.hash(dataBase.password, await bcrypt.genSalt());
        }
        
        return await this.prisma.user.update({
            where:{id},
            data
        })
    }

    async delete(id: number){

        await this.exists(id);

        return await this.prisma.user.delete({
            where:{id}
        })
    }

    async exists(id: number){
        if(!(await this.prisma.user.count({
            where: {id}
        }))){
            throw new NotFoundException("Usuário não existe");
        }
    }
}
