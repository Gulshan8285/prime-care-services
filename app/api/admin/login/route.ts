import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { createAdminSession } from '@/lib/auth';
function safeEqual(a:string,b:string){const aa=Buffer.from(a);const bb=Buffer.from(b);return aa.length===bb.length&&timingSafeEqual(aa,bb);}
export async function POST(req:NextRequest){try{const body=await req.json();const email=String(body.email||'');const password=String(body.password||'');const expectedEmail=process.env.ADMIN_EMAIL||'';const expectedPassword=process.env.ADMIN_PASSWORD||'';if(!expectedEmail||!expectedPassword||expectedPassword==='change-this-before-deploying'||!safeEqual(email.toLowerCase(),expectedEmail.toLowerCase())||!safeEqual(password,expectedPassword))return NextResponse.json({error:'Email or password is incorrect.'},{status:401});await createAdminSession();return NextResponse.json({ok:true});}catch{return NextResponse.json({error:'Unable to sign in.'},{status:500});}}
