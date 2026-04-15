// Define a interface `User` para tipagem forte em toda a aplicação.
// Uma interface em TypeScript descreve a "forma" de um objeto, especificando
// os nomes e os tipos de suas propriedades.
export interface User {
    // O ID único do usuário, geralmente um UUID ou um ID numérico do banco de dados.
    id: string;
    // O nome do usuário.
    name: string;
    // O endereço de e-mail do usuário, que também é usado para login e deve ser único.
    email: string;
}