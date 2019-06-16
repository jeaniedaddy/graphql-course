import { GraphQLServer } from 'graphql-yoga';

// Scalar types:  String, Boolean, Int, Float, ID

const typeDefs = ` 
    type Query {
        title: String!
        price: Float!
        releaseYear: Int!
        rating: Float
        inStock: Boolean!
    } 
`;

const resolvers = {
    Query: {
        title(){
            return 'Jussasic Park II';
        },
        price(){
            return  12.5;
        },
        releaseYear(){
            return 2000; 
        },
        rating(){
            return  null;
        },
        inStock(){
            return true;
        },
    }
};

const server = new GraphQLServer({
    typeDefs, resolvers
});

server.start((res)=>{
    console.log("Server is up at port : " + res.port);
}); 