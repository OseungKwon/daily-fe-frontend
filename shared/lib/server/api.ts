import axios from 'axios';
import { getServerSession } from 'next-auth';
import { authRepository } from '@/entities/auth/repositories/auth.repository';
import { createNextAuthOptions } from '@/features/auth/usecases/next-auth.usecase';

export const serverApi = axios.create({
	baseURL: process.env.API_HOST,
	withCredentials: true,
});

serverApi.interceptors.request.use(async (config) => {
	if (!config.url?.startsWith('/auth')) {
		const session = await getServerSession(createNextAuthOptions(authRepository));
		if (session?.accessToken) {
			config.headers.Authorization = `Bearer ${session.accessToken}`;
		}
	}
	return config;
});

export default serverApi;
