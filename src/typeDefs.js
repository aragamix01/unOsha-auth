import { gql } from 'apollo-server';

export default gql`
  type Query {
    currentUser(input: userinfo): User
  }
  type Mutation {
    signup(input: userinfo): User
    login(input: userinfo): UserLogin
  }
  input userinfo {
    username: String!
    password: String
  }

  type User {
    _id: ID
    username: String
    password: String
  }

  type UserLogin {
    username: String
    token: String
  }
`;
