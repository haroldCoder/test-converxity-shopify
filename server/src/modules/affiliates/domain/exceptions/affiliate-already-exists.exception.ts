export class AffiliateAlreadyExistsException extends Error {
    constructor(code: string) {
        super(`Affiliate with code ${code} already exists for this shop`);
        this.name = "AffiliateAlreadyExistsException";
    }
}
