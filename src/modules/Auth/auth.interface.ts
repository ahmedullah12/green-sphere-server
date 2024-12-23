import { USER_ROLE } from "../User/user.constant";


export type TLoginUser = {
  email: string;
  password: string;
};

export type TRegisterUser = {
  name: string;
  email: string;
  password: string;
  profilePhoto: string;
  role: keyof typeof USER_ROLE;
};

export type TGoogleUserInfo =  {
  sub: string;          
  name: string;         
  given_name: string;   
  family_name: string;  
  picture: string;      
  email: string;        
  email_verified: boolean; 
  locale: string;       
}