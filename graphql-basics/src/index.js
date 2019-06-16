import { GraphQLServer } from 'graphql-yoga';

// Scalar types:  String, Boolean, Int, Float, ID

const typeDefs = ` 
    type Query {
            hello: String!
            name: String!
            location: String!
            bio: String!
    } 
`;

const resolvers = {
    Query: {
         hello: ()=>{
            return "Hello graphQL";
        },
        name: ()=> {
            return "Steve No"
        },
        location: ()=> {
            return "cherry hill new jersey"
        },
        bio: ()=> {
            return "I am a software engineer in NJ"
        }
    }
};

const server = new GraphQLServer({
    typeDefs, resolvers
});

server.start((res)=>{
    console.log("Server is up at port : " + res.port);
}); 