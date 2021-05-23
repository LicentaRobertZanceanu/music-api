import {GenresModel} from '../../models/index.js'

export const getGenresById = async(req,res) => {
    GenresModel.findOne({_id:req.params.id}, (err,doc) => {
        if(err) {
            res.status(400).json({message:'Error'})
            return
        }
        res.json(doc)
        return
    })
    return
}