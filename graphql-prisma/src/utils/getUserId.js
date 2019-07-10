import jwt from "jsonwebtoken"

const getUserId = (request) => {
    const headers = request.request.headers
    if(!headers.authorization){
        throw new Error("unable to authenticate")
    }

    const token = headers.authorization.replace("Bearer ","")
    const { userId } = jwt.verify(token,"mysecretword")
    return userId  
}

export { getUserId as default }