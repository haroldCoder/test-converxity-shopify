import { analytics, browser } from '@shopify/web-pixels-extension'

// Pegar esto en el script del custom pixel de shopify

// 1. Captura de Tráfico (Atribución)
analytics.subscribe('all_events', async (event) => {
    const url = new URL(event.context.document.location.href)
    const ref = url.searchParams.get('ref')

    if (ref) {
        // Guardamos el código de afiliado en el almacenamiento del navegador
        await browser.localStorage.setItem('affiliate_code', ref)
        console.log('Afiliado detectado y guardado:', ref)
    }
})

// 2. Tracking de Conversión
analytics.subscribe('checkout_completed', async (event) => {
    const checkout = event.data.checkout
    const affiliateCode = await browser.localStorage.getItem('affiliate_code')

    if (affiliateCode && checkout.order) {
        const payload = {
            // Usamos el ID de la tienda del contexto
            shopId: String(event.context.shop.id || 'kodertes.myshopify.com'),
            affiliateCode: affiliateCode,
            orderId: String(checkout.order.id),
            total: parseFloat(checkout.totalPrice.amount),
        }

        console.log('Enviando reporte de conversión al servidor...', payload)

        // Petición hacia tu túnel en localhost:3000
        fetch('https://huge-jobs-happen.loca.lt/api/tracking/conversion', { // cambia la url por la de tu tunel del puerto 3000
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
            keepalive: true,
        }).catch((err) => console.error('Error enviando conversión:', err))
    }
})
