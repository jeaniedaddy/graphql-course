import getUserId from '../utils/getUserId'

const Query = {
    comments(parent, args, { db, prisma }, info){
        const opArgs = {}
        if(args.query){
            opArgs.where = {
                OR: [{
                    text_contains: args.query
                }]
            }
        }
        return prisma.query.comments(opArgs, info)
    },
    myposts(parent, args, { prisma, request }, info){
        const userId = getUserId(request)
        const opArgs = {
            where: {
                author: {
                    id: userId
                }
            }
        }

        if(args.query){
            opArgs.where.OR = [{
                    title_contains: args.query
                },{
                    body_contains: args.query
                }]
        }
        return prisma.query.posts(opArgs, info)
    },
    posts(parent, args, { prisma, request }, info){
        const opArgs = {
            where: {
                published: true
            }
        }

        if(args.query){
            opArgs.where.OR = [{
                    title_contains: args.query
                },{
                    body_contains: args.query
                }]
        }
        return prisma.query.posts(opArgs, info)
    },
    users(parent, args, { prisma }, info){
        // null(undefined), string, object(info)
        const opArgs = {}
        if(args.query){
            opArgs.where = {
                OR: [{
                    name_contains: args.query
                },{
                    email_contains: args.query
                }]
            }
        }
        return prisma.query.users(opArgs, info)
    },
    async me(parent, args, {prisma, request}, info){
        const userId = getUserId(request)
        const users = await prisma.query.users({
            where: {
                id: userId
            }
        }, info)

        if(users.length === 0){
            return new Error("Unable to find the user")
        }

        return users[0]
    },
    async post(parent, args, { prisma, request }, info){
        const userId = getUserId(request, false)

        const posts =  await prisma.query.posts({
            where: {
                id: args.id,
                OR: [{
                   published:true 
                },{
                   author:  {
                       id: userId
                   }
                }]
            }
        }, info)

        if(posts.length === 0){
            return new Error("Unable to find the post")
        }

        return posts[0]
    }
}

export { Query as default }