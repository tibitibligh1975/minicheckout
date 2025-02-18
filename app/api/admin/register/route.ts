import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

const ADMIN_CODE = process.env.ADMIN_REGISTRATION_CODE;

export async function POST(req: Request) {
  try {
    const { name, email, password, adminCode } = await req.json();

    if (adminCode !== ADMIN_CODE) {
      return NextResponse.json(
        { error: "Código de admin inválido" },
        { status: 401 }
      );
    }

    await dbConnect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin"
    });

    return NextResponse.json(
      { message: "Admin registrado com sucesso" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao registrar admin" },
      { status: 500 }
    );
  }
} 