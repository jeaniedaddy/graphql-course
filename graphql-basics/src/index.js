import { GraphQLServer } from 'graphql-yoga';

// Scalar types:  String, Boolean, Int, Float, ID

// Demo user data
const users = [{
    id: '1',
    name: 'Steve',
    email: 'jeaniedaddy@gmail.com',
    age: 47
},{
    id: '2',
    name: 'Jeanie',
    email: 'superstarjeanie@gmail.com',
},{
    id: '3',
    name: 'Hena',
    email: 'jeaniemommy@gmail.com',
    age: 42

}];

const posts = [{
    id: "1",
    title: "superman",
    body: "superman is stong",
    published: true,
    author: '1'
},{
    id: "2",
    title: "batman",
    body: "batman is popular",
    published: true,
    author: '1'
},{
    id: "3",
    title: "aquaman",
    body: "it is better than other 2",
    published: false,
    author: '2'
}];

// type definitions (schema)
const typeDefs = ` 
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        me: User!
        post: Post!
    } 

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }
`;

const resolvers = {
    Query: {
        posts(parent, args, ctx, info){
            if(!args.query){
                return posts;
            }

            return posts.filter((post)=>
                ( post.title.toLowerCase().includes(args.query.toLowerCase())  
                    || post.body.toLowerCase().includes(args.query.toLowerCase())
                )
            );
        },
        users(parent, args, ctx, info){
            if(!args.query){
                return users;
            }

            return users.filter(user=> user.name.toLowerCase().includes(args.query.toLowerCase())); 
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
    },
    Post: {
        author(parent, args, ctx, info){
            return users.find((user)=>{
                return user.id === parent.author;
            });
        }
    },
    User: {
        posts(parent,args,ctx,info){
            return posts.filter((post)=> post.author === parent.id);
        }
    }
};

const server = new GraphQLServer({
    typeDefs, resolvers
});

server.start((res)=>{
    console.log("Server is up at port : " + res.port);
}); 