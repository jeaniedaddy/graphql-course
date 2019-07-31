import jwt from "jsonwebtoken"

const getUserId = (request, requiredAuth = true) => {
    const headers = request.request.headers

    if(headers.authorization){
        const token = headers.authorization.replace("Bearer ","")
        const { userId } = jwt.verify(token,"mysecretword")
        return userId  
    }

    if(requiredAuth){
        throw new Error("unable to authenticate")
    }

    return null

}

export { getUserId as default }