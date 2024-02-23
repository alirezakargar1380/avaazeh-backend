export interface JWT_TOKEN {
    id: number
    roleId: number
    role: {
        title: string,
        isAdmin: boolean,
    }
}