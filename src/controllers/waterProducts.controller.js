import WaterProductModel from "../models/waterProducts.model.js";
import { findAll, findOne, update, create, deletee } from "./crud.functions.js";

export const getAll= findAll(WaterProductModel)
export const getOne = findOne(WaterProductModel)
export const createOne = create(WaterProductModel)
export const updateOne = update(WaterProductModel)
export const deleteOne = deletee(WaterProductModel)