import AddressModel from "../models/address.model.js";
import { findAll, findOne, update, create, deletee } from "./crud.functions.js";

export const getAll= findAll(AddressModel)
export const getOne = findOne(AddressModel)
export const createOne = create(AddressModel)
export const updateOne = update(AddressModel)
export const deleteOne = deletee(AddressModel)