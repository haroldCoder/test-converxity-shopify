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
            shopId: "test-shop.myshopify.com", // aqui tiene que ir el id de la tienda, que este en la base de datos, por defecto es "test-affiliate"
            affiliateCode: affiliateCode,
            orderId: String(checkout.order.id),
            total: parseFloat(checkout.totalPrice.amount),
        }

        console.log('Enviando reporte de conversión al servidor...', payload)

        // Petición hacia tu túnel en localhost:3000
        fetch('https://54a5-2800-e2-2380-271a-225-f9df-2e74-6cee.ngrok-free.app/api/tracking/conversion', { // cambia la url por la de tu tunel del puerto 3000, para mas comodidad usa ngrok
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json',
            },
            keepalive: true,
        }).catch((err) => console.error('Error enviando conversión:', err))
    }
})
