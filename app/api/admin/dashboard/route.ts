import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Order from "@/app/model/order.model";
import User from "@/app/model/user.model";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);

    const filter =
      searchParams.get("filter") || "today";

    const totalOrders =
      await Order.countDocuments();

    const totalCustomers =
      await User.countDocuments({
        role: "user",
      });

    const pendingDeliveries =
      await Order.countDocuments({
        status: {
          $in: [
            "pending",
            "out-for-delivery",
          ],
        },
      });

    const revenueResult =
      await Order.aggregate([
        {
          $match: {
            status: "delivered",
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: {
              $sum: "$totalamount",
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult[0]?.totalRevenue || 0;

    const today = new Date();

    const startOfToday = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

    const todayRevenueResult =
      await Order.aggregate([
        {
          $match: {
            status: "delivered",
            createdAt: {
              $gte: startOfToday,
            },
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$totalamount",
            },
          },
        },
      ]);

    const todayRevenue =
      todayRevenueResult[0]?.total || 0;

    let chartData: {
      day: string;
      orders: number;
    }[] = [];

    // TODAY
    if (filter === "today") {
      for (let hour = 0; hour < 24; hour++) {
        const start = new Date();

        start.setHours(
          hour,
          0,
          0,
          0
        );

        const end = new Date();

        end.setHours(
          hour,
          59,
          59,
          999
        );

        const count =
          await Order.countDocuments({
            createdAt: {
              $gte: start,
              $lte: end,
            },
          });

        chartData.push({
          day: `${hour}:00`,
          orders: count,
        });
      }
    }

    // LAST 7 DAYS
    else if (filter === "week") {
      for (let i = 6; i >= 0; i--) {
        const dayStart = new Date();

        dayStart.setDate(
          dayStart.getDate() - i
        );

        dayStart.setHours(
          0,
          0,
          0,
          0
        );

        const dayEnd =
          new Date(dayStart);

        dayEnd.setHours(
          23,
          59,
          59,
          999
        );

        const count =
          await Order.countDocuments({
            createdAt: {
              $gte: dayStart,
              $lte: dayEnd,
            },
          });

        chartData.push({
          day:
            dayStart.toLocaleDateString(
              "en-US",
              {
                weekday: "short",
              }
            ),
          orders: count,
        });
      }
    }

    // LAST MONTH (30 DAYS)
    else if (filter === "month") {
      for (let i = 29; i >= 0; i--) {
        const dayStart = new Date();

        dayStart.setDate(
          dayStart.getDate() - i
        );

        dayStart.setHours(
          0,
          0,
          0,
          0
        );

        const dayEnd =
          new Date(dayStart);

        dayEnd.setHours(
          23,
          59,
          59,
          999
        );

        const count =
          await Order.countDocuments({
            createdAt: {
              $gte: dayStart,
              $lte: dayEnd,
            },
          });

        chartData.push({
          day: dayStart
            .getDate()
            .toString(),
          orders: count,
        });
      }
    }

    return NextResponse.json({
      totalOrders,
      totalCustomers,
      pendingDeliveries,
      totalRevenue,
      todayRevenue,
      chartData,
    });
  } catch (error) {
    console.error(
      "Dashboard Error:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to load dashboard",
      },
      {
        status: 500,
      }
    );
  }
}