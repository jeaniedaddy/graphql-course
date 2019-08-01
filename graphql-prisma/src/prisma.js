import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from './resolvers/index'


const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://192.168.99.100:4466/',
    secret: 'thisismysecretword',
    fragmentReplacements
})

export { prisma as default }

// prisma.exists.User({id: "cjxksrd8u001107770nl4bunp"}).then((exists)=>{
//     console.log(exists)   
// })


// const createPostForUser = async (userId, data)=> {
//     const userExists = await prisma.exists.User({id: userId})

//     if(!userExists){
//         throw new Error("User not found")
//     }

//     const post =  await prisma.mutation.createPost({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: userId
//                 }
//             }
//         }
//     },'{ id title body published author { id name email posts { id title published } }}')

//     return post.author
// }

// createPostForUser("dddddd", {
//     title: "want to see john wick",
//     body: "john wick",
//     published: false
// }).then((data)=>{
//     console.log(data)
// }).catch((error)=>{
//     console.log("....." + error.message)
// })

// const updatePostForUser= async (postId, data) => {
//     const postExists = await prisma.exists.Post({id: postId})
//     if(!postExists){
//         throw new Error("Post not found")
//     }

//     const post = await prisma.mutation.updatePost({
//         data, 
//         where: {
//             id: postId
//         }
//     },' { id title body published author { id name email posts { id title } } }')
    
//     return post.author
// }

// updatePostForUser("cjxlvfmn2004l0777uigr67q0", {
//     title: "g again again",
//     published: true
// } ).then((data)=>{
//     console.log(JSON.stringify(data, undefined, 2))
// }).catch((error)=>{
//     console.log(error.message)
// })




// prisma.query.users(null, '{ id name posts { id title body } }').then((data)=>{
//     console.log(JSON.stringify(data, undefined, 2))
// })

// prisma.query.comments(null, '{ id text post { title } author { id email } }').then(data=>{
//     console.log(JSON.stringify(data, undefined, 2))
// })
// 
// prisma.query.posts(null, '{ id  title body published author { name }}').then(data=>{
//     console.log(JSON.stringify(data, undefined, 2))
// })


// prisma.mutation.createPost({
//     data: {
//         title: "22222 this is graphql post",
//         body: "GraphQL 202",
//         published: false,
//         author: {
//             connect: {
//                 id: "cjxlw8ai8006u0777ug07hatc"
//             }
//         }
//     }
// }, ' { id title body published author { id name } }').then((data)=>{
//     console.log(data); 
//     return prisma.query.posts(null, ' {id title body published author { name } } ')
// }).then((data)=> {
//     console.log(data); 
// })

// prisma.mutation.updatePost({
//     data: {
//         body: 'GRAPHQL 202',
//         published: true
//     },
//     where: {
//         id: "cjxm51qrt008w077791sjngtv"
//     }
// }, '{ id title body published }').then((data)=>{
//     console.log(data)
//     return prisma.query.posts(null, ' { id title, body, published }')
// }).then((data) => {
//     console.log(data)
// })