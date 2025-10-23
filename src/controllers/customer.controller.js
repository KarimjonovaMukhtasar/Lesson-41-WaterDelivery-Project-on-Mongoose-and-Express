import CustomerModel from "../models/customer.model.js";
import { findAll, findOne, update, create, deletee } from "./crud.functions.js";

export const getAll= findAll(CustomerModel)
export const getOne = findOne(CustomerModel)
export const createOne = create(CustomerModel)
export const updateOne = update(CustomerModel)
export const deleteOne = deletee(CustomerModel)
