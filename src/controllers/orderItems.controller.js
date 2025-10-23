import OrderItemModel from "../models/orderItem.model.js";
import { findAll, findOne, update, create, deletee } from "./crud.functions.js";

export const getAll= findAll(OrderItemModel)
export const getOne = findOne(OrderItemModel)
export const createOne = create(OrderItemModel)
export const updateOne = update(OrderItemModel)
export const deleteOne = deletee(OrderItemModel)
