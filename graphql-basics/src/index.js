import { GraphQLServer } from 'graphql-yoga';
import { parseConstValue } from 'graphql/language/parser';
import { ProvidedRequiredArguments } from 'graphql/validation/rules/ProvidedRequiredArguments';

// Scalar types:  String, Boolean, Int, Float, ID

// Demo user data

const comments = [{
    id: '1',
    text: 'good comment',
    author: '1'
}, {
    id: '1',
    text: 'it was really funn',
    author: '1'
}, {
    id: '2',
    text: 'not good',
    author: '3'
}, {
    id: '2',
    text: 'it was so so ',
    author: '2'

}, {
    id: '3',
    text: 'waste of my money',
    author: '1'
}, {
    id: '3',
    text: 'amazing',
    author: '3'
}];

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
        comments(query:String): [Comment!]!
        me: User!
        post: Post!
    } 

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
    }
`;

const resolvers = {
    Query: {
        comments(parent, args, ctx, info){
            if(!args.query){
                return comments;
            }

            return comments.filter((comment)=> comment.text.toLowerCase().includes(args.query.toLowerCase()));
        },
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
            return posts.filter(post=> post.author === parent.id);
        },
        comments(parent, args, ctx, info){
            return comments.filter(comment=>comment.author === parent.id);
        }
    },
    Comment: {
        author(parent, args, ctx, info){
            return users.find((user)=>(user.id === parent.author));
        }
    }
};

const server = new GraphQLServer({
    typeDefs, resolvers
});

server.start((res)=>{
    console.log("Server is up at port : " + res.port);
}); 