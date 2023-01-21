import {IsEmail,IsEmpty,Length} from 'class-validator'
export class CreateUserInputs{
    
    @IsEmail()
    email:string;


    @Length(7,12)
    phone:string;

    
    @Length(7,12)
    password:string;
}

export interface UserPayload {
    _id:string;
    email:string;
    verified:boolean

}

export class UserLoginInputs {
   
    @IsEmail()
    email:string;

    @Length(7,12)
    password:string;
}

export class EditUserProfileInput {
   @Length(3,12)
    firstName:string;

    @Length(3,12)
    lastName :string;

    @Length(6,20)
    address:string;
}