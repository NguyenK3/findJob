export interface IUsers {
    _id: string
    email: string
    name: string
    role: {
        _id: string
        name: string
    }
    permissions?: {
        _id: string
        name: string
        apiPath: string
        module: string
    } []
}