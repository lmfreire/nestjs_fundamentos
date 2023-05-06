import { ExecutionContext, NotFoundException, createParamDecorator } from "@nestjs/common";

export const User = createParamDecorator((filter: Array<string>, context: ExecutionContext) => {

    const request = context.switchToHttp().getRequest();

    if(request.user){
        if(filter){
            
            let data: any = {};
            filter.forEach(element => {
                data[element] = request.user[element];
                
            });

            return data
        }else { 
            return request.user;
        }
    }else {
        throw new NotFoundException('User Not Found. Use AuthGuard');
    }



});