// Scalar types:  String, Boolean, Int, Float, ID
// Demo user data

const comments = [{
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

const db = { users, posts, comments }
export { db as default }