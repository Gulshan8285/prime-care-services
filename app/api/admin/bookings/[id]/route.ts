import { NextRequest, NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
const statuses=['PENDING','ASSIGNED','IN_PROGRESS','COMPLETED','CANCELLED'];
const payments=['UNPAID','PAID','REFUNDED'];
const clean=(v:unknown,max=200)=>typeof v==='string'?v.trim().slice(0,max):'';
export async function PATCH(req:NextRequest,{params}:{params:Promise<{id:string}>}){
 if(!await isAdmin())return NextResponse.json({error:'Unauthorized'},{status:401});
 try{const {id}=await params;const body=await req.json();const data:Prisma.BookingUpdateInput={};
 if(body.status!==undefined){if(!statuses.includes(body.status))return NextResponse.json({error:'Invalid status'},{status:400});data.status=body.status;}
 if(body.paymentStatus!==undefined){if(!payments.includes(body.paymentStatus))return NextResponse.json({error:'Invalid payment status'},{status:400});data.paymentStatus=body.paymentStatus;}
 if(body.assignedTech!==undefined)data.assignedTech=clean(body.assignedTech,100)||null;
 if(body.technicianPhone!==undefined)data.technicianPhone=clean(body.technicianPhone,18)||null;
 if(body.notes!==undefined)data.notes=clean(body.notes,1000)||null;
 if(body.serviceCharge!==undefined){const charge=body.serviceCharge===''||body.serviceCharge===null?null:Number(body.serviceCharge);if(charge!==null&&(!Number.isInteger(charge)||charge<0||charge>1000000))return NextResponse.json({error:'Invalid service charge'},{status:400});data.serviceCharge=charge;}
 if(!Object.keys(data).length)return NextResponse.json({error:'No valid fields provided'},{status:400});
 const booking=await prisma.booking.update({where:{id},data});return NextResponse.json({ok:true,booking:{id:booking.id,bookingCode:booking.bookingCode,status:booking.status}});
 }catch(e){console.error('Booking update failed',e);return NextResponse.json({error:'Could not update booking.'},{status:500});}
}
