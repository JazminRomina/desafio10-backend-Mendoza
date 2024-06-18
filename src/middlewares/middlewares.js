import DTOuser from "../DTO/user.dto.js"

export const rolAuthenticationAdmin = async(req, res, next) => {
    const DTOusers = new DTOuser(req.session.user)
    if(DTOusers.rol == "Admin"){
        return next()
    }
    return res.redirect("profile")
}

export const rolAuthenticationUser = async(req, res, next) => {
    const DTOusers = new DTOuser(req.session.user)
    if(DTOusers.rol == "User"){
        return next()
    }
    return res.redirect("profile")
}