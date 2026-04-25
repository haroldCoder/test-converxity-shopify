export class AffiliateNotFoundException extends Error {
    constructor(id: string) {
        super(`Affiliate with ID ${id} not found`);
        this.name = "AffiliateNotFoundException";
    }
}
