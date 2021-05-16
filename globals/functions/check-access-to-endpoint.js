export const checkAccessToEndpoint = (req, res, next) => {
    const accessCode = req.headers.accesscode
    if (accessCode === 'licenta-rzi-2021-abcd') {
        next()
    } else {
        res.status(401).json({ message: `You can't call the route!` })
    }
}