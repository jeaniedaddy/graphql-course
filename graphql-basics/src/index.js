import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

// Scalar types:  String, Boolean, Int, Float, ID

// Demo user data

let comments = [{
    id: '101',
    text: 'good comment',
    author: '1',
    post: '3'
}, {
    id: '102',
    text: 'it was really funn',
    author: '1',
    post: '2'
}, {
    id: '103',
    text: 'not good',
    author: '3',
    post: '3'
}, {
    id: '104',
    text: 'it was so so ',
    author: '2',
    post: '1'

}, {
    id: '105',
    text: 'waste of my money',
    author: '1',
    post: '1'
}, {
    id: '106',
    text: 'amazing',
    author: '3',
    post: '2'
}];

let users = [{
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

let posts = [{
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

    type Mutation {
        createUser(data: CreateUserInput!): User!
        deleteUser(id: ID!):User!
        createPost(data: CreatePostInput!):Post!
        deletePost(id: ID!): Post!
        createComment(data: CreateCommentInput!): Comment!
        deleteComment(id: ID!) : Comment!
    }

    input CreateUserInput {
        name: String! 
        email: String! 
        age: Int
    }

    input CreatePostInput {
        title: String! 
        body:String!  
        author:ID! 
        published: Boolean!
    }

    input CreateCommentInput {
        post: ID! 
        text:String! 
        author:ID!
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
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
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
    Mutation : {
        createUser(parent, args, ctx, info){
            const emailTaken = users.some(user=> user.email.toLowerCase()=== args.data.email.toLowerCase());
            if(emailTaken){
                throw new Error("Email taken");
            }
            const user = {
                id: uuidv4(),
                ...args.data
            };

            users.push(user);
            return user; 
        },
        deleteUser(parent, args, ctx, info){
            const userIndex = users.findIndex(user => user.id === args.id);

            if(userIndex === -1){
                throw new Error("User not found");
            }
            
            // remove the user
            const deletedUser = users.splice(userIndex,1);

            // remove posts by the user
            posts = posts.filter(post=> {
                const match = post.author === args.id;

                // remove all comment for the post
                if(match){
                    comments = comments.filter(comment => comment.post !== post.id);
                }

                return !match;
            });

            // remove matching comments
            comments = comments.filter(comment => comment.author !== args.id);

            return deletedUser[0]; 
        },
        createPost(parent, args, ctx, info){
            const userExists = users.some(user=> user.id === args.data.author);

            if(!userExists){
                throw new Error("No user");
            }
            const post = {
                id: uuidv4(),
                ...args.data
            };

            posts.push(post);
            return post; 
        },
        deletePost(parent, args, ctx, info){
            const postIndex = posts.findIndex(post => post.id === args.id);

            if(postIndex === -1){
                throw new Error("Post not found");
            }
            
            // remove the post
            const deletedPosts = posts.splice(postIndex,1);
            comments = comments.filter(comment => comment.post !== args.id);

            return deletedPosts[0]; 
        },
        createComment(parent, args, ctx, info){
            const userExists = users.some(user=> user.id === args.data.author);
            const postExists = posts.some(post=> post.id === args.data.post && post.published );
        
            if(!userExists){
                throw new Error("Unable to find the user");
            }
            if(!postExists){
                throw new Error("Unable to find the post");
            }
            const comment = {
                id: uuidv4(),
                ...args.data
            };

            comments.push(comment);
            return comment; 
        },
        deleteComment(parent, args, ctx, info) {
            const commentIndex = comments.findIndex(comment=> comment.id === args.id);
            if(commentIndex === -1 ){
                throw new Error("Comments not found");
            }
            const deletedComments = comments.splice(commentIndex,1);

            return deletedComments[0];
        }

    },
    Post: {
        author(parent, args, ctx, info){
            return users.find((user)=>{
                return user.id === parent.author;
            });
        },
        comments(parent, args, ctx, info){
            return comments.filter((comment)=>{
                return comment.post === parent.id;
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
        },
        post(parent, args, ctx, info){
            return posts.find((post)=> (post.id === parent.post));
        } 

    }
};

const server = new GraphQLServer({
    typeDefs, resolvers
});

server.start((res)=>{
    console.log("Server is up at port : " + res.port);
}); 