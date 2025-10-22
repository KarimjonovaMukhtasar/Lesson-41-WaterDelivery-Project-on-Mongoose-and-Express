import AddressModel from "../models/address.model.js";

const getAll = async (req, res, next, error)=>{
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const search = req.query.search || ""
    const skip = (page - 1) * limit

    const fields = Object.keys(AddressModel.schema.paths).filter((f)=> !["_id", "__v", "createdAt", "updatedAt"].includes(f));
    
    const query = filter 
    ? {
        $or: fields.map((field)=> ({
          [field]: { $regex: filter, $options:"i"}
    }))
    }
    : {}
    const [data, total] = await Promise.all([
        AddressModel.find(query).skip(skip).limit(limit)).sort({createdAt:-1}),
        AddressModel.countDocuments(query),
}