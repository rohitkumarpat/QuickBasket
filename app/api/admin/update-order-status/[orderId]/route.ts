import connectToDatabase from "@/app/lib/db";
import emiteventhandler from "@/app/lib/emiteventhandler";
import DeliveryAssignment from "@/app/model/deliveryassignment";
import Order from "@/app/model/order.model";
import User from "@/app/model/user.model";
import { NextRequest, NextResponse } from "next/server";

const VALID_ORDER_STATUSES = [
  "pending",
  "out-for-delivery",
  "delivered",
  "cancelled",
] as const;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectToDatabase();

    const { orderId } = await params;

    const { status } = await req.json();

    const isValidStatus =
      VALID_ORDER_STATUSES.includes(status);

    if (!isValidStatus) {
      return NextResponse.json(
        { message: "Invalid order status" },
        { status: 400 }
      );
    }

    const order = await Order.findById(orderId)
      .populate("userId");

    if (!order) {
      return NextResponse.json(
        { message: "Order not found" },
        { status: 404 }
      );
    }


    order.status = status;

    let DeliveryBoyspayload: any[] = [];

    if (status === "out-for-delivery" && order.assignment === null) {
      const { latitude, longitude } = order.address;

      const nearbyDeliveryBoys = await User.find({
        role: "deliveryboy",
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: [longitude, latitude],
            },
            $maxDistance: 5000,
          },
        },
      });

      const nearbyIds = nearbyDeliveryBoys.map((b) => b._id);

      // find busy delivery boys
      const busyIds = await DeliveryAssignment.find({
        assigneid: { $in: nearbyIds },
        status: {
          $nin: ["broadcast", "completed"],
        },
      }).distinct("assigneid");

      // convert busy ids into set
      const busyIdsSet = new Set(busyIds.map((id) => String(id)));

      // filter available delivery boys
      const availableDeliveryBoys = nearbyDeliveryBoys.filter(
        (b) => !busyIdsSet.has(String(b._id))
      );

      const candidates = availableDeliveryBoys.map((b) => b._id);


      if (candidates.length === 0) {
        await order.save();

        await emiteventhandler("order-status-updated", { orderId: order._id, status: order.status });
        return NextResponse.json(
          { message: "No delivery boys available nearby", status: order.status },
          { status: 200 }
        );
      }

      const deliveryassignment = await DeliveryAssignment.create({
        orderId: order._id,
        broadcasterId: candidates,
        status: "broadcast",
      });

      await deliveryassignment.populate("orderId");

      console.log("Available boys:", availableDeliveryBoys.length);
        console.log("assignment id:", deliveryassignment._id)

      for (const boyid of candidates) {
        const boy = await User.findById(boyid);
        if (boy.socketid) {
          // Emit event to the delivery boy
          await emiteventhandler(
            "new-delivery-assignment",
            { 
             assignment: deliveryassignment._id,
              orderId: deliveryassignment.orderId,
            },
            boy.socketid
          );
        }
      }

      order.assignment = deliveryassignment._id;

      DeliveryBoyspayload = availableDeliveryBoys.map((b) => ({
        id: b._id,
        name: b.name,
        mobile: b.mobile,
        latitude: b.location.coordinates[1],
        longitude: b.location.coordinates[0],
      }));

      await deliveryassignment.populate("orderId");
    }

    await order.save();
    await emiteventhandler("order-status-updated", { orderId: order._id, status: order.status });

    return NextResponse.json(
      {
        assignment: order.assignment,
        status: order.status,
        deliveryboys: DeliveryBoyspayload,
      },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error updating order status:", error);

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
