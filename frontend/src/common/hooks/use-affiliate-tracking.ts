import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

const AFFILIATE_STORAGE_KEY = 'affiliate_code'

export function useAffiliateTracking() {
    const [searchParams] = useSearchParams()

    useEffect(() => {
        const ref = searchParams.get('ref')
        if (ref) {
            // almacenamiento del codigo de afiliado en sessionStorage si esta presente en la URL
            // usamos sessionStorage para mantener el codigo durante la duracion de la sesion del navegador
            sessionStorage.setItem(AFFILIATE_STORAGE_KEY, ref)
            console.log(`Code [${ref}] tracked and persisted.`)
        }
    }, [searchParams])

    return {
        getAffiliateCode: () => sessionStorage.getItem(AFFILIATE_STORAGE_KEY),
        clearAffiliateCode: () => sessionStorage.removeItem(AFFILIATE_STORAGE_KEY)
    }
}
