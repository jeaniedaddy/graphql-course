import uuidv4 from 'uuid/v4'

const Mutation = {
    async createUser(parent, args, { prisma }, info){
        const emailTaken = await prisma.exists.User({email: args.data.email})
        if(emailTaken){
            throw new Error("Email taken")
        }

        return prisma.mutation.createUser(args.data,info)
    },
    async deleteUser(parent, args, { prisma }, info){
        const userExists = await prisma.exists.User({id: args.id})
        if(!userExists){
            throw new Error("User not found")
        }
        return prisma.mutation.deleteUser({ 
            where: {
                id: args.id
            }
        }, info)
    },
    updateUser(parent, args, { db }, info){
        const { name, email, age} = args.data
        const user = db.users.find(user => user.id === args.id);
        
        if(!user){
            throw new Error("User not found")
        }

        if(typeof args.data.name === "string"){
            user.name = name
        }

        if(typeof args.data.email === "string"){
            const emailExists = db.users.some(user=> user.email === email);
            if(emailExists){
                throw new Error("Email exists")
            }

            user.email = email
        }
        if(typeof args.data.age === "number"){
            user.age = age
        }
         
        return user
    },
    createPost(parent, args, { db, pubsub }, info){
        const userExists = db.users.some(user=> user.id === args.data.author);

        if(!userExists){
            throw new Error("No user");
        }
        const post = {
            id: uuidv4(),
            ...args.data
        };

        db.posts.push(post);
        if(post.published){
            pubsub.publish('post', {
                post: {
                    mutation: 'CREATED',
                    data: post
                }
            })
        }
        return post; 
    },
    deletePost(parent, args, { db, pubsub }, info){
        const postIndex = db.posts.findIndex(post => post.id === args.id);

        if(postIndex === -1){
            throw new Error("Post not found");
        }
        
        // remove the post
        const [post] = db.posts.splice(postIndex,1);
        db.comments = db.comments.filter(comment => comment.post !== args.id);
        if(post.published){
            pubsub.publish('post', {
                post: {
                    mutation: "DELETED",
                    data: post
                }
            })
        }

        return post; 
    },
    updatePost(parent, args, { db, pubsub }, info){
        const { id, data } = args
        const post = db.posts.find(post => post.id === id)
        const orgPost = {...post}

        if(!post){
            throw new Error("Post not found")
        }

        if(typeof data.title === "string"){
            post.title = data.title
        }
        
        if(typeof data.body === "string"){
            post.body = data.body
        }

        if(typeof data.published === "boolean"){
            post.published = data.published
            //create
            if(!orgPost.published&&post.published){
                pubsub.publish('post', {
                    post: {
                        mutation: "CREATED",
                        data: post
                    }
                })
            
            } else if(orgPost.published && !post.published){
                //deleted
                pubsub.publish('post', {
                    post: {
                        mutation: "DELETED",
                        data: orgPost
                    }
                })
            } else if(orgPost.published && post.published ){
                //updated
                pubsub.publish('post', {
                    post: {
                        mutation: "UPDATED",
                        data: post
                    }
                })

            }
        } else if(post.published){
            pubsub.publish('post', {
                post: {
                    mutation: "UPDATED",
                    data: post
                }
            })
        }

        return post

    },
    createComment(parent, args, { db, pubsub }, info){
        const userExists = db.users.some(user=> user.id === args.data.author);
        const postExists = db.posts.some(post=> post.id === args.data.post && post.published );
    
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

        db.comments.push(comment);

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'CREATED',
                data: comment
            }
        })
        return comment; 
    },
    deleteComment(parent, args, { db, pubsub }, info) {
        const commentIndex = db.comments.findIndex(comment=> comment.id === args.id);
        if(commentIndex === -1 ){
            throw new Error("Comments not found");
        }
        const [deletedComment] = db.comments.splice(commentIndex,1);
        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'DELETED',
                data: deletedComment
            }
        })

        return comment;
    },
    updateComment(parent, args, { db, pubsub }, info){
        const { id, data } = args;
        const comment = db.comments.find(comment => comment.id === id)
        if(!comment){
            throw new Error("Comment not found")
        }

        if(typeof data.text === "string"){
            comment.text = data.text
        }

        pubsub.publish(`comment ${comment.post}`, {
            comment: {
                mutation: 'UPDATED',
                data: comment
            }
        })

        return comment
    }
}

export { Mutation as default }