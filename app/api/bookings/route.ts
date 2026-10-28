import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { makeBookingCode } from '@/lib/booking';
export const runtime = 'nodejs';
const clean=(v:unknown,max=500)=>typeof v==='string'?v.trim().slice(0,max):'';
export async function POST(req:NextRequest){
 try {
  const body=await req.json();
  if(clean(body.website,200)) return NextResponse.json({error:'Invalid submission.'},{status:400});
  const customerName=clean(body.customerName,80), phone=clean(body.phone,18), address=clean(body.address,400), service=clean(body.service,80), issue=clean(body.issue,1000);
  if(customerName.length<2||!/^[0-9+() -]{8,18}$/.test(phone)||address.length<8||issue.length<5||!['AC Repair & Service','Refrigerator Repair','Electrical Services'].includes(service)) return NextResponse.json({error:'Please check the required fields and try again.'},{status:400});
  let bookingCode='';
  for(let i=0;i<5;i++){const candidate=makeBookingCode();const exists=await prisma.booking.findUnique({where:{bookingCode:candidate},select:{id:true}});if(!exists){bookingCode=candidate;break;}}
  if(!bookingCode) return NextResponse.json({error:'Please try submitting again.'},{status:500});
  const booking=await prisma.booking.create({data:{bookingCode,customerName,phone,address,service,issue,appliance:clean(body.appliance,80)||null,sector:clean(body.sector,100)||null,landmark:clean(body.landmark,100)||null,preferredDate:clean(body.preferredDate,20)||null,preferredTime:clean(body.preferredTime,40)||null}});
  return NextResponse.json({bookingCode:booking.bookingCode},{status:201});
 } catch(e){console.error('Booking create failed',e);return NextResponse.json({error:'Booking service is temporarily unavailable. Please contact us on WhatsApp.'},{status:500});}
}
