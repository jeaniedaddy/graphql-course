import { GraphQLServer } from 'graphql-yoga';
import { PubSub } from 'graphql-yoga'

import Query from './resolvers/Query'
import Mutation from './resolvers/Mutation'
import Post from './resolvers/Post'
import User from './resolvers/User'
import Comment from './resolvers/Comment'
import Subscription from './resolvers/Subscription'
import db from './db';
import prisma from './prisma'

const pubsub = new PubSub();
const server = new GraphQLServer({
    typeDefs: "./src/schema.graphql", 
    resolvers: {
        Query , Mutation, Subscription, Post, User, Comment
    },
    context: { db, pubsub, prisma }
});

server.start((res)=>{
    console.log("Server is up at port : " + res.port);
}); 