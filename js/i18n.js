/* Native i18n for the John Melek portfolio. EN default, FR + ES.
   Translations are applied by data-i18n keys on elements.
   Choice is stored in localStorage and reflected on <html lang>. */
(() => {
  const LANGS = ['en', 'fr', 'es'];
  const LABEL = { en: 'EN', fr: 'FR', es: 'ES' };

  const DICT = {
    // top bar
    'nav.available': { en: 'AVAILABLE', fr: 'DISPONIBLE', es: 'DISPONIBLE' },
    'nav.menu': { en: 'MENU', fr: 'MENU', es: 'MENÚ' },
    'nav.close': { en: 'CLOSE', fr: 'FERMER', es: 'CERRAR' },
    'nav.return': { en: 'RETURN', fr: 'RETOUR', es: 'VOLVER' },
    'nav.linkedin': { en: 'LINKEDIN', fr: 'LINKEDIN', es: 'LINKEDIN' },
    // loader
    'loader.name': { en: 'JOHN MELEK', fr: 'JOHN MELEK', es: 'JOHN MELEK' },
    // menu labels
    'm.overview': { en: 'OVERVIEW', fr: 'APERÇU', es: 'RESUMEN' },
    'm.work': { en: 'FIELD WORK', fr: 'TERRAIN', es: 'TRABAJO' },
    'm.set': { en: 'THE SET', fr: 'LA SÉRIE', es: 'EL SET' },
    'm.approach': { en: 'APPROACH', fr: 'MÉTHODE', es: 'ENFOQUE' },
    'm.log': { en: 'FIELD LOG', fr: 'JOURNAL', es: 'REGISTRO' },
    'm.brand': { en: 'BRAND', fr: 'MARQUE', es: 'MARCA' },
    'm.contact': { en: 'CONTACT', fr: 'CONTACT', es: 'CONTACTO' },
    // footer
    'f.build': { en: 'build it.', fr: 'construisons-le.', es: 'construyámoslo.' },
    'f.identity': { en: 'Forward Deploy Engineer · AI Manager', fr: 'Ingénieur Déploiement Terrain · IA Manager', es: 'Ingeniero Despliegue Terreno · IA Manager' },
    'f.selected': { en: 'Selected work, 2021 to present.', fr: 'Travaux choisis, 2021 à aujourd\'hui.', es: 'Trabajos seleccionados, 2021 a hoy.' },
    // generic
    'g.back': { en: 'BACK', fr: 'RETOUR', es: 'ATRÁS' },
    'g.open.channel': { en: 'OPEN A CHANNEL', fr: 'OUVRIR UN CANAL', es: 'ABRIR UN CANAL' },
    'g.read.log': { en: 'READ THE FULL LOG →', fr: 'LIRE LE JOURNAL →', es: 'LEER EL REGISTRO →' },
    'g.see.set': { en: 'SEE THE SELECTED SET →', fr: 'VOIR LA SÉRIE →', es: 'VER EL SET →' },
    'g.see.work': { en: 'SEE FIELD WORK →', fr: 'VOIR LE TERRAIN →', es: 'VER TRABAJO →' },
    // home
    'h.kick': { en: '● Available for deployment', fr: '● Disponible pour déploiement', es: '● Disponible para despliegue' },
    'h.sub': { en: 'I am a forward deploy engineer and AI manager. I walk into broken client integrations, dealership networks, and field offices, and I make the software <b>actually run</b> before the meeting ends. That includes standing up AI where it earns its place: assistants, document and data pipelines, and models wired into the tools your team already uses.', fr: 'Je suis ingénieur déploiement terrain et IA manager. J\'entre dans des intégrations client cassées, des réseaux de concessions et des sites terrain, et je fais tourner le logiciel <b>pour de vrai</b> avant la fin de la réunion. Cela inclut déployer l\'IA là où elle compte : assistants, pipelines documentaires et de données, et modèles reliés aux outils que votre équipe utilise déjà.', es: 'Soy ingeniero de despliegue en terreno e IA manager. Entro a integraciones cliente rotas, redes de concesionarios y oficinas de campo, y hago que el software <b>funcione de verdad</b> antes de que termine la reunión. Eso incluye montar IA donde suma: asistentes, pipelines de documentos y datos, y modelos conectados a las herramientas que tu equipo ya usa.' },
    'h.tag': { en: 'ON SITE // 2026', fr: 'SUR SITE // 2026', es: 'EN SITIO // 2026' },
    // section heads
    's.approach': { en: 'How the deployment runs', fr: 'Comment tourne le déploiement', es: 'Cómo funciona el despliegue' },
    's.fieldlog': { en: 'Two engagements, root cause first', fr: 'Deux missions, la cause d\'abord', es: 'Dos misiones, la causa primero' },
    's.work': { en: 'Selected engagements', fr: 'Missions choisies', es: 'Misiones seleccionadas' },
    's.note.sample': { en: 'A sample of field work. The full set spans more sectors and sites.', fr: 'Un échantillon de terrain. L\'ensemble couvre plus de secteurs et de sites.', es: 'Muestra de trabajo en terreno. El conjunto abarca más sectores y sitios.' },
    's.note.request': { en: 'Full case history available on request.', fr: 'Historique complet disponible sur demande.', es: 'Historial completo disponible bajo petición.' },
    's.set': { en: 'Six tools I ship', fr: 'Six outils que je livre', es: 'Seis herramientas que entrego' },
    's.set.note': { en: 'Selected samples. Each one runs with zero API keys. Source on GitHub.', fr: 'Échantillons choisis. Chacun tourne sans clé API. Source sur GitHub.', es: 'Muestras seleccionadas. Cada una corre sin claves API. Código en GitHub.' },
    // approach cards
    'a1.t': { en: 'Proof, not promises', fr: 'La preuve, pas la promesse', es: 'Prueba, no promesas' },
    'a1.p': { en: 'Every claim here is measured or drawn from a real engagement. Numbers are recovery counts, site ranges, and rollout windows. None are invented.', fr: 'Chaque affirmation ici est mesurée ou tirée d\'une mission réelle. Les chiffres sont des comptes de recovery, des périmètres de sites, des fenêtres de déploiement. Aucun n\'est inventé.', es: 'Cada afirmación aquí está medida o sale de una misión real. Los números son conteos de recuperación, rangos de sitios y ventanas de despliegue. Ninguno es inventado.' },
    'a2.t': { en: 'Local-first, key-free', fr: 'Local d\'abord, sans clé', es: 'Local primero, sin clave' },
    'a2.p': { en: 'The tools I build run on the client machine with no API key and no cloud dependency. You see them work the same afternoon, then own the code.', fr: 'Les outils que je construis tournent sur la machine cliente, sans clé API ni dépendance cloud. Vous les voyez fonctionner le même après-midi, puis vous possédez le code.', es: 'Las herramientas que construyo corren en la máquina del cliente, sin clave API ni dependencia de nube. Las ves funcionar esa misma tarde, luego tienes el código.' },
    'a3.t': { en: 'Safe by default', fr: 'Sûr par défaut', es: 'Seguro por defecto' },
    'a3.p': { en: 'Scoped recon stays local. Rollouts run in waves with one-click rollback. Nothing destructive ships without a verified cause first.', fr: 'La recon ciblée reste locale. Les déploiements se font en vagues, avec rollback en un clic. Rien de destructif ne part sans cause vérifiée.', es: 'La recon acotada queda local. Los despliegues van en olas, con rollback en un clic. Nada destructivo sale sin causa verificada.' },
    'a4.t': { en: 'AI that ships', fr: 'Une IA qui livre', es: 'IA que entrega' },
    'a4.p': { en: 'As an AI manager I put models where they pay off: assistants on your data, document and record pipelines, and inference wired into the tools your team already opens. Every deployment is measured, not a demo.', fr: 'En tant qu\'IA manager, je place les modèles où ils paient : assistants sur vos données, pipelines documentaires et de records, et inférence reliée aux outils que votre équipe ouvre déjà. Chaque déploiement est mesuré, pas une démo.', es: 'Como IA manager coloco modelos donde rinden: asistentes sobre tus datos, pipelines de documentos y registros, e inferencia conectada a las herramientas que tu equipo ya abre. Cada despliegue se mide, no es demo.' },
    's.method': { en: 'What you get', fr: 'Ce que vous obtenez', es: 'Lo que obtienes' },
    // metrics
    'm.sites': { en: 'Sites in range', fr: 'Sites couverts', es: 'Sitios cubiertos' },
    'm.records': { en: 'Records recovered', fr: 'Records récupérés', es: 'Registros recuperados' },
    'm.keys': { en: 'Required to demo', fr: 'Requis pour demo', es: 'Requerido para demo' },
    'm.unblock': { en: 'Typical unblock', fr: 'Déblocage typique', es: 'Desbloqueo típico' },
    'm.keys.unit': { en: ' keys', fr: ' clés', es: ' claves' },
    'm.day.unit': { en: ' day', fr: ' jour', es: ' día' },
    // field log
    'fl.situation': { en: 'Situation', fr: 'Situation', es: 'Situación' },
    'fl.approach': { en: 'Approach', fr: 'Approche', es: 'Enfoque' },
    'fl.result': { en: 'Result', fr: 'Résultat', es: 'Resultado' },
    'fl.c1.t': { en: 'Bulk customer-data recovery across 12 distributed sites', fr: 'Recovery de données client sur 12 sites distribués', es: 'Recuperación de datos cliente en 12 sitios distribuidos' },
    'fl.c1.s': { en: 'An automotive group\'s nightly customer-data sync had died. Records stopped flowing between the CRM and the dealerships. Support tickets piled up; nobody had a count of what was missing.', fr: 'La synchro nocturne des données client d\'un groupe automobile était morte. Les records ne circulaient plus entre le CRM et les concessions. Les tickets s\'accumulaient ; personne n\'avait le compte du manquant.', es: 'La sincronización nocturna de datos cliente de un grupo automotriz había muerto. Los registros dejaron de fluir entre el CRM y las concesionarias. Los tickets se apilaban; nadie tenía el conteo de lo faltante.' },
    'fl.c1.a': { en: 'Built a reconciliation engine that pulled the three sources (CSV export, REST JSON, legacy dump), matched records by ID, and flagged every field-level conflict with proof of what each side held.', fr: 'J\'ai construit un moteur de réconciliation qui a tiré les trois sources (export CSV, REST JSON, dump legacy), matché par ID, et signalé chaque conflit de champ avec preuve de ce que chaque côté détenait.', es: 'Construí un motor de reconciliación que trajo las tres fuentes (CSV, REST JSON, dump legacy), emparejó por ID y marcó cada conflicto de campo con prueba de lo que cada lado tenía.' },
    'fl.c1.r': { en: 'Recovered <b>1,830</b> missing records across 12 sites with a 100% match rate on record ID, zero destructive writes, and the nightly batch back to 0 errors.', fr: 'Récupéré <b>1 830</b> records manquants sur 12 sites, taux de match 100% sur l\'ID, zéro écriture destructive, et le batch nocturne revenu à 0 erreur.', es: 'Recuperé <b>1 830</b> registros faltantes en 12 sitios con 100% de match por ID, cero escrituras destructivas y el batch nocturno de vuelta a 0 errores.' },
    'fl.c2.t': { en: 'Real-time gateway stall on a streaming-only upstream', fr: 'Blocage temps réel sur un upstream streaming only', es: 'Corte en tiempo real en un upstream solo streaming' },
    'fl.c2.s': { en: 'A client gateway had gone silent. Dashboards showed no live data, but the upstream was up and serving.', fr: 'Une gateway client s\'était tue. Les dashboards ne montraient plus de données, mais l\'upstream répondait.', es: 'Una gateway cliente se había apagado. Los dashboards no mostraban datos, pero el upstream estaba activo.' },
    'fl.c2.a': { en: 'Read the upstream contract instead of guessing. It only speaks Server-Sent Events; the client was requesting a non-streaming response and timing out waiting for a body that never comes.', fr: 'Lu le contrat upstream au lieu de deviner. Il ne parle que Server-Sent Events ; le client demandait une réponse non-stream et timeout dans le vide.', es: 'Leí el contrato del upstream en vez de adivinar. Solo habla Server-Sent Events; el cliente pedía respuesta no-stream y hacía timeout esperando un body que nunca llega.' },
    'fl.c2.r': { en: 'Restored streaming with a <b>one-line client change</b>. No sudo, no network change, no downtime.', fr: 'Streaming restauré avec <b>un changement client d\'une ligne</b>. Pas de sudo, pas de changement réseau, zéro coupure.', es: 'Streaming restaurado con <b>un cambio de una línea en el cliente</b>. Sin sudo, sin cambio de red, sin caída.' },
    // brand
    'b.title': { en: 'Identity system', fr: 'Système d\'identité', es: 'Sistema de identidad' },
    'b.intro': { en: 'A loud, professional mark built for a forward deploy engineer who also runs AI. Black field, one hot accent, a square monogram, and a mono label. It reads the same on a business card, a slide, or a terminal.', fr: 'Une marque forte et pro, pour un ingénieur déploiement terrain qui fait aussi de l\'IA. Champ noir, un accent chaud, un monogramme carré, un label mono. Elle se lit pareil sur une carte de visite, une slide ou un terminal.', es: 'Una marca fuerte y pro, para un ingeniero de despliegue en terreno que también hace IA. Campo negro, un acento caliente, un monograma cuadrado, un label mono. Se lee igual en tarjeta, slide o terminal.' },
    'b.monogram': { en: 'Monogram', fr: 'Monogramme', es: 'Monograma' },
    'b.monogram.p': { en: 'The JM mark. Square frame, accent edge, grain. Primary lockup on dark, reversed on light.', fr: 'La marque JM. Cadre carré, bord accent, grain. Lockup principal sur fond sombre, inversé sur clair.', es: 'La marca JM. Marco cuadrado, borde acento, grano. Lockup principal sobre oscuro, invertido sobre claro.' },
    'b.palette': { en: 'Palette', fr: 'Palette', es: 'Paleta' },
    'b.palette.p': { en: 'Ink #0a0a0b. Paper #f4f1ea. Signal #ff4d2e. Wire #2e6bff. One accent at a time, never all at once.', fr: 'Encre #0a0a0b. Papier #f4f1ea. Signal #ff4d2e. Fil #2e6bff. Un accent à la fois, jamais tous ensemble.', es: 'Tinta #0a0a0b. Papel #f4f1ea. Señal #ff4d2e. Cable #2e6bff. Un acento a la vez, nunca todos juntos.' },
    'b.type': { en: 'Type', fr: 'Typo', es: 'Tipo' },
    'b.type.p': { en: 'Archivo 800 for statements. JetBrains Mono for labels and data. Uppercase, tight tracking, no soft corners.', fr: 'Archivo 800 pour les titres. JetBrains Mono pour labels et data. Majuscules, tracking serré, sans angle doux.', es: 'Archivo 800 para títulos. JetBrains Mono para labels y data. Mayúsculas, tracking apretado, sin esquinas suaves.' },
    'b.use': { en: 'How it is applied', fr: 'Comment on l\'applique', es: 'Cómo se aplica' },
    'b.r1': { en: 'Logo sits top-left on every page, always links home.', fr: 'Le logo est en haut à gauche sur chaque page, toujours lien vers l\'accueil.', es: 'El logo está arriba a la izquierda en cada página, siempre enlaza al inicio.' },
    'b.r2': { en: 'Accent is reserved for one active element per view: a link, a tag, a live dot.', fr: 'L\'accent est réservé à un élément actif par vue : un lien, un tag, un dot live.', es: 'El acento se reserva para un elemento activo por vista: un link, un tag, un dot live.' },
    'b.r3': { en: 'Never tilt, never add gradients, never stretch the frame.', fr: 'Jamais d\'inclinaison, jamais de dégradé, jamais d\'étirement du cadre.', es: 'Nunca inclinar, nunca degradados, nunca estirar el marco.' },
    'b.r4': { en: 'On light backgrounds, invert to paper field with ink mark.', fr: 'Sur fond clair, inverser en champ papier avec marque encre.', es: 'Sobre fondo claro, invertir a campo papel con marca tinta.' },
    // contact
    'c.title': { en: 'Open a channel', fr: 'Ouvrir un canal', es: 'Abrir un canal' },
    'c.intro': { en: 'If something is broken at a client site and you need it running before the meeting ends, that is the work. Pick a channel below to reach me directly.', fr: 'Si quelque chose est cassé sur un site client et que vous en avez besoin avant la fin de la réunion, c\'est ça le travail. Choisissez un canal ci-dessous.', es: 'Si algo está roto en un sitio cliente y lo necesitas antes de que termine la reunión, ese es el trabajo. Elige un canal abajo para contactarme.' },
    'c.linkedin': { en: 'LinkedIn', fr: 'LinkedIn', es: 'LinkedIn' },
    'c.email': { en: 'Email', fr: 'Email', es: 'Email' },
    'c.github': { en: 'GitHub', fr: 'GitHub', es: 'GitHub' },
    'c.lin.sub': { en: 'john-melek-182086256', fr: 'john-melek-182086256', es: 'john-melek-182086256' },
    'c.mail.sub': { en: 'john.melekdls7@gmail.com', fr: 'john.melekdls7@gmail.com', es: 'john.melekdls7@gmail.com' },
    'c.gh.sub': { en: 'github.com/johnmelek', fr: 'github.com/johnmelek', es: 'github.com/johnmelek' },
    // chrome misc
    'nav.role': { en: '· FORWARD DEPLOY ENGINEER · AI MANAGER', fr: '· INGÉNIEUR DÉPLOIEMENT TERRAIN · IA MANAGER', es: '· INGENIERO DESPLIEGUE TERRENO · IA MANAGER' },
    // project pages (shared)
    'pj.back': { en: 'THE SELECTED SET', fr: 'LA SÉRIE', es: 'EL SET' },
    'pj.live': { en: 'LIVE APP', fr: 'APP LIVE', es: 'APP EN VIVO' },
    'pj.source': { en: 'SOURCE REPO →', fr: 'REPO SOURCE →', es: 'REPO FUENTE →' },
    'pj.next': { en: 'Next:', fr: 'Suivant :', es: 'Siguiente:' },
    'pj.runs': { en: 'runs offline', fr: 'tourne offline', es: 'corre offline' },
    'pj.offline': { en: 'offline', fr: 'offline', es: 'offline' },
    'pj.nokey': { en: 'no key', fr: 'sans clé', es: 'sin clave' },
    'pj.rollback': { en: 'rollback', fr: 'rollback', es: 'rollback' },
    'pj.local': { en: 'local', fr: 'local', es: 'local' },
    'pj.live2': { en: 'live', fr: 'live', es: 'live' },
    // edgesync
    'es.sub': { en: 'On-site data reconciliation engine', fr: 'Moteur de réconciliation sur site', es: 'Motor de reconciliación en sitio' },
    'es.desc': { en: 'Walk into a customer site. Their data lives in three places that do not agree: a CSV export, a REST JSON endpoint, and a legacy fixed-width dump. EdgeSync ingests all three, reconciles by key, and surfaces every field-level conflict with proof. Resolve a conflict below and watch the open count drop, live.', fr: 'Entrez sur un site client. Leurs données vivent en trois endroits qui ne sont pas d\'accord : un export CSV, un endpoint REST JSON, et un dump legacy fixed-width. EdgeSync ingère les trois, réconcilie par clé, et expose chaque conflit de champ avec preuve. Résolvez un conflit ci-dessous et voyez le compteur baisser, live.', es: 'Entra a un sitio cliente. Sus datos viven en tres lugares que no coinciden: un CSV, un endpoint REST JSON y un dump legacy fixed-width. EdgeSync ingiere los tres, reconcilia por clave y expone cada conflicto de campo con prueba. Resuelve un conflicto abajo y ve el contador bajar, en vivo.' },
    'es.pull': { en: '"The data disagreed in three systems. We made it agree in one afternoon."', fr: '"Les données divergeaient dans trois systèmes. On les a faites concorder en une après-midi."', es: '"Los datos discrepaban en tres sistemas. Los hicimos coincidir en una tarde."' },
    'es.pulls': { en: 'Automotive recovery engagement', fr: 'Mission recovery automobile', es: 'Misión recovery automotriz' },
    'es.runidx': { en: 'FILE / 01-EDGESYNC · reconciliation engine', fr: 'FICHIER / 01-EDGESYNC · moteur de réconciliation', es: 'ARCHIVO / 01-EDGESYNC · motor de reconciliación' },
    'es.cap': { en: 'EdgeSync reconciling 12 records across CSV, REST, and legacy sources.', fr: 'EdgeSync réconciliant 12 records sur CSV, REST et sources legacy.', es: 'EdgeSync reconciliando 12 registros entre CSV, REST y fuentes legacy.' },
    'es.h4': { en: 'CONFLICT CONSOLE · click RESOLVE to match', fr: 'CONSOLE DE CONFLITS · cliquez RESOLVE', es: 'CONSOLA DE CONFLICTOS · clica RESOLVE' },
    'es.done': { en: '✓ ALL CONFLICTS RESOLVED · unified dataset emitted', fr: '✓ TOUS LES CONFLITS RÉSOLUS · dataset unifié émis', es: '✓ TODOS LOS CONFLICTOS RESUELTOS · dataset unificado emitido' },
    // atlasdeploy
    'at.sub': { en: 'Wave deployment orchestrator', fr: 'Orchestrateur de déploiement par vagues', es: 'Orquestador de despliegue por olas' },
    'at.desc': { en: 'A rollout to many sites is either a calm wave sequence or a 3am outage. AtlasDeploy ships in waves with verified rollback. Hit RUN WAVE to deploy the next wave; nodes light up as they come online. Run it three times to finish, a fourth to reset.', fr: 'Un déploiement multi-sites est soit une séquence calme en vagues, soit un incident 3h du matin. AtlasDeploy livre par vagues avec rollback vérifié. Cliquez RUN WAVE pour la vague suivante ; les noeuds s\'allument en ligne. Lancez trois fois pour finir, une quatrième pour reset.', es: 'Un despliegue a muchos sitios es o una secuencia de olas tranquila o un incidente a las 3am. AtlasDeploy entrega en olas con rollback verificado. Pulsa RUN WAVE para la siguiente ola; los nodos se encienden al entrar. Corre tres veces para terminar, una cuarta para reset.' },
    'at.pull': { en: '"Twelve sites. Three waves. Zero 3am pages."', fr: '"Douze sites. Trois vagues. Zéro page à 3h."', es: '"Doce sitios. Tres olas. Cero páginas a las 3am."' },
    'at.pulls': { en: 'Verified rollback', fr: 'Rollback vérifié', es: 'Rollback verificado' },
    'at.runidx': { en: 'FILE / 06-ATLASDEPLOY · wave orchestrator', fr: 'FICHIER / 06-ATLASDEPLOY · orchestrateur de vagues', es: 'ARCHIVO / 06-ATLASDEPLOY · orquestador de olas' },
    'at.cap': { en: 'AtlasDeploy orchestrating wave deploys with verified rollback.', fr: 'AtlasDeploy orchestre des vagues avec rollback vérifié.', es: 'AtlasDeploy orquesta olas con rollback verificado.' },
    'at.h4': { en: 'DISPATCH BOARD · run a wave', fr: 'TABLEAU D\'ENVOI · lancer une vague', es: 'TABLERO DE ENVÍO · lanza una ola' },
    'at.go': { en: 'RUN WAVE →', fr: 'LANCER LA VAGUE →', es: 'CORRER OLA →' },
    // fieldconsole
    'fc.sub': { en: 'Fleet ops console', fr: 'Console ops flotte', es: 'Consola ops de flota' },
    'fc.desc': { en: 'One screen for every location during a rollout. Click any site to flip its status; the log records the change and metrics stream on their own. This is the panel you leave open on the second monitor while a wave ships.', fr: 'Un écran par site pendant un déploiement. Cliquez un site pour basculer son statut ; le log enregistre et les métriques streament seules. C\'est le panneau laissé ouvert sur le second écran pendant une vague.', es: 'Una pantalla por sitio durante un despliegue. Clica un sitio para voltear su estado; el log registra y las métricas fluyen solas. Es el panel que dejas abierto en el segundo monitor mientras corre la ola.' },
    'fc.pull': { en: '"Six sites. One panel. Nothing goes dark without someone seeing it."', fr: '"Six sites. Un panneau. Rien ne s\'éteint sans que quelqu\'un le voie."', es: '"Seis sitios. Un panel. Nada se apaga sin que alguien lo vea."' },
    'fc.pulls': { en: 'Multi-site rollout', fr: 'Déploiement multi-sites', es: 'Despliegue multi-sitio' },
    'fc.runidx': { en: 'FILE / 02-FIELDCONSOLE · fleet ops', fr: 'FICHIER / 02-FIELDCONSOLE · ops flotte', es: 'ARCHIVO / 02-FIELDCONSOLE · ops de flota' },
    'fc.cap': { en: 'FieldConsole fleet panel with WebSocket status and a streaming log tail.', fr: 'Panneau flotte FieldConsole, statut WebSocket et log streamé.', es: 'Panel de flota FieldConsole con estado WebSocket y log stream.' },
    'fc.h4': { en: 'MISSION CONTROL · click a site to toggle', fr: 'MISSION CONTROL · cliquez un site', es: 'MISSION CONTROL · clica un sitio' },
    // quoteforge
    'qf.sub': { en: 'Internal-tool generator', fr: 'Générateur d\'outils internes', es: 'Generador de herramientas internas' },
    'qf.desc': { en: 'You are at a client site. Someone says "I need a form to track test-drives." QuoteForge runs that sentence through a model and turns it into a real, working single-file web app. Type your own sentence and generate a real app in the browser. No server, no key.', fr: 'Vous êtes sur un site client. Quelqu\'un dit "il me faut un formulaire pour suivre les essais." QuoteForge passe la phrase dans un modèle et en fait une vraie app web single-file. Tapez votre phrase et générez une vraie app dans le navigateur. Pas de serveur, pas de clé.', es: 'Estás en un sitio cliente. Alguien dice "necesito un formulario para seguir test-drives." QuoteForge pasa la frase por un modelo y la convierte en una app web single-file real. Escribe tu frase y genera una app real en el navegador. Sin servidor, sin clave.' },
    'qf.pull': { en: '"They described a tool in one sentence. We shipped it before lunch."', fr: '"Ils ont décrit un outil en une phrase. Livré avant le déjeuner."', es: '"Describieron una herramienta en una frase. Entregada antes del almuerzo."' },
    'qf.pulls': { en: 'Field generation', fr: 'Génération terrain', es: 'Generación en terreno' },
    'qf.runidx': { en: 'FILE / 03-QUOTEFORGE · generator', fr: 'FICHIER / 03-QUOTEFORGE · générateur', es: 'ARCHIVO / 03-QUOTEFORGE · generador' },
    'qf.cap': { en: 'QuoteForge turning a plain sentence into a working single-file app, offline.', fr: 'QuoteForge transforme une phrase en app single-file, offline.', es: 'QuoteForge convierte una frase en app single-file, offline.' },
    'qf.h4': { en: 'JOHN / FORGE · describe the tool you need', fr: 'JOHN / FORGE · décrivez l\'outil', es: 'JOHN / FORGE · describe la herramienta' },
    'qf.go': { en: 'GENERATE →', fr: 'GÉNÉRER →', es: 'GENERAR →' },
    'qf.ph': { en: 'describe the tool you need...', fr: 'décrivez l\'outil needed...', es: 'describe la herramienta...' },
    // recon
    'rc.sub': { en: 'Scoped recon and surface map', fr: 'Recon ciblée et carte de surfaces', es: 'Recon acotada y mapa de superficies' },
    'rc.desc': { en: 'Before you touch anything, you map what is exposed. ReconPlanner declares a scope, scans locally and safely, and renders every surface as a node on a graph. Click a node to read what was found. Nothing leaves the machine.', fr: 'Avant de toucher, on cartographie l\'exposition. ReconPlanner déclare un scope, scan localement et sûrement, et rend chaque surface en noeud sur un graphe. Cliquez un noeud pour lire. Rien ne sort de la machine.', es: 'Antes de tocar, mapeas lo expuesto. ReconPlanner declara un scope, escanea local y seguro, y dibuja cada superficie como nodo en un grafo. Clica un nodo para leer. Nada sale de la máquina.' },
    'rc.pull': { en: '"We mapped the blast radius before we touched a single service."', fr: '"On a cartographié le rayon d\'impact avant de toucher un service."', es: '"Mapeamos el radio de impacto antes de tocar un servicio."' },
    'rc.pulls': { en: 'Safe local scan', fr: 'Scan local sûr', es: 'Scan local seguro' },
    'rc.runidx': { en: 'FILE / 04-RECON · scoped recon', fr: 'FICHIER / 04-RECON · recon ciblée', es: 'ARCHIVO / 04-RECON · recon acotada' },
    'rc.cap': { en: 'ReconPlanner mapping declared scope with safe local scanning.', fr: 'ReconPlanner cartographie le scope avec scan local sûr.', es: 'ReconPlanner mapea el scope con scan local seguro.' },
    'rc.h4': { en: 'SURFACE MAP · click a node to inspect', fr: 'CARTE DE SURFACES · cliquez un noeud', es: 'MAPA DE SUPERFICIES · clica un nodo' },
    'rc.panel': { en: 'Click a surface to inspect.', fr: 'Cliquez une surface à inspecter.', es: 'Clica una superficie para inspeccionar.' },
    // pulse
    'pl.sub': { en: 'Uptime and response monitor', fr: 'Moniteur de disponibilité', es: 'Monitor de disponibilidad' },
    'pl.desc': { en: 'After you deploy something at a client site, someone needs to know when it stops answering. Pulse watches the endpoint and keeps a live heartbeat. The readout below updates on its own, every seven hundred milliseconds.', fr: 'Après un déploiement, il faut savoir quand ça ne répond plus. Pulse surveille l\'endpoint et garde un heartbeat live. Le readout se met à jour seul, tous les sept cents ms.', es: 'Tras un despliegue en sitio cliente, alguien debe saber cuándo deja de responder. Pulse vigila el endpoint y mantiene un heartbeat en vivo. El readout se actualiza solo, cada setecientos ms.' },
    'pl.pull': { en: '"It did not page us. Pulse already had."', fr: '"Pas de page. Pulse avait déjà."', es: '"No nos paginó. Pulse ya lo tenía."' },
    'pl.pulls': { en: 'Incident, avoided', fr: 'Incident évité', es: 'Incidente, evitado' },
    'pl.runidx': { en: 'FILE / 05-PULSE · uptime monitor', fr: 'FICHIER / 05-PULSE · moniteur dispo', es: 'ARCHIVO / 05-PULSE · monitor dispo' },
    'pl.cap': { en: 'Pulse monitoring response time, cert expiry, and SSE status.', fr: 'Pulse surveille temps de réponse, expiry cert, statut SSE.', es: 'Pulse monitorea tiempo de respuesta, expiry cert y estado SSE.' },
    'pl.h4': { en: 'OSCILLOSCOPE · live probe', fr: 'OSCILLOSCOPE · probe live', es: 'OSCILLOSCOPE · sonda live' }
  };

  function getLang() {
    let l = localStorage.getItem('jm-lang');
    if (!l || !LANGS.includes(l)) l = 'en';
    return l;
  }

  function apply(lang) {
    document.documentElement.setAttribute('lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      const entry = DICT[key];
      if (!entry) return;
      const txt = entry[lang] || entry.en;
      if (txt != null) el.innerHTML = txt;
    });
    // mark active switcher button
    document.querySelectorAll('.lang button').forEach(b => {
      b.classList.toggle('active', b.dataset.lang === lang);
    });
    localStorage.setItem('jm-lang', lang);
  }

  // expose for nav.js switcher
  window.__i18n = { apply, getLang, LANGS, LABEL, DICT };

  document.addEventListener('DOMContentLoaded', () => apply(getLang()));
})();
