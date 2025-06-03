export default class PackageService {
    static API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

    static async getPackages() {
        const response = await fetch(`${this.API_BASE_URL}/packages`);
        if (!response.ok) {
            throw new Error('Failed to fetch packages');
        }
        return response.json()
        ;
    };
}
