import OrderModel from "../models/order.model.js";
import { findAll, findOne, update, create, deletee } from "./crud.functions.js";

export const getAll= findAll(OrderModel)
export const getOne = findOne(OrderModel)
export const createOne = create(OrderModel)
export const updateOne = update(OrderModel)
export const deleteOne = deletee(OrderModel)
