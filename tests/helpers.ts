import * as jwt from 'jsonwebtoken';
import { User } from '@prisma/client';
import { createUser } from './factories/users.factory'; 
import prisma from "../src/database";

export async function cleanDb() {
 await prisma.credential.deleteMany();
 await prisma.user.deleteMany();
}