export interface CreateRoleDto {
    title: string
    accessibility: any
    projectAcc: any
    reportAcc: any
    rolesAcc: any
    settingsAcc: any
    variableSettingsAcc: any
    usersAcc: any
    logsAcc: any
}

export interface IUpdateRole {
    title: string
}