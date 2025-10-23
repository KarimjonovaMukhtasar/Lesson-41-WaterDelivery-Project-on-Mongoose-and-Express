import DistrictModel from "../models/district.model.js";
import { findAll, findOne, update, create, deletee } from "./crud.functions.js";

export const getAll= findAll(DistrictModel)
export const getOne = findOne(DistrictModel)
export const createOne = create(DistrictModel)
export const updateOne = update(DistrictModel)
export const deleteOne = deletee(DistrictModel)
