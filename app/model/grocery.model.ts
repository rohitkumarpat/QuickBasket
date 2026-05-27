import mongoose from "mongoose";

interface IGrocery {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: number;
  image: string;
  description?: string;
  unit: string;
  category?: string;
  createdAt?: Date;
  updatedAt?: Date;

}

const grocerySchema = new mongoose.Schema<IGrocery>(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    description: { type: String },
    unit: { type: String, required: true },
    category: { type: String,
        enum: ["fruits", "vegetables", "dairy", "bakery", "meat", "beverages", "snacks","household", "personal care", "Baby products", "pet supplies", "drinks", "frozen foods", "canned goods", "condiments", "grains", "international foods", "organic products", "health foods", "cleaning supplies", "paper products", "other"],
        required:true
     },
    },
    { timestamps: true }
);

const Grocery =
  mongoose.models.Grocery || mongoose.model<IGrocery>("Grocery", grocerySchema);
  
  export default Grocery;