import uuidv4 from 'uuid/v4'

const Mutation = {
    createUser(parent, args, { db }, info){
        const emailTaken = db.users.some(user=> user.email.toLowerCase()=== args.data.email.toLowerCase());
        if(emailTaken){
            throw new Error("Email taken");
        }
        const user = {
            id: uuidv4(),
            ...args.data
        };

        db.users.push(user);
        return user; 
    },
    deleteUser(parent, args, { db }, info){
        const userIndex = db.users.findIndex(user => user.id === args.id);

        if(userIndex === -1){
            throw new Error("User not found");
        }
        
        // remove the user
        const deletedUser = db.users.splice(userIndex,1);

        // remove posts by the user
        posts = db.posts.filter(post=> {
            const match = post.author === args.id;

            // remove all comment for the post
            if(match){
                db.comments = db.comments.filter(comment => comment.post !== post.id);
            }

            return !match;
        });

        // remove matching comments
        db.comments = db.comments.filter(comment => comment.author !== args.id);

        return deletedUser[0]; 
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