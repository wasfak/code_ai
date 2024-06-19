"use server";

import { revalidatePath } from "next/cache";

import { handleError } from "../utils";
import prisma from "../db/prisma";
import { Prisma, User } from "@prisma/client";
type CreateUserInput = {
  clerkId: string;
  email: string;
  username: string;
  photo: string;
  firstName?: string;
  lastName?: string;
};
// CREATE
export async function createUser(user: CreateUserInput) {
  try {
    // Check if a user already exists with the given email
    const existingUser = await prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });

    if (existingUser) {
      // User already exists, handle accordingly
      // For example, you can return a message or throw an error
      throw new Error("A user with this email already exists.");
    }

    // If no user exists, create a new user
    const newUser = await prisma.user.create({ data: user });

    // Optionally, return the new user after stripping Prisma metadata
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.log(error);

    handleError(error);
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        clerkId: userId,
      },
    });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        clerkId: clerkId,
      },
      data: user,
    });
    if (!updatedUser) throw new Error("User update failed");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    // Find user to delete
    const userToDelete = await prisma.user.findUnique({
      where: {
        clerkId: clerkId,
      },
    });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await prisma.user.delete({
      where: {
        clerkId: clerkId,
      },
    });
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

/* // USE CREDITS
export async function updateCredits(userId: string, creditFee: number) {
  try {
    const updatedUserCredits = await User.findOneAndUpdate(
      { _id: userId },
      { $inc: { creditBalance: creditFee } },
      { new: true },
    );

    if (!updatedUserCredits) throw new Error("User credits update failed");

    return JSON.parse(JSON.stringify(updatedUserCredits));
  } catch (error) {
    handleError(error);
  }
}
 */

export async function deductDurationFromUserLimit(
  userId: string,
  audioDurationMinutes: number,
) {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      console.log("User not found");
      return { success: false, message: "User not found" };
    }

    if (user.remainingDuration! < audioDurationMinutes) {
      console.log("Insufficient remaining duration");
      return { success: false, message: "Insufficient remaining duration" };
    }

    const updatedUser = await prisma.user.update({
      where: { clerkId: userId },
      data: {
        remainingDuration: user.remainingDuration! - audioDurationMinutes,
      },
    });

    return { success: true, userData: JSON.parse(JSON.stringify(updatedUser)) };
  } catch (error) {
    console.error("Error in deductDurationFromUserLimit:", error);
    // Depending on how you want to handle errors, you might want to
    // return an error state instead of throwing, to keep the return type consistent
    return { success: false, message: "An error occurred" };
  }
}
