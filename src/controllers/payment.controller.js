import PaymentModel from "../models/payment.model.js";
import { findAll, findOne, update, create, deletee } from "./crud.functions.js";

export const getAll= findAll(PaymentModel)
export const getOne = findOne(PaymentModel)
export const createOne = create(PaymentModel)
export const updateOne = update(PaymentModel)
export const deleteOne = deletee(PaymentModel)
