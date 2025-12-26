import { redirect } from 'next/navigation';

export default function NotFound() {
  // Redirect any 404 pages to home
  redirect('/');
}

