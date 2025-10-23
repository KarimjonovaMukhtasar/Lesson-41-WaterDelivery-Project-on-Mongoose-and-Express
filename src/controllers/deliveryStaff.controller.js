import DeliveryStaffModel from "../models/deliveryStaff.model.js";
import { findAll, findOne, update, create, deletee } from "./crud.functions.js";

export const getAll= findAll(DeliveryStaffModel)
export const getOne = findOne(DeliveryStaffModel)
export const createOne = create(DeliveryStaffModel)
export const updateOne = update(DeliveryStaffModel)
export const deleteOne = deletee(DeliveryStaffModel)
