import jwt from "jsonwebtoken"

const getUserId = (request, requiredAuth = true) => {
    const header = request.request ? request.request.headers.authorization : request.connection.context.Authorization 

    if(header){
        const token = header.replace("Bearer ","")
        const { userId } = jwt.verify(token,"mysecretword")

        return userId  
    }

    if(requiredAuth){
        throw new Error("unable to authenticate")
    }

    return null
}

export { getUserId as default }