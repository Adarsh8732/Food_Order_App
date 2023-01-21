import mongoose, { Schema, Document, Model } from "mongoose";

interface vendorDoc extends Document {
  name: string;
  ownerName: string;
  foodTypes: [string];
  pinCode: string;
  address: string;
  phone: string;
  email: string;
  password: string;
  salt: string;
  serviceAvailable: boolean;
  coverImages: [string];
  ratings: number;
  foods: any;
}

const vendorSchema = new Schema(
  {
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodTypes: { type: [String] },
    pinCode: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean },
    coverImages: { type: [String] },
    ratings: { type: Number },
    foods: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "food",
      },
    ],
  },
  {
    toJSON:{
        transform(doc,ret){
            delete ret.password,
            delete ret.salt,
            delete ret.__v,
            delete ret.createAt,
            delete ret.updatedAt
        }
    },
    timestamps: true,
  }
);


const Vendor = mongoose.model<vendorDoc>('vendor',vendorSchema);

export {Vendor};
