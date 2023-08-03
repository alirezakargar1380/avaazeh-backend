export interface UsersChart {
    numberOfReports: string
    user_month: number
}

export class CreateUserDto {
    username: string;
    fullName: string;
    password: string;
    role: number;
    organization: number;
}

export class LoginUserDto {
    username: string;
    password: string;
}