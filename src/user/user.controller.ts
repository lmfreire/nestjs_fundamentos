import { Body, Controller, Get, Post, Put, Patch, Delete, UseInterceptors, UseGuards } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdatePutUserDTO } from "./dto/update-put-user.dto";
import { UpdatePatchUserDTO } from "./dto/update-patch-user.dto";
import { UserService } from "./user.service";
import { LogInterceptor } from "src/interceptors/log.interceptor";
import { ParamId } from "src/decorators/param-id.decorator";
import { Roles } from "src/decorators/roles.decorator";
import { Role } from "src/enums/role.enums";
import { RoleGuard } from "src/guards/role.guard";
import { AuthGuard } from "src/guards/auth.guard";
import {SkipThrottle, ThrottlerGuard, Throttle} from '@nestjs/throttler';

@Roles(Role.Admin)
@UseGuards(/*ThrottlerGuard,*/ AuthGuard, RoleGuard)
@UseInterceptors(LogInterceptor)
@Controller('users')
export class UserController{
    constructor(private readonly userService: UserService) {}

    // @UseInterceptors(LogInterceptor)
    // @UseGuards(ThrottlerGuard)
    @Post()
    async create(@Body() data: CreateUserDTO){
        return await this.userService.create(data);
    }

    @SkipThrottle()
    @Get()
    async list() {
        return this.userService.list()
    }

    // @Roles(Role.Admin, Role.User) da para sobreescrever
    @Throttle(100, 60)
    @Get(':id')
    async showOne(@ParamId() id: number) {
        return this.userService.show(id);
    }

    @Put(':id')
    async update(@Body() data: UpdatePutUserDTO, @ParamId() id: number){
        return this.userService.update(id, data);
    }
    
    @Patch(':id')
    async updatePartial(@Body() data: UpdatePatchUserDTO, @ParamId() id: number){
        return this.userService.updateParcial(id, data);
    }

    @Delete(':id')
    async delete(@ParamId() id: number){
        return this.userService.delete(id);
    }
}