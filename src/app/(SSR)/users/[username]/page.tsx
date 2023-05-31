import { UnsplashUser } from '@/models/unsplash-user';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { cache } from 'react';
import { Alert } from '@/components/bootstrap';

interface usernamePageProps {
	params: { username: string };
}

async function getUser(username: string): Promise<UnsplashUser> {
	// This function, even is used twice in this code, NextJS can handle this and deduplicate the fetch when is used native fetch, not other libraries like axios. If that the case you have to manage this manually.
	const response = await fetch(
		`https://api.unsplash.com/users/${username}?&client_id=${process.env.UNSPLASH_ACCESS_KEY}`
	);

	if (response.status === 404) notFound();

	return await response.json();
}

// const getUserCached = cache(getUser); -> In case you don't use the native fetch, use this function to deduplicate the API calls.

export async function generateMetadata({
	params: { username },
}: usernamePageProps): Promise<Metadata> {
	const user = await getUser(username);

	return {
		title:
			([user.first_name, user.last_name].filter(Boolean).join(' ') ||
				user.username) + ' - NextJS 13.4 Image Gallery',
	};
}

export default async function usernamePage({
	params: { username },
}: usernamePageProps) {
	const user = await getUser(username);

	return (
		<div>
			<Alert>
				This profile page uses <strong>generateMetadata</strong> to set
				the <strong>page title</strong> dynamically from the API
				response.
			</Alert>

			<h1>{user.username}</h1>
			<p>First name: {user.first_name}</p>
			<p>Last name: {user.last_name}</p>
			<a href={`https://unsplash.com/${user.username}`}>
				Unsplash profile
			</a>
		</div>
	);
}
