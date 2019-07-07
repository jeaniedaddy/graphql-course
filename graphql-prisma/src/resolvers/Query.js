const Query = {
    // comments(parent, args, { db }, info){
    //     if(!args.query){
    //         return db.comments;
    //     }

    //     return db.comments.filter((comment)=> comment.text.toLowerCase().includes(args.query.toLowerCase()));
    // },
    posts(parent, args, { prisma }, info){
        return prisma.query.posts(null, info)
        // if(!args.query){
        //     return db.posts;
        // }

        // return db.posts.filter((post)=>
        //     ( post.title.toLowerCase().includes(args.query.toLowerCase())  
        //         || post.body.toLowerCase().includes(args.query.toLowerCase())
        //     )
        // );
    },
    users(parent, args, { prisma }, info){
        // null(undefined), string, object(info)
        return prisma.query.users(null, info)
        // if(!args.query){
        //     return db.users;
        // }

        // return db.users.filter(user=> user.name.toLowerCase().includes(args.query.toLowerCase())); 
    }
    // me(){
    //     return {
    //         id: '1234OWEB',
    //         name: 'steve no',
    //         email: 'jeaniedaddy@gmail.com',
    //     }
    // },
    // post(){
    //     return {
    //         id: '22222',
    //         title: 'My first Post',
    //         body: 'this is my post test',
    //         published: true
    //     }
    // }
}

export { Query as default }