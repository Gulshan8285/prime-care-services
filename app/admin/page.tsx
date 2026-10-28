import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import AdminDashboard from './dashboard';
export const dynamic='force-dynamic';
export default async function AdminPage(){if(!await isAdmin())redirect('/admin/login');const bookings=await prisma.booking.findMany({orderBy:{createdAt:'desc'},take:500});const serial=bookings.map(b=>({...b,createdAt:b.createdAt.toISOString(),updatedAt:b.updatedAt.toISOString()}));return <main className="admin-page"><AdminDashboard initialBookings={serial}/></main>}
