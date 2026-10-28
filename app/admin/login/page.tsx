import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth';
import LoginForm from './login-form';
export default async function AdminLogin(){if(await isAdmin())redirect('/admin');return <main className="admin-page"><LoginForm/></main>}
