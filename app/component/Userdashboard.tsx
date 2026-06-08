import Hersection from './Hersection'
import Categoryslide from './categoryslide'
import connectToDatabase from '../lib/db';
import Grocery from '../model/grocery.model';
import Groceryitem from './Groceryitem';

// 👇 IMPORT THIS
import MotionWrapper from './MotionWrapper';

async function Userdashboard({ query, }: {
  query?: string;
}) {

  await connectToDatabase();

  const groceries = await Grocery.find(
    query
      ? {
        name: {
          $regex: query,
          $options: "i",
        },
      }
      : {}
  ).lean();

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
          <h2 className="text-2xl md:text-3xl font-bold text-green-700 text-center mb-2">
            {query
              ? `Search Results for "${query}"`
              : "Popular Grocery Items"}
          </h2>

          {query && (
            <p className="text-center text-gray-500 mb-6">
              {safeGroceries.length} item(s) found
            </p>
          )}

          <div className="w-[92%] md:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            {safeGroceries.length > 0 ? (
              safeGroceries.map((item: any, index: number) => (
                <Groceryitem key={index} item={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-10">
                <h3 className="text-xl font-semibold text-gray-700">
                  No products found
                </h3>

                <p className="text-gray-500 mt-2">
                  Try searching for another item
                </p>
              </div>
            )}
          </div>
        </div>

      </MotionWrapper>

    </div>
  )
}


export default Userdashboard;