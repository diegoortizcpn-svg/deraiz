# DeRaiz

Construí "DeRaíz", una web app de demostración de tokenización de producción agrícola de Latinoamérica sobre la red Stellar. Es un prototipo para una hackathon: TODO funciona en Stellar TESTNET, sin dinero real, y todos los proyectos son FICTICIOS.

## CONCEPTO
DeRaíz demuestra cómo la producción agrícola puede tener trazabilidad y rieles de cumplimiento (compliance) on-chain: el participante conecta su wallet, verifica su identidad (KYC) y, solo si es aprobado, el emisor habilita su wallet y puede reclamar tokens de trazabilidad de prueba. Metáfora visual: las raíces como red; cada proyecto es una raíz conectada a la misma red (Stellar).

## REGLAS DE CONTENIDO (OBLIGATORIAS, NO NEGOCIABLES)
- PROHIBIDO en toda la app: "invertir", "inversión", "inversor", "rendimiento", "rentabilidad", "ganancia", "retorno", "utilidad", "dividendo", "APY", "TIR", precios de tokens, montos invertidos o proyecciones económicas.
- Usar: "participante", "explorar proyecto", "reclamar tokens de prueba", "trazabilidad".
- Los tokens NO se compran: cada wallet verificada puede reclamar gratis 10 tokens de prueba por proyecto, una sola vez.
- Cada proyecto lleva un badge visible "Proyecto ficticio · Datos ilustrativos".
- Banner fijo superior: "Demo en Stellar Testnet · Proyectos ficticios · Sin dinero real · No constituye oferta de inversión ni de valores".
- Footer con aviso legal: "DeRaíz es un prototipo educativo desarrollado para una hackathon. Los tokens son de prueba, no tienen valor económico ni otorgan derechos sobre ingresos, activos o resultados."
- Todo el texto de la interfaz en español neutro.

## DISEÑO
Estilo: orgánico, sostenible y premium; agro-fintech sofisticada. Tiene que destacarse.
Lógica de color: VERDE = mundo real (campo, producción). VIOLETA = capa blockchain (wallet, tokens, transacciones, datos on-chain).
Paleta:
- Bosque #12332C (hero, navbar, secciones oscuras)
- Lima suave #D4F08C (CTAs principales, palabras destacadas en títulos)
- Verde vivo #4CAF2A (estados aprobados, checks)
- Violeta #8B5CF6 (todo lo on-chain: botones de wallet, badges de token, links al explorer, hashes)
- Crema #F5F2EA (fondos claros)
- Texto oscuro #0E1512
Tipografía (Google Fonts): títulos "Sora" (grandes, peso liviano 300-400, estilo editorial), cuerpo "Inter".
Detalles: cards blancas con bordes redondeados 24px e imagen arriba (con badge de estado sobre la imagen), botones tipo píldora, textura de grano sutil en fondos oscuros, sombras suaves, microanimaciones con framer-motion al hacer scroll.
Hero: fondo bosque, título grande en blanco con una palabra en lima, y a la derecha una ilustración SVG animada de raíces que crecen y conectan 4 nodos luminosos (los 4 proyectos); los nodos laten en violeta, representando la red Stellar.
Mobile-first, totalmente responsive.

## PÁGINAS
1. Home (/)
   - Hero: "Trazabilidad del agro desde la raíz" (con "raíz" en lima). Subtítulo: "Producción de Latinoamérica con identidad verificada y registro en Stellar". CTAs: "Explorar proyectos" y "Conectar wallet".
   - "Cómo funciona" en 4 pasos: 1) Conectá tu wallet Freighter 2) Verificá tu identidad con Didit 3) El emisor habilita tu wallet on-chain 4) Reclamá tus tokens de trazabilidad de prueba.
   - Proyectos (4 cards).
   - "Por qué Stellar": comisiones mínimas, confirmación en segundos, compliance nativo: solo wallets habilitadas por el emisor pueden tener el token, y el emisor puede revocar la habilitación y recuperar tokens.
   - Métricas demo: 4 proyectos, 2 países, wallets verificadas y tokens reclamados en testnet (mock por ahora).
   - "Hoja de ruta": 1) Demo en testnet (hoy) 2) Pilotos con productores reales 3) Operación bajo el marco regulatorio de cada país. Sin cifras económicas.
