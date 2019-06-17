import { GraphQLServer } from 'graphql-yoga';

// Scalar types:  String, Boolean, Int, Float, ID

// type definitions (schema)
const typeDefs = ` 
    type Query {
        grades: [Int!]!
        add(numbers:[Float!]!): Float!
        greeting(name:String): String!
        me: User!
        post: Post!
    } 

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
    }
`;

const resolvers = {
    Query: {
        
        grades(){
            return [33,43,21];
        },
        add(parent, args, ctx, info){
            if(args.numbers.length === 0){
                return 0; 
            }

            return args.numbers.reduce((accumulator, currentValue)=> {
                return accumulator + currentValue;
            });
        },
        greeting(parent, args, ctx, info){
            if(args.name){
                return `Hello ${args.name}`;
            } else {
                return 'Hello';
            }
        },
        me(){
            return {
                id: '1234OWEB',
                name: 'steve no',
                email: 'jeaniedaddy@gmail.com',
            }
        },
        post(){
            return {
                id: '22222',
                title: 'My first Post',
                body: 'this is my post test',
                published: true
            }
        }
    }
};

const server = new GraphQLServer({
    typeDefs, resolvers
});

server.start((res)=>{
    console.log("Server is up at port : " + res.port);
}); 