export const MUTATION_LOGIN = `
    mutation login($login: String!,$password: String!){
        auth{
            login(login:$login,password: $password){
                refreshToken
                idToken
                expiresIn
            }
        }
    }
`;
export const MUTATION_REFRESH_TOKEN = `
    mutation refresh($refreshToken: String!){
        auth{
            refreshToken(refreshToken: $refreshToken){
                idToken
                refreshToken
                expiresIn
            }
        }
    }
`;