2. Proyectos (/proyectos): grid de cards con filtros por país y cultivo. Card: imagen, badge de estado, nombre, ubicación con bandera, código del token en badge violeta, botón "Explorar proyecto".
3. Detalle (/proyectos/:slug): hero con imagen, badge "Proyecto ficticio", ficha productiva, cronograma como timeline, bloque "Qué representa el token", riesgos del cultivo, bloque violeta "Datos on-chain" (código del activo, emisor, supply de prueba, link a https://stellar.expert/explorer/testnet) y panel lateral con el flujo: Conectar wallet → Verificar identidad → Crear trustline → Reclamar 10 tokens de prueba (cada paso habilitado solo si el anterior está completo).
4. Mi cuenta (/mi-cuenta): wallet, estado KYC (No iniciado / En proceso / Aprobado / Rechazado / En revisión), balances de tokens DeRaíz leídos de Horizon testnet, historial de transacciones con links al explorer.
5. Compliance (/compliance): diagrama del flujo KYC → habilitación de la wallet → emisión. Explicar: Didit verifica la identidad fuera de la cadena; el emisor tiene activados AUTH_REQUIRED (nadie puede tener el token sin habilitación), AUTH_REVOCABLE (la habilitación se puede revocar) y CLAWBACK (el emisor puede recuperar tokens); y solo habilita wallets con KYC aprobado.

## PROYECTOS FICTICIOS (en src/data/projects.ts)
Texto común "Qué representa el token": "1 token = 1 kg de producción de un lote demostrativo ficticio. Token de prueba en testnet: no se compra, no tiene valor económico y no otorga derechos sobre ingresos ni activos."
1. Frambuesa Valle Rojo · slug "frambuesa" · Lambayeque, Perú 🇵🇪 · Token FRAMB · Estado "En implantación"
   Ficha: variedad refloreciente, 2 cosechas por año; lote demo de 2 ha; 13.000 plantas; riego por goteo y macrotúneles. Supply de prueba: 10.000 FRAMB.
   Cronograma: preparación del suelo → plantación → primera cosecha → segunda cosecha.
   Riesgos: clima, plagas, ejecución de obra.
2. Hongos Micelio Sur · slug "hongos" · Buenos Aires, Argentina 🇦🇷 · Token HONGO · Estado "Ciclo en curso"
   Ficha: comestibles (gírgola, shiitake) y funcionales (reishi, melena de león); ciclos de 45 a 90 días; cada ciclo avanza por hitos validados por un tercero independiente. Supply de prueba: 3.000 HONGO.
   Cronograma: preparación de sustrato → inoculación → incubación → fructificación → cosecha.
   Riesgos: contaminación del cultivo, habilitaciones sanitarias, comercialización.
3. Pistacho Oasis Cuyano · slug "pistacho" · San Juan, Argentina 🇦🇷 · Token PISTA · Estado "En crecimiento"
   Ficha: cultivo de largo plazo, varios años desde la plantación hasta la primera cosecha; lote demo de 5 ha. Supply de prueba: 8.000 PISTA.
   Cronograma: plantación → crecimiento → primera cosecha → cosechas anuales.
   Riesgos: granizo, heladas tardías, viento Zonda, vecería (años alternados de alta y baja producción).
4. Miel Monte Dorado · slug "miel" · Santiago del Estero, Argentina 🇦🇷 · Token MIEL · Estado "Temporada activa"
   Ficha: miel de monte nativo, lejos de zonas cultivadas; floraciones de algarrobo y mistol; 300 colmenas. Supply de prueba: 6.000 MIEL.
   Cronograma: floración → extracción → envasado → despacho.
   Riesgos: dependencia del clima y la floración, sanidad de las colmenas.
Usar imágenes de stock de cada cultivo (sin logos ni marcas).

## WALLET Y STELLAR (IMPLEMENTAR YA)
- Integrar Freighter con @stellar/freighter-api: conectar, mostrar dirección abreviada, verificar que la red sea TESTNET (si no, aviso claro).
- Usar @stellar/stellar-sdk con Horizon https://horizon-testnet.stellar.org para leer balances y transacciones.
- Botón "Crear trustline": arma una operación changeTrust para el activo del proyecto y la firma con Freighter. Mostrar el hash con link al explorer.
- Configuración en src/config/assets.ts: un único emisor para los 4 activos (ISSUER = "G_ISSUER_PENDIENTE", placeholder) y los códigos FRAMB, HONGO, PISTA, MIEL.
- Botón "Reclamar 10 tokens de prueba": por ahora llama a una función placeholder claimTokens(walletAddress, assetCode) en src/lib/claim.ts (el backend se conecta después).

## KYC (DEJAR PREPARADO, SIN BACKEND TODAVÍA)
- Botón "Verificar identidad" que llama a una función placeholder startKyc(walletAddress) en src/lib/kyc.ts.
- Estados internos exactos: "Not Started", "In Progress", "Approved", "Declined", "In Review" (mostrados en español en la UI).
- Crear en Lovable Cloud/Supabase la tabla kyc_verifications (id, wallet_address unique, didit_session_id, status, created_at, updated_at) y la tabla token_claims (id, wallet_address, asset_code, amount, tx_hash, created_at), con restricción unique(wallet_address, asset_code).

## SEGURIDAD
- Ninguna clave secreta en el frontend. Nada de mainnet.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/529536fa-bdea-4779-ab56-444f955a4e25).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
