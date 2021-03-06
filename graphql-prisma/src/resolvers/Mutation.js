import bcrypt from 'bcryptjs'
import getUserId from '../utils/getUserId'
import generateToken from '../utils/generateToken'
import hashPassword from '../utils/hashPassword'

const Mutation = {
    async login(parent, args, { prisma }, info){
        const user = await prisma.query.user({where:{email: args.data.email}})
        if(!user){
            throw new Error("unable to find the user")
        }

        const isMatch = await bcrypt.compare(args.data.password, user.password)

        if(!isMatch){
            throw new Error("unable to login")
        }

        return {
            token: generateToken(user.id),
            user
        }
    },
    async createUser(parent, args, { prisma }, info){
        const password = await hashPassword(args.data.password) 

        const emailTaken = await prisma.exists.User({email: args.data.email})
        if(emailTaken){
            throw new Error("Email taken")
        }

        const user = await prisma.mutation.createUser({
            data: {...args.data, password}
        })

        const token =  generateToken(user.id)

        return {
            token,
            user
        }
    },
    async deleteUser(parent, args, { prisma, request }, info){
        const id = getUserId(request) 
        const userExists = await prisma.exists.User({id})
        if(!userExists){
            throw new Error("User not found")
        }
        return prisma.mutation.deleteUser({ 
            where: {
                id
            }
        }, info)
    },
    async updateUser(parent, args, { prisma, request }, info){
        const id = getUserId(request) 

        if(typeof args.data.password === 'string'){
            args.data.password =  await hashPassword(args.data.password)
        }

        return prisma.mutation.updateUser({
            where: { 
                id
            },
            data: args.data
        },info)
    },
    createPost(parent, args, { prisma, request }, info){
        return prisma.mutation.createPost({
            data: {
                title: args.data.title,
                body: args.data.body,
                published: args.data.published,
                author: {
                    connect: {
                        id: getUserId(request) 
                    }
                }
            }
        },info)
    },
    async deletePost(parent, args, { prisma, request }, info){
        const userid = getUserId(request) 
        const postexist = await prisma.exists.Post({
                author: {
                       id:  userid
                },
                id: args.id
        })

        if(!postexist){
            throw new error("cannot delete the post")
        }

        return prisma.mutation.deletePost({
            where: {
                id: args.id
            }
        }, info)
    },
    async updatePost(parent, args, { prisma,request }, info){
        const userId = getUserId(request) 
        const postExist = await prisma.exists.Post({
                author: {
                       id:  userId
                },
                id: args.id
        })

        if(!postExist){
            throw new Error("Cannot update the post")
        }

        const isPublished = await prisma.exists.Post({
            id: args.id,
            published: true
        })

        if(isPublished && args.data.published === false){
            await prisma.mutation.deleteManyComments({
                where: {
                    post: {
                        id: args.id
                    }
                }
            })
        }

        return prisma.mutation.updatePost({
            where: {
                id: args.id
            },
            data: args.data 
        },info)
    },
    async createComment(parent, args, { prisma, request}, info){
        const userId = getUserId(request) 
        const postExists = await prisma.exists.Post({
            id: args.data.post,
            published: true
        })

        if(!postExists){
            throw new Error("Unable to find the post")
        }

        return prisma.mutation.createComment({
            data: {
                text: args.data.text,
                author: {
                    connect: {
                        id: userId
                    }
                },
                post: {
                    connect: {
                        id: args.data.post
                    }
                }
            }
        },info)
    },
    async deleteComment(parent, args, { prisma, request }, info) {
        const userId = getUserId(request) 
        const commentExist = await prisma.exists.Comment({
                author: {
                       id:  userId
                },
                id: args.id
        })

        if(!commentExist){
            throw new Error("Cannot delete the comment")
        }
        return prisma.mutation.deleteComment({
            where: {
                id: args.id
            }
        }, info)
    },
    async updateComment(parent, args, { prisma, request }, info){
        const userId = getUserId(request) 
        const commentExist = await prisma.exists.Comment({
                author: {
                       id:  userId
                },
                id: args.id
        })

        if(!commentExist){
            throw new Error("Cannot update the comment")
        }
        return prisma.mutation.updateComment({
            where: {
                id: args.id
            },
            data: args.data
        },info)
    }
}

export { Mutation as default }