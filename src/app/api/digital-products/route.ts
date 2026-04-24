
import { NextRequest, NextResponse } from "next/server";

import { type DigitalProduct } from "@/lib/digital-product";

// Mock digital products
const mockDigitalProducts: DigitalProduct[] = [
  {
    id: "dp1",
    title: "Complete Business Plan Template Pack",
    description: "Professional business plan templates for Nigerian startups. Includes financial projections, market analysis, and investor pitch deck templates. Over 50 pages of ready-to-use content.",
    price: 5000,
    currency: "NGN",
    sellerId: "seller1",
    sellerName: "BizTools NG",
    fileUrl: "/files/business-plan-pack.zip",
    fileType: "zip",
    fileSize: "12.4 MB",
    downloads: 234,
    rating: 4.8,
    preview: "Includes 5 templates: Tech Startup, Restaurant, Retail, Service, and General Business",
    createdAt: "2026-01-15",
  },
  {
    id: "dp2",
    title: "Nigerian CV & Resume Templates",
    description: "15 professionally designed CV templates optimized for the Nigerian job market. ATS-friendly formats in Word and PDF. Includes cover letter templates and interview guide.",
    price: 2500,
    currency: "NGN",
    sellerId: "seller2",
    sellerName: "CareerPro",
    fileUrl: "/files/cv-templates.zip",
    fileType: "zip",
    fileSize: "8.2 MB",
    downloads: 512,
    rating: 4.6,
    preview: "Word (.docx) and PDF formats, ATS-optimized, modern and traditional styles",
    createdAt: "2026-02-01",
  },
  {
    id: "dp3",
    title: "Social Media Marketing Guide 2026",
    description: "Comprehensive guide to growing your business on Nigerian social media. Covers Instagram, Twitter, Facebook, TikTok strategies with case studies from Nigerian brands.",
    price: 3500,
    currency: "NGN",
    sellerId: "seller3",
    sellerName: "DigitalMarketing Hub",
    fileUrl: "/files/social-media-guide.pdf",
    fileType: "pdf",
    fileSize: "15.7 MB",
    downloads: 189,
    rating: 4.9,
    preview: "120+ pages, 10 Nigerian brand case studies, content calendar templates",
    createdAt: "2026-03-10",
  },
  {
    id: "dp4",
    title: "Excel & Data Analysis Masterclass",
    description: "Video course + exercise files for mastering Excel. Covers pivot tables, VLOOKUP, charts, macros, and dashboard creation. Perfect for beginners and intermediate users.",
    price: 7500,
    currency: "NGN",
    sellerId: "seller4",
    sellerName: "SkillUp Academy",
    fileUrl: "/files/excel-course.zip",
    fileType: "zip",
    fileSize: "1.2 GB",
    downloads: 328,
    rating: 4.7,
    preview: "25 video lessons, 50 exercise files, 3 practice projects, certificate template",
    createdAt: "2026-01-20",
  },
  {
    id: "dp5",
    title: "Logo Design Starter Kit",
    description: "500+ logo templates, fonts, and design assets. Editable in Canva, Illustrator, and Photoshop. Perfect for small business owners and aspiring designers.",
    price: 4000,
    currency: "NGN",
    sellerId: "seller5",
    sellerName: "DesignVault",
    fileUrl: "/files/logo-kit.zip",
    fileType: "zip",
    fileSize: "450 MB",
    downloads: 456,
    rating: 4.5,
    preview: "500+ logo templates, 100 fonts, color palettes, brand guideline templates",
    createdAt: "2026-02-15",
  },
  {
    id: "dp6",
    title: "JAMB UTME Past Questions (2020-2025)",
    description: "Complete collection of JAMB past questions and answers for all subjects. Organized by year with detailed solutions and performance analytics.",
    price: 1500,
    currency: "NGN",
    sellerId: "seller6",
    sellerName: "EduPrep NG",
    fileUrl: "/files/jamb-past-questions.pdf",
    fileType: "pdf",
    fileSize: "85 MB",
    downloads: 1203,
    rating: 4.8,
    preview: "All subjects, 6 years of questions, detailed solutions, performance tracking",
    createdAt: "2026-03-01",
  },
];

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      products: mockDigitalProducts,
      total: mockDigitalProducts.length,
    });
  } catch (error) {
    console.error("[Digital Products] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch digital products" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, price, currency, fileType } = body;

    if (!title || !price) {
      return NextResponse.json(
        { success: false, error: "Title and price are required" },
        { status: 400 }
      );
    }

    const newProduct: DigitalProduct = {
      id: `dp_${Date.now()}`,
      title,
      description: description || "",
      price: Number(price),
      currency: currency || "NGN",
      sellerId: "current_seller",
      sellerName: "You",
      fileUrl: "/files/new-product.zip",
      fileType: fileType || "zip",
      fileSize: "0 MB",
      downloads: 0,
      rating: 0,
      preview: "",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: "Digital product created successfully",
    });
  } catch (error) {
    console.error("[Digital Products] Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create digital product" },
      { status: 500 }
    );
  }
}
