
import { NextRequest, NextResponse } from "next/server";

// Mock interested workers data
const mockInterests = [
  {
    id: "w1",
    name: "Emeka Okafor",
    initials: "EO",
    city: "Lagos",
    role: "Freelancer",
    rating: 4.9,
    completed: 47,
    rate: "₦15,000/hr",
    bio: "Full-stack developer with 5 years experience. Specialize in React, Next.js, and Node.js.",
    status: "interested",
  },
  {
    id: "w2",
    name: "Amina Kenyatta",
    initials: "AK",
    city: "Accra",
    role: "Service Provider",
    rating: 4.7,
    completed: 32,
    rate: "₦12,000/hr",
    bio: "Creative designer and branding expert. I make brands stand out.",
    status: "interested",
  },
  {
    id: "w3",
    name: "Kwame Mensah",
    initials: "KM",
    city: "Nairobi",
    role: "Errand Runner",
    rating: 4.8,
    completed: 63,
    rate: "₦8,000/hr",
    bio: "Fast and reliable. I handle deliveries, errands, and logistics across the city.",
    status: "interested",
  },
  {
    id: "w4",
    name: "Fatima Al-Rashid",
    initials: "FA",
    city: "Dubai",
    role: "Freelancer",
    rating: 5.0,
    completed: 21,
    rate: "₦20,000/hr",
    bio: "Social media strategist. I've grown 50+ brand accounts to 100K+ followers.",
    status: "interested",
  },
  {
    id: "w5",
    name: "Chinedu Eze",
    initials: "CE",
    city: "Lagos",
    role: "Errand Runner",
    rating: 4.6,
    completed: 89,
    rate: "₦7,500/hr",
    bio: "I'm your go-to guy for anything. Moving, cleaning, delivery - you name it.",
    status: "interested",
  },
  {
    id: "w6",
    name: "Blessing Okoro",
    initials: "BO",
    city: "Port Harcourt",
    role: "Service Provider",
    rating: 4.9,
    completed: 54,
    rate: "₦10,000/hr",
    bio: "Professional plumber and electrician. 10 years experience in home repairs.",
    status: "interested",
  },
  {
    id: "w7",
    name: "David Osei",
    initials: "DO",
    city: "Accra",
    role: "Freelancer",
    rating: 4.5,
    completed: 18,
    rate: "₦18,000/hr",
    bio: "Mobile app developer. Flutter, React Native, and Kotlin expert.",
    status: "interested",
  },
  {
    id: "w8",
    name: "Zainab Mohammed",
    initials: "ZM",
    city: "Abuja",
    role: "Real Estate Agent",
    rating: 4.8,
    completed: 29,
    rate: "₦25,000/flat",
    bio: "Premium property agent. I find the best homes and deals in Abuja.",
    status: "interested",
  },
];

// GET: Get interested workers for a task
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const taskId = searchParams.get("taskId");

    if (!taskId) {
      return NextResponse.json(
        { error: "taskId is required" },
        { status: 400 }
      );
    }

    // Simulate delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Return mock data with taskId context
    const workers = mockInterests.map((w) => ({
      ...w,
      taskId,
      appliedAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
    }));

    return NextResponse.json({
      success: true,
      taskId,
      workers,
      total: workers.length,
    });
  } catch (error) {
    console.error("Error fetching task interests:", error);
    return NextResponse.json(
      { error: "Failed to fetch interested workers" },
      { status: 500 }
    );
  }
}

// POST: Express interest in a task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { taskId, workerId } = body;

    if (!taskId || !workerId) {
      return NextResponse.json(
        { error: "taskId and workerId are required" },
        { status: 400 }
      );
    }

    // Simulate creating an interest record
    await new Promise((resolve) => setTimeout(resolve, 200));

    return NextResponse.json({
      success: true,
      message: "Interest expressed successfully",
      interest: {
        id: `interest-${Date.now()}`,
        taskId,
        workerId,
        status: "interested",
        appliedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error creating task interest:", error);
    return NextResponse.json(
      { error: "Failed to express interest" },
      { status: 500 }
    );
  }
}

// PATCH: Accept/reject a worker
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: "id and status are required" },
        { status: 400 }
      );
    }

    if (!["accepted", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "status must be 'accepted' or 'rejected'" },
        { status: 400 }
      );
    }

    // Simulate updating the interest
    await new Promise((resolve) => setTimeout(resolve, 200));

    const worker = mockInterests.find((w) => w.id === id);

    return NextResponse.json({
      success: true,
      message: `Worker ${status} successfully`,
      interest: {
        id,
        status,
        updatedAt: new Date().toISOString(),
        worker: worker ? { name: worker.name, initials: worker.initials } : null,
      },
    });
  } catch (error) {
    console.error("Error updating task interest:", error);
    return NextResponse.json(
      { error: "Failed to update interest" },
      { status: 500 }
    );
  }
}
