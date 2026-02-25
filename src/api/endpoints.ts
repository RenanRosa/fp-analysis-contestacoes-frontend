import api from './client';

export interface TokenResponse {
    access_token: string;
    user_name: string;
    company_name: string;
    role: string;
}

export const authApi = {
    register: (data: { company_name: string; user_name: string; email: string; password: string }) =>
        api.post<TokenResponse>('/auth/register', data),
    login: (data: { email: string; password: string }) =>
        api.post<TokenResponse>('/auth/login', data),
    me: () => api.get('/auth/me'),
};

export const petitionsApi = {
    upload: (formData: FormData) =>
        api.post('/petitions/', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),
    list: (skip = 0, limit = 20) =>
        api.get('/petitions/', { params: { skip, limit } }),
    get: (id: number) => api.get(`/petitions/${id}`),
    delete: (id: number) => api.delete(`/petitions/${id}`),
};

export const contestationsApi = {
    generate: (petitionId: number) =>
        api.post(`/contestations/generate/${petitionId}`),
    list: (skip = 0, limit = 20) =>
        api.get('/contestations/', { params: { skip, limit } }),
    get: (id: number) => api.get(`/contestations/${id}`),
    download: async (id: number, filename = `contestacao_${id}.docx`) => {
        const res = await api.get(`/contestations/${id}/download`, {
            responseType: 'blob',
        });
        const url = URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    },
    downloadReport: async (id: number, filename = `relatorio_estrategico_${id}.docx`) => {
        const res = await api.get(`/contestations/${id}/download-report`, {
            responseType: 'blob',
        });
        const url = URL.createObjectURL(new Blob([res.data]));
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    },
};

export interface PCADatapoint {
    id: number;
    title: string;
    lawyer_name: string;
    x: number;
    y: number;
}

export const dashboardApi = {
    metrics: () => api.get('/dashboard/metrics'),
    lawyerStats: () => api.get('/dashboard/lawyer-stats'),
    pca: () => api.get<PCADatapoint[]>('/dashboard/pca'),
};

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}

export const chatApi = {
    sendMessage: (message: string, history: ChatMessage[]) =>
        api.post<{ reply: string }>('/chat/', { message, history }),
    sendContestationMessage: (contestationId: number, message: string, history: ChatMessage[]) =>
        api.post<{ reply: string }>('/chat/contestation', {
            contestation_id: contestationId,
            message,
            history,
        }),
};
