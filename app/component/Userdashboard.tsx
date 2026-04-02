import Hersection from './Hersection'
import Categoryslide from './categoryslide'
import connectToDatabase from '../lib/db';
import Grocery from '../model/grocery.model';
import Groceryitem from './Groceryitem';

// 👇 IMPORT THIS
import MotionWrapper from './MotionWrapper';

async function Userdashboard() {

  await connectToDatabase();

  const groceries = await Grocery.find().lean();

  const safeGroceries = groceries.map((item: any) => ({
    ...item,
    _id: item._id.toString(),
    createdAt: item.createdAt?.toString(),
    updatedAt: item.updatedAt?.toString(),
  }));

  return (
    <div>
      <Hersection />
      <Categoryslide />

    
      <MotionWrapper>

        <div className="w-full bg-white py-10">
          <h2 className="text-2xl md:text-3xl font-bold text-green-700 text-center mb-8">
            Popular Grocery Items
          </h2>

          <div className="w-[92%] md:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            {safeGroceries.map((item: any, index: number) => (
              <Groceryitem key={index} item={item} />
            ))}

          </div>
        </div>

      </MotionWrapper>

    </div>
  )
}

export default Userdashboard;