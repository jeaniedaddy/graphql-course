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
    posts(parent, args, { prisma }, info){
        const opArgs = {}
        if(args.query){
            opArgs.where = {
                OR: [{
                    title_contains: args.query
                },{
                    body_contains: args.query
                }]
            }
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

export { Query as default }