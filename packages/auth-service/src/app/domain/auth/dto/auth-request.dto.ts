import { ApiProperty } from "@nestjs/swagger";
import { IsDefined, IsEmail, IsString } from "class-validator";

export class UserSignInDto{
    @ApiProperty({
        description: 'email',
        example: 'example@gmail.com',
        required:true
    })
    @IsDefined()
    @IsString()
    @IsEmail()
    public email!:string;

    @ApiProperty({
        description: 'password',
        example: '384r9302332',
        required:true
    })
    @IsDefined()
    @IsString()
    public password!:string;



}